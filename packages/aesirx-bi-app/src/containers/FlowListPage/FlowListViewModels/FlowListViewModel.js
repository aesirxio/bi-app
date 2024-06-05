/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { history, notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import FlowListModel from '../FlowListModel/FlowListModel';
import queryString from 'query-string';
import EventsListModel from 'containers/EventsPage/EventsModel/EventsListEventModel';
class FlowListListViewModel {
  flowlistStore = null;
  status = PAGE_STATUS.READY;
  statusTable = PAGE_STATUS.READY;
  statusChart = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  countriesTableData = null;
  dataEvents = null;
  dataConversion = null;
  eventDateData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  isShowbot = true;
  dataFilterFlowList = {};
  constructor(flowlistStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.flowlistStore = flowlistStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, dataFilterTable, intergration) => {
    this.getFlowList(
      { ...dataFilter, ...dataFilterTable },
      dateFilter,
      dataFilterTable,
      intergration
    );
    this.getEvents(dataFilter, dateFilter);
    this.getConversion(dataFilter, dateFilter);
    this.getFlowDate(dataFilter, dateFilter);
  };

  getFlowList = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' },
    intergration
  ) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilter = {
      page_size: '20',
      ...this.dataFilter,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    let search = {};
    this.globalStoreViewModel.dataFilter = {
      ...(sortBy['sort[]'] && { 'sort[]': sortBy['sort[]'] }),
      ...(sortBy['sort_direction[]'] && { 'sort_direction[]': sortBy['sort_direction[]'] }),
      ...(dataFilter['filter[event_name]'] && {
        'filter[event_name]': dataFilter['filter[event_name]'],
      }),
      ...(dataFilter['filter[url]'] && {
        'filter[url]': dataFilter['filter[url]'],
      }),
      ...(dataFilter['filter_not[device]'] && {
        'filter_not[device]': dataFilter['filter_not[device]'],
      }),
    };
    if (sortBy || dataFilter) {
      search = {
        ...queryString.parse(location.search),
        ...(sortBy['sort[]'] && { 'sort[]': sortBy['sort[]'] }),
        ...(sortBy['sort_direction[]'] && { 'sort_direction[]': sortBy['sort_direction[]'] }),
        ...(dataFilter['filter[event_name]'] && {
          'filter[event_name]': dataFilter['filter[event_name]'],
        }),
        ...(dataFilter['filter[url]'] && {
          'filter[url]': dataFilter['filter[url]'],
        }),
        ...(dataFilter['filter_not[device]'] && {
          'filter_not[device]': dataFilter['filter_not[device]'],
        }),
      };
    }
    if (dataFilter['filter_not[device]'] === 'all') {
      this.dataFilter['filter_not[device]'] && delete this.dataFilter['filter_not[device]'];
      search['filter_not[device]'] && delete search['filter_not[device]'];
    }
    if (dataFilter['filter[event_name]'] === 'all') {
      this.dataFilter['filter[event_name]'] && delete this.dataFilter['filter[event_name]'];
      search['filter[event_name]'] && delete search['filter[event_name]'];
    }
    if (dataFilter['filter[url]'] === 'clearDataFilter') {
      this.dataFilter['filter[url]'] && delete this.dataFilter['filter[url]'];
      search['filter[url]'] && delete search['filter[url]'];
    }
    if ((sortBy || dataFilter) && !intergration) {
      window.history.replaceState('', '', `/flow-list?${queryString.stringify(search)}`);
    }
    this.flowlistStore.getFlowList(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getFlowDate = (dataFilter, dateFilter) => {
    this.statusChart = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.flowlistStore.getFlowDate(
      {
        ...dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnEventDateSuccessHandler,
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

    this.flowlistStore.getEvents(
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

    this.flowlistStore.getEvents(
      this.dataFilterConversion,
      dateRangeFilter,
      this.callbackOnDataConversionSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.flowlistStore.getFlowList(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterFlowList = async (dataFilter, intergration) => {
    const location = history.location;
    this.statusTable = PAGE_STATUS.LOADING;

    this.dataFilterFlowList = { ...this.dataFilter, ...dataFilter };
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterFlowList?.page };

    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.flowlistStore.getFlowList(
      this.dataFilterFlowList,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
    if (dataFilter?.page) {
      const search = {
        ...queryString.parse(location.search),
        ...{ pagination: dataFilter?.page },
      };
      !intergration &&
        window.history.replaceState('', '', `/flow-list?${queryString.stringify(search)}`);
    }
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    this.statusTable = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.statusTable = PAGE_STATUS.READY;
        const transformData = new FlowListModel(data.list, this.globalStoreViewModel);
        this.countriesTableData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
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

  callbackOnEventDateSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusChart = PAGE_STATUS.READY;
        const transformData = new FlowListModel(data.list, this.globalStoreViewModel);
        this.eventDateData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  toggleShowbot = () => {
    this.isShowbot = !this.isShowbot;
  };
}

export default FlowListListViewModel;
