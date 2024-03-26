/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import DashboardModel from '../../Dashboard/DashboardModel/DashboardModel';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import queryString from 'query-string';
import OutlinkModel from '../OutlinkModel/OutlinkModel';
class SearchEngineListViewModel {
  searchEngineStore = null;
  status = PAGE_STATUS.READY;
  statusOverview = PAGE_STATUS.READY;
  statusMetrics = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  metricsData = null;
  searchEngineData = null;
  visitsData = null;
  outlinkTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };

  constructor(searchEngineStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.searchEngineStore = searchEngineStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, page) => {
    this.getVisits(dataFilter, dateFilter);
    this.getOutlink(dataFilter, dateFilter, page, {});
  };

  getVisits = (dataFilter, dateFilter) => {
    this.statusOverview = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.searchEngineStore.getVisits(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getOutlink = async (dataFilter, dateFilter, sortBy = {}, search = {}) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.search = search;
    this.dataFilterOutlink = {
      page_size: '5',
      ...this.dataFilterOutlink,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.searchEngineStore.getOutlink(
      this.dataFilterOutlink,
      dateRangeFilter,
      this.callbackOnOutlinkSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.searchEngineStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterChannel = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterChannel = { ...this.dataFilterChannel, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.searchEngineStore.getChannel(
      this.dataFilterChannel,
      dateRangeFilter,
      this.callbackOnChannelSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterChannel?.page };
    if (dataFilter?.page) {
      const search = {
        ...queryString.parse(location.search),
        ...{ pagination: dataFilter?.page },
      };
      window.history.replaceState('', '', `/behavior?${queryString.stringify(search)}`);
    }
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterOutlink = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterOutlink = {
      ...this.dataFilterOutlink,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.searchEngineStore.getOutlink(
      this.dataFilterOutlink,
      dateRangeFilter,
      this.callbackOnOutlinkSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnVisitsSuccessHandler = (data) => {
    if (data?.length) {
      if (data?.message !== 'canceled') {
        this.statusOverview = PAGE_STATUS.READY;
        const transformData = new DashboardModel(data, this.globalStoreViewModel);
        this.visitsData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusOverview = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnOutlinkSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new OutlinkModel(data.list, this.globalStoreViewModel);
        this.outlinkTableData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default SearchEngineListViewModel;
