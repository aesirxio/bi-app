/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
class TagEventDetailViewModel {
  formStatus = PAGE_STATUS.READY;
  formTagEventsStatus = PAGE_STATUS.READY;
  tagEventDetailViewModel = { formPropsData: [{}] };
  aliasChange = '';
  tagEventList = [];
  uniqueTagEvents = [];
  successResponse = {
    state: true,
    content_id: '',
    filters: { limit: 0 },
  };

  constructor(tagEventStore) {
    makeAutoObservable(this);
    this.tagEventStore = tagEventStore;
  }

  setForm = (tagEventDetailViewModel) => {
    this.tagEventDetailViewModel = tagEventDetailViewModel;
  };

  initializeData = async (activeDomain) => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.tagEventStore.getDetail(
      this.tagEventDetailViewModel.formPropsData?._id?.$oid,
      activeDomain
    );

    runInAction(() => {
      if (!data?.error) {
        this.onGetTagEventSuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  getTagEventList = async (activeDomain) => {
    runInAction(() => {
      this.formStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.tagEventStore.getList(activeDomain);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, '');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  create = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const formattedData = this.tagEventDetailViewModel.formPropsData;
    if (!formattedData._id?.$oid) {
      delete formattedData._id;
    }
    if (!formattedData?.value_type) {
      formattedData.value_type = 'visit';
    }
    const data = await this.tagEventStore.create(formattedData);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, 'Created successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
    return data;
  };

  update = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const formattedData = this.tagEventDetailViewModel.formPropsData;
    if (!formattedData?.value_type) {
      formattedData.value_type = 'visit';
    }
    const data = await this.tagEventStore.update(formattedData);
    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, 'Updated successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
    return data;
  };

  onErrorHandler = (error) => {
    Array.isArray(error?._messages) && error?._messages[0]?.message
      ? notify(error?._messages[0]?.message, 'error')
      : error?.message && notify(error?.message, 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
    this.formTagEventsStatus = PAGE_STATUS.READY;
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  onGetTagEventSuccessHandler = (result) => {
    if (result) {
      this.tagEventDetailViewModel.formPropsData = { ...result };
      this.formStatus = PAGE_STATUS.READY;
    }
  };

  onGetTagEventListSuccessHandler = (result) => {
    if (result) {
      this.tagEventList = result;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  handleFormPropsData = (key, value) => {
    if (key && value !== null) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(this.tagEventDetailViewModel.formPropsData[key], value);
      } else {
        this.tagEventDetailViewModel.formPropsData[key] = value;
      }
    }
  };
  handleAliasChange = (value) => {
    this.aliasChange = value;
  };

  getUniqueEventNames = async (filterData) => {
    runInAction(() => {
      this.formTagEventsStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.tagEventStore.getUniqueEventNames(filterData);

    runInAction(() => {
      if (!data?.error) {
        this.onGetUniqueTagEventsSuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };
  onGetUniqueTagEventsSuccessHandler = (result) => {
    if (result) {
      this.uniqueTagEvents = result;
    }
    this.formTagEventsStatus = PAGE_STATUS.READY;
  };
}

export default TagEventDetailViewModel;
