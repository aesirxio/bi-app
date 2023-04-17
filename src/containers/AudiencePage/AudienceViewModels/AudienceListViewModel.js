/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import DashboardModel from 'containers/Dashboard/DashboardModel/DashboardModel';
import CountryModel from 'containers/RegionCountryPage/CountryModel/CountryModel';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import CityModel from '../CityModel/CityModel';
import BrowserModel from '../BrowserModel/BrowserModel';
class AudienceListViewModel {
  audienceStore = null;
  status = PAGE_STATUS.READY;
  statusOverview = PAGE_STATUS.READY;
  statusMetrics = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  metricsData = null;
  visitorData = null;
  countriesTableData = null;
  citiesTableData = null;
  browsersTableData = null;
  constructor(audienceStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.audienceStore = audienceStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getMetrics(dataFilter, dateFilter);
    this.getVisitors(dataFilter, dateFilter);
    this.getCountries(dataFilter, dateFilter);
    this.getCities(dataFilter, dateFilter);
    this.getBrowsers(dataFilter, dateFilter);
  };

  getMetrics = (dataFilter, dateFilter) => {
    this.statusMetrics = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.audienceStore.getMetrics(
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

    this.audienceStore.getVisitors(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnVisitorSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCountries = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getCountries(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCities = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getCities(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCitiesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getBrowsers = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getBrowsers(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.audienceStore.getMetrics(
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

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnMetricsDataSuccessHandler = (data) => {
    if (data) {
      this.statusMetrics = PAGE_STATUS.READY;
      this.metricsData = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusMetrics = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnVisitorSuccessHandler = (data) => {
    if (data) {
      this.statusOverview = PAGE_STATUS.READY;
      const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
      this.visitorData = transformData;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusOverview = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new CountryModel(data, this.globalStoreViewModel);
      this.countriesTableData = transformData.toCountriesTableTop();
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCitiesSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new CityModel(data, this.globalStoreViewModel);
      this.citiesTableData = transformData.toCitiesTableTop();
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnBrowsersSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new BrowserModel(data, this.globalStoreViewModel);
      this.browsersTableData = transformData.toBrowsersTableTop();
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default AudienceListViewModel;
