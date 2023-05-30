/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import UTMTrackingEventModel from '../UTMTrackingModel/UTMTrackingListEventModel';
class UTMTrackingEventsViewModel {
  utmTrackingStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  attributeData = null;

  constructor(utmTrackingStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.utmTrackingStore = utmTrackingStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  transformDataToUTMTrackingEventModel = () => {
    return new UTMTrackingEventModel(this.data);
  };

  getVisitor = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    // this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.utmTrackingStore.getVisitor(
      dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttribute = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };

    this.utmTrackingStore.getAttribute(
      dataFilter,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.utmTrackingStore.getVisitor(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data?.list) {
      this.status = PAGE_STATUS.READY;
      const transformData = new UTMTrackingEventModel(data?.list, this.globalStoreViewModel);
      this.data = {
        list: transformData,
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;

      this.attributeData = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.attributeData = {};
    }
  };
}

export default UTMTrackingEventsViewModel;
