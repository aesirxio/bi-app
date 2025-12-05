/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
class UTMLinkDetailViewModel {
  formStatus = PAGE_STATUS.READY;
  formUtmLinksStatus = PAGE_STATUS.READY;
  utmLinkDetailViewModel = { formPropsData: [{}] };
  aliasChange = '';
  utmLinkList = [];
  uniqueUtmLinks = [];
  uniqueUtmValueType = [];
  successResponse = {
    state: true,
    content_id: '',
    filters: { limit: 0 },
  };

  constructor(utmLinkStore) {
    makeAutoObservable(this);
    this.utmLinkStore = utmLinkStore;
  }

  setForm = (utmLinkDetailViewModel) => {
    this.utmLinkDetailViewModel = utmLinkDetailViewModel;
  };

  initializeData = async (activeDomain) => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.utmLinkStore.getDetail(
      this.utmLinkDetailViewModel.formPropsData?._id?.$oid,
      activeDomain
    );

    runInAction(() => {
      if (!data?.error) {
        this.onGetUTMLinkSuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  getUTMLinkList = async (activeDomain) => {
    runInAction(() => {
      this.formStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.utmLinkStore.getList(activeDomain);

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
    const formattedData = this.utmLinkDetailViewModel.formPropsData;
    if (!formattedData._id?.$oid) {
      delete formattedData._id;
    }
    if (!formattedData?.value_type) {
      formattedData.value_type = 'visit';
    }
    const data = await this.utmLinkStore.create(formattedData);

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
    const formattedData = this.utmLinkDetailViewModel.formPropsData;
    if (!formattedData?.value_type) {
      formattedData.value_type = 'visit';
    }
    const data = await this.utmLinkStore.update(formattedData);
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
    this.formUtmLinksStatus = PAGE_STATUS.READY;
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  onGetUTMLinkSuccessHandler = (result) => {
    if (result) {
      const parsed = new URL(result?.link);
      const formattedResult = {
        websiteURL: parsed.origin,
      };
      this.utmLinkDetailViewModel.formPropsData = { ...result, ...formattedResult };
      this.formStatus = PAGE_STATUS.READY;
    }
  };

  onGetUTMLinkListSuccessHandler = (result) => {
    if (result) {
      this.utmLinkList = result;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  handleFormPropsData = (key, value) => {
    if (key && value !== null) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(this.utmLinkDetailViewModel.formPropsData[key], value);
      } else {
        this.utmLinkDetailViewModel.formPropsData[key] = value;
      }
    }
  };
  handleAliasChange = (value) => {
    this.aliasChange = value;
  };

  getUniqueUtmLinks = async (filterData) => {
    runInAction(() => {
      this.formUtmLinksStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.utmLinkStore.getUniqueUtmLinks(filterData);

    runInAction(() => {
      if (!data?.error) {
        this.onGetUniqueUtmLinksSuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };
  onGetUniqueUtmLinksSuccessHandler = (result) => {
    if (result) {
      this.uniqueUtmLinks = result;
    }
    this.formUtmLinksStatus = PAGE_STATUS.READY;
  };
  getUniqueUtmValueType = async (filterData) => {
    runInAction(() => {
      this.formStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.utmLinkStore.getUniqueUtmValueType(filterData);

    runInAction(() => {
      if (!data?.error) {
        this.onGetUniqueUtmValueTypeSuccessHandler(data?.response, '');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };
  onGetUniqueUtmValueTypeSuccessHandler = (result) => {
    if (result) {
      this.uniqueUtmValueType = result;
    }
    this.formStatus = PAGE_STATUS.READY;
  };
}

export default UTMLinkDetailViewModel;
