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
import ChannelModel from '../ChannelModel/ChannelModel';
class AcquisitionListViewModel {
  acquisitionStore = null;
  status = PAGE_STATUS.READY;
  statusOverview = PAGE_STATUS.READY;
  statusMetrics = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  metricsData = null;
  acquisitionData = null;
  visitsData = null;
  countriesTableData = null;
  citiesTableData = null;
  browsersTableData = null;
  devicesTableData = null;
  languagesTableData = null;
  pagesTableData = null;
  channelTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };

  constructor(acquisitionStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.acquisitionStore = acquisitionStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, page) => {
    this.getVisits(dataFilter, dateFilter);
    this.getMetrics(dataFilter, dateFilter);
    this.getChannel(dataFilter, dateFilter, page, {}, page);
  };

  getMetrics = (dataFilter, dateFilter) => {
    this.statusMetrics = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.acquisitionStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnMetricsDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAcquisition = (dataFilter, dateFilter) => {
    this.statusOverview = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.acquisitionStore.getAcquisition(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnAcquisitionSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getVisits = (dataFilter, dateFilter) => {
    this.statusOverview = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.acquisitionStore.getVisits(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getChannel = async (dataFilter, dateFilter, sortBy = {}, search = {}, page = {}) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.search = search;
    this.dataFilterPages = {
      page_size: '5',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
      ...page,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.acquisitionStore.getChannel(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnChannelSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.acquisitionStore.getMetrics(
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
    await this.acquisitionStore.getChannel(
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

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnMetricsDataSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusMetrics = PAGE_STATUS.READY;
        this.metricsData = data;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusMetrics = PAGE_STATUS.ERROR;
      this.data = [];
    }
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
  callbackOnAcquisitionSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusOverview = PAGE_STATUS.READY;
        const transformData = new DashboardModel(data?.list, this.globalStoreViewModel);
        this.acquisitionData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusOverview = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnChannelSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new ChannelModel(data.list, this.globalStoreViewModel);
        this.channelTableData = {
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

export default AcquisitionListViewModel;
