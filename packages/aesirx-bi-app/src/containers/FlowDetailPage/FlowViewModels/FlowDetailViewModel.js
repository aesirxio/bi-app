/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import FlowModel from '../FlowModel/FlowModel';
import EventsListModel from 'containers/EventsPage/EventsModel/EventsListEventModel';
class FlowDetailViewModel {
  flowStore = null;
  behaviorStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataEvents = null;
  dataConversion = null;
  relatedVisitorData = null;
  dataFilter = {};
  constructor(flowStore, behaviorStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.flowStore = flowStore;
    this.behaviorStore = behaviorStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  getFlowDetail = async (flowId, dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };

    if (dataFilter['filter_not[device]'] === 'all') {
      if (this.dataFilter['filter_not[device]']) {
        delete this.dataFilter['filter_not[device]'];
      }
    }
    if (dataFilter['filter[event_name]'] === 'all') {
      console.log('inne', this.dataFilter);
      if (this.dataFilter['filter[event_name]']) {
        console.log('inne2', this.dataFilter);
        delete this.dataFilter['filter[event_name]'];
        console.log('inne2', this.dataFilter);
      }
    }
    if (dataFilter['filter[url]'] === 'clearDataFilter') {
      if (this.dataFilter['filter[url]']) {
        delete this.dataFilter['filter[url]'];
      }
    }
    await this.flowStore.getFlowDetail(
      flowId,
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getEvents = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilterEvents = {
      page_size: '1000',
      'filter_not[event_type]': 'conversion',
      ...this.dataFilterEvents,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.flowStore.getEvents(
      this.dataFilterEvents,
      dateRangeFilter,
      this.callbackOnDataEventsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getConversion = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilterConversion = {
      page_size: '1000',
      'filter[event_type]': 'conversion',
      ...this.dataFilterConversion,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.flowStore.getEvents(
      this.dataFilterConversion,
      dateRangeFilter,
      this.callbackOnDataConversionSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;

      this.data = data;
      if (data?.events) {
        const transformData = new FlowModel(data?.events, this.globalStoreViewModel);
        this.relatedVisitorData = transformData;
      } else {
        this.status = PAGE_STATUS.ERROR;
        this.relatedVisitorData = null;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = {};
    }
  };

  callbackOnDataEventsSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        const transformData = new EventsListModel(data, this.globalStoreViewModel);
        this.dataEvents = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.dataEvents = [];
    }
  };

  callbackOnDataConversionSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        const transformData = new EventsListModel(data, this.globalStoreViewModel);
        this.dataConversion = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.dataConversion = [];
    }
  };
}

export default FlowDetailViewModel;
