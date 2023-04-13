/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import DashboardModel from '../DashboardModel/DashboardModel';
import CountryModel from 'containers/RegionCountryPage/CountryModel/CountryModel';
class DashboardListViewModel {
  dashboardStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  summaryData = null;
  visitorData = null;
  countriesData = null;
  constructor(dashboardStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.dashboardStore = dashboardStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getMetrics(dataFilter, dateFilter);
    this.getVisitors(dataFilter, dateFilter);
    this.getCountries(dataFilter, dateFilter);
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
      this.dataFilter,
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
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
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

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnSummaryDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      this.summaryData = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnVisitorSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      const transformData = new DashboardModel(data.list, this.globalStoreViewModel);
      this.visitorData = transformData;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      const transformData = new CountryModel(data, this.globalStoreViewModel);
      this.countriesData = transformData.toCountries();
      this.status = PAGE_STATUS.READY;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default DashboardListViewModel;
