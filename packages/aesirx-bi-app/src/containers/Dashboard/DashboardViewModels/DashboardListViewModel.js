/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import DashboardModel from '../DashboardModel/DashboardModel';
import CountryModel from '../../RegionCountryPage/CountryModel/CountryModel';
import PageModel from '../../VisitorsPage/PagesModel/PageModel';
class DashboardListViewModel {
  dashboardStore = null;
  status = PAGE_STATUS.READY;
  statusTopPageTable = PAGE_STATUS.READY;
  statusTopBrowser = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  summaryData = null;
  visitorData = null;
  countriesData = null;
  browsersData = null;
  devicesData = null;
  devicesTableData = null;
  pagesTableData = null;
  sortByPages = { 'sort[]': '', 'sort_direction[]': '' };
  sortByDevices = { 'sort[]': '', 'sort_direction[]': '' };
  sortByBrowsers = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(dashboardStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.dashboardStore = dashboardStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getMetrics(dataFilter, dateFilter);
    this.getVisitors(dataFilter, dateFilter);
    this.getCountries(dataFilter, dateFilter);
    this.getBrowsers(dataFilter, dateFilter);
    this.getDevices(dataFilter, dateFilter);
    this.getPages(dataFilter, dateFilter);
  };

  getMetrics = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.dashboardStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnSummaryDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getVisitors = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.dashboardStore.getVisitors(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitorSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCountries = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.dashboardStore.getCountries(
      {
        ...this.dataFilter,
        page_size: '10',
        'sort[]': 'number_of_page_views',
        'sort_direction[]': 'desc',
      },
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getBrowsers = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByBrowsers = sortBy;
    this.dataFilterBrowsers = {
      page_size: '8',

      ...this.dataFilterBrowsers,
      ...dataFilter,
      ...this.sortByBrowsers,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.dashboardStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterBrowsers = async (dataFilter) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.dataFilterBrowsers = { ...this.dataFilterBrowsers, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getDevices = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByDevices = sortBy;
    this.dataFilterDevices = {
      page_size: '8',
      ...this.dataFilterDevices,
      ...dataFilter,
      ...this.sortByDevices,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.dashboardStore.getDevices(
      this.dataFilterDevices,
      dateRangeFilter,
      this.callbackOnDevicesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterDevices = async (dataFilter) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.dataFilterDevices = { ...this.dataFilterDevices, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getDevices(
      this.dataFilterDevices,
      dateRangeFilter,
      this.callbackOnDevicesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getPages = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_page_views', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopPageTable = PAGE_STATUS.LOADING;
    this.sortByPages = sortBy;
    this.dataFilterPages = {
      page_size: '8',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortByPages,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.dashboardStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.dashboardStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
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

  handleFilterPages = async (dataFilter) => {
    this.statusTopPageTable = PAGE_STATUS.LOADING;
    this.dataFilterPages = { ...this.dataFilterPages, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    console.log('error', error);
    notify(error.message, 'error');
  };

  callbackOnSummaryDataSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        this.summaryData = data;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnVisitorSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
        this.visitorData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        const transformData = new CountryModel(data.list, this.globalStoreViewModel);
        this.countriesData = transformData.toCountries();
        this.status = PAGE_STATUS.READY;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnBrowsersSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
        this.browsersData = {
          list: transformData.toBrowsersTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDevicesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.devicesData = data?.list;
        const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
        this.devicesTableData = {
          list: transformData.toDevicesTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        this.statusTopPageTable = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.pagesTableData = {
          list: transformData.toPagesTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopPageTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default DashboardListViewModel;
