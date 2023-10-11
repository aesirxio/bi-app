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
  languagesTableData = null;
  pagesTableData = null;
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
    this.getLanguages(dataFilter, dateFilter);
  };

  initializeBehavior = (dataFilter, dateFilter) => {
    this.getVisitors(dataFilter, dateFilter);
    this.getMetrics(dataFilter, dateFilter);
    this.getPages(dataFilter, dateFilter);
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
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitorSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCountries = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterCountries = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterCountries,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getCountries(
      this.dataFilterCountries,
      dateRangeFilter,
      this.callbackOnCountriesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getCities = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterCities = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterCities,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getCities(
      this.dataFilterCities,
      dateRangeFilter,
      this.callbackOnCitiesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getBrowsers = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterBrowsers = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterBrowsers,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getLanguages = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterLanguages = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterLanguages,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getLanguages(
      this.dataFilterLanguages,
      dateRangeFilter,
      this.callbackOnLanguagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getPages = async (dataFilter, dateFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterPages = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterPages,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.audienceStore.getPages(
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
    this.audienceStore.getMetrics(
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
    await this.audienceStore.getCountries(
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
    await this.audienceStore.getCities(
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
    await this.audienceStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterLanguages = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterLanguages = { ...this.dataFilterLanguages, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.audienceStore.getLanguages(
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
    await this.audienceStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
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
      const transformData = new CountryModel(data.list, this.globalStoreViewModel);
      this.countriesTableData = {
        list: transformData.toCountriesTableTop(),
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnCitiesSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new CityModel(data.list, this.globalStoreViewModel);
      this.citiesTableData = {
        list: transformData.toCitiesTableTop(),
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnBrowsersSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new BrowserModel(data.list, this.globalStoreViewModel);
      this.browsersTableData = {
        list: transformData.toBrowsersTableTop(),
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLanguagesSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new LanguageModel(data.list, this.globalStoreViewModel);
      this.languagesTableData = {
        list: transformData.toLanguagesTableTop(),
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      this.statusTopTable = PAGE_STATUS.READY;
      const transformData = new PageModel(data.list, this.globalStoreViewModel);
      this.pagesTableData = {
        list: transformData.toPagesTableTop(),
        pagination: data.pagination,
      };
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default AudienceListViewModel;
