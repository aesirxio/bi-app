/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import UTMTrackingEventModel from '../UTMTrackingModel/UTMTrackingListEventModel';
class UTMTrackingEventsViewModel {
  utmTrackingStore = null;
  statusAttribute = PAGE_STATUS.READY;
  statusTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  attributeData = null;
  dataAttribute = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(utmTrackingStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.utmTrackingStore = utmTrackingStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  transformDataToUTMTrackingEventModel = () => {
    return new UTMTrackingEventModel(this.data);
  };

  getVisitor = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilterTable = {
      page_size: '5',
      ...this.dataFilterTable,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.utmTrackingStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttributeDate = (dataFilter, dateFilter) => {
    this.statusAttribute = PAGE_STATUS.LOADING;
    this.dataFilterAttribute = {
      page_size: '1000',
      ...this.dataFilterAttribute,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };
    this.utmTrackingStore.getAttributeDate(
      this.dataFilterAttribute,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusAttribute = PAGE_STATUS.LOADING;
    this.statusTable = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.utmTrackingStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.utmTrackingStore.getAttributeDate(
      this.dataFilterAttribute,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterTable = async (dataFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = { ...this.dataFilterTable, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.utmTrackingStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.statusAttribute = PAGE_STATUS.READY;
    this.statusTable = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data?.list) {
      if (data?.message !== 'canceled') {
        this.statusTable = PAGE_STATUS.READY;
        const transformData = new UTMTrackingEventModel(data?.list, this.globalStoreViewModel);
        this.data = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusAttribute = PAGE_STATUS.READY;
        const transformData = new UTMTrackingEventModel(data, this.globalStoreViewModel);
        this.dataAttribute = transformData;
      }
    } else {
      this.statusAttribute = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default UTMTrackingEventsViewModel;
