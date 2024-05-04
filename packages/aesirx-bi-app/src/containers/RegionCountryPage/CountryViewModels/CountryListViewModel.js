/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import CountryModel from '../CountryModel/CountryModel';
class CountryListViewModel {
  countriesStore = null;
  status = PAGE_STATUS.READY;
  statusTopRegionTable = PAGE_STATUS.READY;
  statusTopCitiesTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  countriesData = null;
  countriesTableData = null;
  regionTableData = null;
  citiesTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(countriesStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.countriesStore = countriesStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getCountries(dataFilter, dateFilter);
    this.getRegion(dataFilter, dateFilter);
    this.getCities(dataFilter, dateFilter);
  };

  getCountries = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.status = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilter = {
      page_size: '1000',
      ...this.dataFilter,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.countriesStore.getCountries(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getRegion = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopRegionTable = PAGE_STATUS.LOADING;
    this.sortByRegion = sortBy;
    this.dataFilterRegion = {
      page_size: '8',
      ...this.dataFilterRegion,
      ...dataFilter,
      ...this.sortByRegion,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.countriesStore.getRegion(
      this.dataFilterRegion,
      dateRangeFilter,
      this.callbackOnRegionSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCities = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopCitiesTable = PAGE_STATUS.LOADING;
    this.sortByCities = sortBy;
    this.dataFilterCities = {
      page_size: '8',
      ...this.dataFilterCities,
      ...dataFilter,
      ...this.sortByCities,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.countriesStore.getCities(
      this.dataFilterCities,
      dateRangeFilter,
      this.callbackOnCitiesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.countriesStore.getCountries(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterRegion = async (dataFilter) => {
    this.statusTopRegionTable = PAGE_STATUS.LOADING;
    this.dataFilterRegion = { ...this.dataFilterRegion, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.dashboardStore.getReferer(
      this.dataFilterRegion,
      dateRangeFilter,
      this.callbackOnRegionSuccessHandler,
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

  callbackOnCountriesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        const transformData = new CountryModel(data.list, this.globalStoreViewModel);
        this.countriesData = transformData.toCountries();
        this.countriesTableData = {
          list: transformData.toCountriesTable(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnRegionSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.statusTopRegionTable = PAGE_STATUS.READY;
        const transformData = new CountryModel(data.list, this.globalStoreViewModel);
        this.regionTableData = {
          list: transformData.toRegionTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTopRegionTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
  callbackOnCitiesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopCitiesTable = PAGE_STATUS.READY;
        const transformData = new CountryModel(data.list, this.globalStoreViewModel);
        this.citiesTableData = {
          list: transformData.toCitiesTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTopCitiesTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default CountryListViewModel;
