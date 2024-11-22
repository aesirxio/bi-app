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
import { BI_LIVE_VISITORS_TOTAL_FIELD_KEY } from 'aesirx-lib';

class DashboardListViewModel {
  dashboardStore = null;
  status = PAGE_STATUS.READY;
  statusTopPageTable = PAGE_STATUS.READY;
  statusTopBrowser = PAGE_STATUS.READY;
  statusTopSourceTable = PAGE_STATUS.READY;
  statusEventTypeTable = PAGE_STATUS.READY;
  statusLiveVisitorsTotal = PAGE_STATUS.READY;
  statusLiveVisitorsList = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  summaryData = null;
  visitorData = null;
  countriesData = null;
  browsersData = null;
  devicesData = null;
  devicesTableData = null;
  attributeTypeTableData = null;
  eventNameTypeTableData = null;
  pagesTableData = null;
  sourcesTableData = null;
  dataAttributesType = null;
  eventNameTypeDataType = null;
  liveVisitorsTotalData = null;
  liveVisitorsListData = null;
  sortByPages = { 'sort[]': '', 'sort_direction[]': '' };
  sortByDevices = { 'sort[]': '', 'sort_direction[]': '' };
  sortByBrowsers = { 'sort[]': '', 'sort_direction[]': '' };
  sortByEventNameType = { 'sort[]': '', 'sort_direction[]': '' };
  sortBySources = { 'sort[]': '', 'sort_direction[]': '' };
  sortByAttribute = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(dashboardStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.dashboardStore = dashboardStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    if (!dateFilter) {
      const dataFilterObjects = [
        this.dataFilter,
        this.dataFilterBrowsers,
        this.dataFilterDevices,
        this.dataFilterPages,
        this.dataFilterEventsType,
        this.dataFilterSources,
        this.dataFilterLiveVisitors,
      ];

      dataFilterObjects?.forEach((dataFilterObj) => {
        for (const key in dataFilterObj) {
          if (key.startsWith('filter[domain]')) {
            delete dataFilterObj[key];
          }
        }
      });
    }
    this.getMetrics(dataFilter, dateFilter);
    this.getVisitors(dataFilter, dateFilter);
    this.getCountries(dataFilter, dateFilter);
    this.getBrowsers(dataFilter, dateFilter);
    this.getDevices(dataFilter, dateFilter);
    this.getPages(dataFilter, dateFilter);
    this.getReferer(dataFilter, dateFilter);
    this.getEventsType(dataFilter, dateFilter);
    this.getAttribute(dataFilter, dateFilter);
    this.getLiveVisitorsTotal(dataFilter, false);
    this.getLiveVisitorsList(dataFilter, false);
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

  getAttribute = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_page_views', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByAttribute = sortBy;
    this.dataFilterPages = {
      page_size: '8',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortByAttribute,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.dashboardStore.getAttribute(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnAttributesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getLiveVisitorsTotal = async (dataFilter, isReload = false) => {
    this.statusLiveVisitorsTotal = !isReload ? PAGE_STATUS.LOADING : PAGE_STATUS.READY;
    this.dataFilterLiveVisitors = {
      ...dataFilter,
    };
    await this.dashboardStore.getLiveVisitorsTotal(
      this.dataFilterLiveVisitors,
      this.callbackOnLiveVisitorsTotalSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  getLiveVisitorsList = async (dataFilter, isReload = false) => {
    this.statusLiveVisitorsList = !isReload ? PAGE_STATUS.LOADING : PAGE_STATUS.READY;
    this.dataFilterLiveVisitors = {
      page_size: '8',
      ...dataFilter,
    };
    await this.dashboardStore.getLiveVisitorsList(
      this.dataFilterLiveVisitors,
      this.callbackOnLiveVisitorsListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getEventsType = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_page_views', 'sort_direction[]': 'desc' }
  ) => {
    this.statusEventTypeTable = PAGE_STATUS.LOADING;
    this.sortByEventsType = sortBy;
    this.dataFilterEventsType = {
      page_size: '8',
      ...this.dataFilterEventsType,
      ...dataFilter,
      ...this.sortByEventsType,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.dashboardStore.getEventsType(
      this.dataFilterEventsType,
      dateRangeFilter,
      this.callbackOnEventNameTypeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getReferer = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopSourceTable = PAGE_STATUS.LOADING;
    this.sortBySources = sortBy;
    this.dataFilterSources = {
      page_size: '8',
      ...this.dataFilterSources,
      ...dataFilter,
      ...this.sortBySources,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.dashboardStore.getReferer(
      this.dataFilterSources,
      dateRangeFilter,
      this.callbackOnSourcesSuccessHandler,
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

  handleFilterSources = async (dataFilter) => {
    this.statusTopSourceTable = PAGE_STATUS.LOADING;
    this.dataFilterSources = { ...this.dataFilterSources, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getReferer(
      this.dataFilterSources,
      dateRangeFilter,
      this.callbackOnSourcesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterEventType = async (dataFilter) => {
    this.statusEventTypeTable = PAGE_STATUS.LOADING;
    this.dataFilterEventsType = { ...this.dataFilterEventsType, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getEventsType(
      this.dataFilterEventsType,
      dateRangeFilter,
      this.callbackOnEventNameTypeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  E;

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    console.log('error', error);
    notify(error.message, 'error');
  };

  callbackOnSummaryDataSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
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
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
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
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
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
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
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
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
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

  callbackOnAttributesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        const transformFormat = data?.list?.map((item) => {
          return item.values[0];
        });
        this.dataAttributesType = transformFormat;
        const formatData = new DashboardModel(transformFormat, this.globalStoreViewModel);
        this.attributeTypeTableData = {
          list: formatData.toAttributeTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLiveVisitorsTotalSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.liveVisitorsTotalData = data?.list[BI_LIVE_VISITORS_TOTAL_FIELD_KEY.TOTAL];
        this.statusLiveVisitorsTotal = PAGE_STATUS.READY;
      }
    } else {
      this.statusLiveVisitorsTotal = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLiveVisitorsListSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.liveVisitorsListData = data?.list;
        this.statusLiveVisitorsList = PAGE_STATUS.READY;
      }
    } else {
      this.statusLiveVisitorsList = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnEventNameTypeSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.eventNameTypeData = data?.list;
        const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
        this.eventNameTypeTableData = {
          list: transformData.toEventsTypeTableTop(),
          pagination: data.pagination,
        };
        this.statusEventTypeTable = PAGE_STATUS.READY;
      }
    } else {
      this.statusEventTypeTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.status = PAGE_STATUS.READY;
        this.statusTopPageTable = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.pagesTableData = {
          list: transformData?.toPagesTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopPageTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnSourcesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.statusTopSourceTable = PAGE_STATUS.READY;
        const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
        this.sourcesTableData = {
          list: transformData.toSourcesTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTopSourceTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default DashboardListViewModel;
