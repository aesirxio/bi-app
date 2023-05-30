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
  statusTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataEvents = null;
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
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterTable,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.eventsStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getEvents = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilterEvents = {
      page_size: '1000',
      ...this.dataFilterEvents,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.eventsStore.getEvents(
      this.dataFilterEvents,
      dateRangeFilter,
      this.callbackOnDataEventsSuccessHandler,
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
    this.statusTable = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.eventsStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.eventsStore.getEvents(
      this.dataFilterEvents,
      dateRangeFilter,
      this.callbackOnDataEventsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterTable = async (dataFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = { ...this.dataFilterTable, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.eventsStore.getVisitor(
      this.dataFilterTable,
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
      this.statusTable = PAGE_STATUS.READY;
      const transformData = new EventsListModel(data?.list, this.globalStoreViewModel);
      this.data = {
        list: transformData,
        pagination: data.pagination,
      };
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataEventsSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      const transformData = new EventsListModel(data, this.globalStoreViewModel);
      this.dataEvents = transformData;
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
