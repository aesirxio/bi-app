/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import EventsListModel from '../EventsModel/EventsListEventModel';
class EventsListViewModel {
  eventsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  attributeData = null;

  constructor(eventsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.eventsStore = eventsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  transformDataToEventsListModel = () => {
    return new EventsListModel(this.data);
  };

  getVisitor = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    // this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.eventsStore.getVisitor(
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

    this.eventsStore.getAttribute(
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
    this.eventsStore.getVisitor(
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
    if (data) {
      this.status = PAGE_STATUS.READY;
      const transformData = new EventsListModel(data, this.globalStoreViewModel);
      this.data = transformData;
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

export default EventsListViewModel;
