/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import DashboardModel from '../../Dashboard/DashboardModel/DashboardModel';
import CountryModel from '../../RegionCountryPage/CountryModel/CountryModel';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import CityModel from '../CityModel/CityModel';
import BrowserModel from '../BrowserModel/BrowserModel';
import LanguageModel from '../LanguagesModel/LanguageModel';
import PageModel from '../PagesModel/PageModel';
import queryString from 'query-string';
import FlowListModel from 'containers/FlowListPage/FlowListModel/FlowListModel';
class VisitorsListViewModel {
  visitorsStore = null;
  status = PAGE_STATUS.READY;
  statusOverview = PAGE_STATUS.READY;
  statusMetrics = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  statusPagesCount = PAGE_STATUS.READY;
  statusFlowList = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  metricsData = null;
  visitorData = null;
  visitsData = null;
  countriesTableData = null;
  citiesTableData = null;
  browsersTableData = null;
  devicesTableData = null;
  languagesTableData = null;
  pagesTableData = null;
  pagesCountData = null;
  flowListTableData = null;
  dataFilterFlowList = {};
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  sortByCountries = { 'sort[]': '', 'sort_direction[]': '' };
  sortByCities = { 'sort[]': '', 'sort_direction[]': '' };
  sortByBrowsers = { 'sort[]': '', 'sort_direction[]': '' };
  sortByDevices = { 'sort[]': '', 'sort_direction[]': '' };
  sortByLanguages = { 'sort[]': '', 'sort_direction[]': '' };
  sortByFlowList = { 'sort[]': '', 'sort_direction[]': '' };
  sortByPages = { 'sort[]': '', 'sort_direction[]': '' };

