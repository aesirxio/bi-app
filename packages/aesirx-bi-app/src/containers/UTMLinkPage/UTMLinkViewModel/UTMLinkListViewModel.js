/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
import UTMTrackingEventModel from 'containers/UTMTrackingPage/UTMTrackingModel/UTMTrackingListEventModel';

class UTMLinkListViewModel {
  formStatus = PAGE_STATUS.READY;
  formCurrencyStatus = PAGE_STATUS.READY;
  statusUTM = PAGE_STATUS.READY;
  dataUTM = null;
  utmLinkListViewModel = { formPropsData: [{ utm_currency: '' }] };
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
    listUTMLinks: [],
    pagination: null,
    listUTMLinksWithoutPagination: [],
  };

  constructor(utmLinkStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.utmLinkStore = utmLinkStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  setForm = (utmLinkListViewModel) => {
    this.utmLinkListViewModel = utmLinkListViewModel;
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
    this.utmLinkStore.getAttributeDateUtm(
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
    const data = await this.utmLinkStore.getList(activeDomain[0]);

    runInAction(() => {
      if (!data?.error) {
        this.callbackOnSuccessGetUTMLinksHandler(data?.response);
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
        'filter[attribute_name][0]': 'utm_campaign',
        'filter_not[visibility_change]': 'true',
      },
      null,
      globalStoreViewModel
    );
    if (!this.utmLinkListViewModel.formPropsData.utm_currency) {
      this.utmLinkListViewModel.formPropsData.utm_currency =
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
    this.successResponse.listUTMLinksWithoutPagination = [];
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

  deleteUTMLinks = async (arr, activeDomain, globalStoreViewModel) => {
    const data = await this.utmLinkStore.delete(arr);
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

  callbackOnSuccessGetUTMLinksHandler = (result) => {
    if (result?.length) {
      this.successResponse.listUTMLinksWithoutPagination = result?.map((o) => {
        return {
          id: o?._id?.$oid,
          label: o?.campaign_label,
          utm_source: o?.utm_source,
          utm_campaign: o?.utm_campaign,
          value: o?.value,
          value_type: o?.value_type,
          engagement_weight: o?.engagement_weight,
          publish: o?.publish,
          link: o?.link,
        };
      });
    } else {
      this.successResponse.listUTMLinksWithoutPagination = [];
    }
  };

  isLoading = () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
  };

  update = async (formData, activeDomain, globalStoreViewModel) => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.utmLinkStore.update(formData);
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

  updateConsentsTemplate = async (formData, activeDomain, globalStoreViewModel, integration) => {
    this.formCurrencyStatus = PAGE_STATUS.LOADING;
    const data = await this.utmLinkStore.updateConsentsTemplate(formData, integration);
    runInAction(async () => {
      if (!data?.error) {
        this.utmLinkListViewModel.formPropsData.utm_currency = formData?.utm_currency;
        await this.initializeAllData(activeDomain, globalStoreViewModel);
        this.onSuccessConsentTemplateHandler(data?.response, 'Updated successfully');
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

export default UTMLinkListViewModel;
