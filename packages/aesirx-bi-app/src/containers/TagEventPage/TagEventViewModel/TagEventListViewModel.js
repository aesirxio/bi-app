/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
import UTMTrackingEventModel from 'containers/UTMTrackingPage/UTMTrackingModel/UTMTrackingListEventModel';

class TagEventListViewModel {
  formStatus = PAGE_STATUS.READY;
  formCurrencyStatus = PAGE_STATUS.READY;
  statusUTM = PAGE_STATUS.READY;
  dataUTM = null;
  tagEventListViewModel = { formPropsData: [{ utm_currency: '' }] };
  items = [];
  filter = {};
  successResponse = {
    state: false,
    content_id: '',
    listPublishStatus: [],
    1: [],
    filters: {
      'list[limit]': 50,
    },
    listTagEvents: [],
    pagination: null,
    listTagEventsWithoutPagination: [],
  };

  constructor(tagEventStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.tagEventStore = tagEventStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  setForm = (tagEventListViewModel) => {
    this.tagEventListViewModel = tagEventListViewModel;
  };

  getUTMData = async (dataFilter, dateFilter, globalStoreViewModel) => {
    this.statusUTM = PAGE_STATUS.LOADING;
    this.dataFilterUTM = {
      page_size: '1000',
      ...this.dataFilterUTM,
      ...dataFilter,
    };
    const dateRangeFilter = {
      ...(globalStoreViewModel.dateFilter ? { ...globalStoreViewModel.dateFilter } : {}),
      ...dateFilter,
    };
    this.tagEventStore.getAttributeDateTagEvent(
      this.dataFilterUTM,
      dateRangeFilter,
      this.callbackOnDataUTMSuccessHandler,
      this.callbackOnErrorHandler,
      globalStoreViewModel
    );
  };

  initializeAllData = async (activeDomain, globalStoreViewModel) => {
    runInAction(() => {
      this.successResponse.state = false;
    });
    const data = await this.tagEventStore.getList(activeDomain[0]);

    runInAction(() => {
      if (!data?.error) {
        this.callbackOnSuccessGetTagEventsHandler(data?.response);
      } else {
        this.onErrorListHandler(data?.response);
      }
      this.successResponse.state = true;
    });

    this.getUTMData(
      {
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      },
      null,
      globalStoreViewModel
    );
    if (!this.tagEventListViewModel.formPropsData.utm_currency) {
      this.tagEventListViewModel.formPropsData.utm_currency =
        globalStoreViewModel?.dataStream?.utm_currency;
    }
  };

  handleFilter = (filter) => {
    this.filter = { ...this.filter, ...filter };
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
  };

  onErrorHandler = (error) => {
    Array.isArray(error?._messages) && error?._messages[0]?.message
      ? notify(error?._messages[0]?.message, 'error')
      : error?.message && notify(error?.message, 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  onErrorListHandler = (error) => {
    this.successResponse.listTagEventsWithoutPagination = [];
    if (error?.code === 404) {
      notify('Cannot create!', 'error');
    } else {
      Array.isArray(error?._messages) && error?._messages[0]?.message
        ? notify(error?._messages[0]?.message, 'error')
        : error?.message && notify(error?.message, 'error');
    }

    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  deleteTagEvents = async (arr, activeDomain, globalStoreViewModel) => {
    const data = await this.tagEventStore.delete(arr);
    runInAction(async () => {
      if (!data?.error) {
        await this.initializeAllData(activeDomain, globalStoreViewModel);
        this.onSuccessHandler(data?.response, 'Deleted successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  callbackOnSuccessGetTagEventsHandler = (result) => {
    if (result?.length) {
      this.successResponse.listTagEventsWithoutPagination = result?.map((o) => {
        return {
          id: o?._id?.$oid,
          metric_value: o?.metric_value,
          engagement_value: o?.engagement_value,
          publish: o?.publish,
          event_name: o?.event_name,
        };
      });
    } else {
      this.successResponse.listTagEventsWithoutPagination = [];
    }
  };

  isLoading = () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
  };

  update = async (formData, activeDomain, globalStoreViewModel) => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.tagEventStore.update(formData);
    runInAction(async () => {
      if (!data?.error) {
        await this.initializeAllData(activeDomain, globalStoreViewModel);
        this.onSuccessHandler(data?.response, 'Updated successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
    return data;
  };

  onSuccessConsentTemplateHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
      this.formCurrencyStatus = PAGE_STATUS.READY;
    }
  };

  callbackOnDataUTMSuccessHandler = (data, globalStoreViewModel) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusUTM = PAGE_STATUS.READY;
        if (data?.length) {
          data = data?.map((item) => {
            return {
              date: item?.date,
              name: item?.name,
              values:
                item?.name === 'gad_source'
                  ? [
                      {
                        value: 'Google Adword',
                        count: item?.values?.reduce(
                          (n, { count }) => parseInt(n) + parseInt(count),
                          0
                        ),
                      },
                    ]
                  : item?.values,
            };
          });
        }
        const transformData = new UTMTrackingEventModel(data, globalStoreViewModel);
        this.dataUTM = transformData;
      }
    } else {
      this.statusUTM = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnErrorHandler = (error) => {
    this.statusUTM = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };
}

export default TagEventListViewModel;