  constructor(visitorsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.visitorsStore = visitorsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    if (!dateFilter) {
      const dataFilterObjects = [
        this.dataFilter,
        this.dataFilterCountries,
        this.dataFilterCities,
        this.dataFilterBrowsers,
        this.dataFilterDevices,
        this.dataFilterLanguages,
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
    // this.getVisitors(dataFilter, dateFilter);
    this.getVisits(dataFilter, dateFilter);
    this.getCountries(dataFilter, dateFilter);
    this.getCities(dataFilter, dateFilter);
    this.getBrowsers(dataFilter, dateFilter);
    this.getDevices(dataFilter, dateFilter);
    this.getLanguages(dataFilter, dateFilter);
    this.getFlowList(dataFilter, dateFilter);
  };

  initializeBehavior = async (dataFilter, dateFilter, page) => {
    if (!dateFilter) {
      const dataFilterObjects = [this.dataFilter, this.dataFilterPages];
      dataFilterObjects?.forEach((dataFilterObj) => {
        for (const key in dataFilterObj) {
          if (key.startsWith('filter[domain]')) {
            delete dataFilterObj[key];
          }
        }
      });
    }
    this.getVisitors(dataFilter, dateFilter);
    this.getMetrics(dataFilter, dateFilter);
    await this.getPages(dataFilter, dateFilter, null, page);
    await this.getPagesCount(dataFilter, dateFilter, null, page);
  };

  getMetrics = (dataFilter, dateFilter) => {
    this.statusMetrics = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.visitorsStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnMetricsDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getVisitors = (dataFilter, dateFilter) => {
    this.statusOverview = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.visitorsStore.getVisitors(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitorSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getVisits = (dataFilter, dateFilter) => {
    this.statusOverview = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.visitorsStore.getVisits(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCountries = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortByCountries = sortBy;
    this.dataFilterCountries = {
      page_size: '5',
      ...this.dataFilterCountries,
      ...dataFilter,
      ...this.sortByCountries,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getCountries(
      this.dataFilterCountries,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCities = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortByCities = sortBy;
    this.dataFilterCities = {
      page_size: '5',
      ...this.dataFilterCities,
      ...dataFilter,
      ...this.sortByCities,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getCities(
      this.dataFilterCities,
      dateRangeFilter,
      this.callbackOnCitiesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getBrowsers = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortByBrowsers = sortBy;
    this.dataFilterBrowsers = {
      page_size: '5',
      ...this.dataFilterBrowsers,
      ...dataFilter,
      ...this.sortByBrowsers,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getDevices = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortByDevices = sortBy;
    this.dataFilterDevices = {
      page_size: '5',
      ...this.dataFilterDevices,
      ...dataFilter,
      ...this.sortByDevices,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getDevices(
      this.dataFilterDevices,
      dateRangeFilter,
      this.callbackOnDevicesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getLanguages = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortByLanguages = sortBy;
    this.dataFilterLanguages = {
      page_size: '5',
      ...this.dataFilterLanguages,
      ...dataFilter,
      ...this.sortByLanguages,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getLanguages(
      this.dataFilterLanguages,
      dateRangeFilter,
      this.callbackOnLanguagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getPages = async (dataFilter, dateFilter, sortBy = {}, search = {}) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy ?? { 'sort[]': 'url', 'sort_direction[]': 'asc' };
    this.sortByPages = sortBy ?? { 'sort[]': 'url', 'sort_direction[]': 'asc' };
    this.search = search;
    this.dataFilterPages = {
      page_size: '5',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getPagesCount = async (dataFilter, dateFilter, sortBy = {}, search = {}) => {
    this.statusPagesCount = PAGE_STATUS.LOADING;
    this.sortBy = sortBy ?? { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' };
    this.search = search;
    this.dataFilterPages = {
      page_size: '3',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.visitorsStore.getPagesCount(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesCountSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getFlowList = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' }
  ) => {
    this.statusFlowList = PAGE_STATUS.LOADING;
    this.sortByFlowList = sortBy;
    this.dataFilter = {
      page_size: '10',
      ...this.dataFilter,
      ...dataFilter,
      ...this.sortByFlowList,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.visitorsStore.getFlowList(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnFlowListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.visitorsStore.getMetrics(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterCountries = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterCountries = { ...this.dataFilterCountries, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getCountries(
      this.dataFilterCountries,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterCities = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterCities = { ...this.dataFilterCities, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getCities(
      this.dataFilterCities,
      dateRangeFilter,
      this.callbackOnCitiesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterBrowsers = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterBrowsers = { ...this.dataFilterBrowsers, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterDevices = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterDevices = { ...this.dataFilterDevices, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getDevices(
      this.dataFilterDevices,
      dateRangeFilter,
      this.callbackOnDevicesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterLanguages = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterLanguages = { ...this.dataFilterLanguages, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getLanguages(
      this.dataFilterLanguages,
      dateRangeFilter,
      this.callbackOnLanguagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterPages = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterPages = { ...this.dataFilterPages, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterPages?.page };
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

  handleFilterFlowList = async (dataFilter) => {
    const location = history.location;
    this.status = PAGE_STATUS.LOADING;

    this.dataFilterFlowList = { ...this.dataFilter, ...dataFilter };
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterFlowList?.page };

    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.visitorsStore.getFlowList(
      this.dataFilterFlowList,
      dateRangeFilter,
      this.callbackOnFlowListSuccessHandler,
      this.callbackOnErrorHandler
    );
    if (dataFilter?.page) {
      const search = {
        ...queryString.parse(location.search),
        ...{ pagination: dataFilter?.page },
      };
      window.history.replaceState('', '', `/flow-list?${queryString.stringify(search)}`);
    }
  };

  callbackOnFlowListSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.status = PAGE_STATUS.READY;
        this.statusFlowList = PAGE_STATUS.READY;
        const transformData = new FlowListModel(data.list, this.globalStoreViewModel);
        this.flowListTableData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusFlowList = PAGE_STATUS.ERROR;
      this.data = [];
    }
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
  callbackOnVisitorSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusOverview = PAGE_STATUS.READY;
        const transformData = new DashboardModel(data?.list, this.globalStoreViewModel);
        this.visitorData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusOverview = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new CountryModel(data.list, this.globalStoreViewModel);
        this.countriesTableData = {
          list: transformData.toCountriesTableTop(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCitiesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new CityModel(data.list, this.globalStoreViewModel);
        this.citiesTableData = {
          list: transformData.toCitiesTableTop(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnBrowsersSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new BrowserModel(data.list, this.globalStoreViewModel);
        this.browsersTableData = {
          list: transformData.toBrowsersTableTop(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDevicesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new BrowserModel(data.list, this.globalStoreViewModel);
        this.devicesTableData = {
          list: transformData.toDevicesTableTop(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLanguagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new LanguageModel(data.list, this.globalStoreViewModel);
        this.languagesTableData = {
          list: transformData.toLanguagesTableTop(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.pagesTableData = {
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

  callbackOnPagesCountSuccessHandler = (data) => {
    console.log('data', data);
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusPagesCount = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.pagesCountData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusPagesCount = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default VisitorsListViewModel;
