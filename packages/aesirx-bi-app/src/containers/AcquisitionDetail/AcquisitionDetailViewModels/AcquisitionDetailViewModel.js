/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import AcquisitionDetailModel from '../AcquisitionDetailModel/AcquisitionDetailModel';
import CountryModel from '../../RegionCountryPage/CountryModel/CountryModel';
import PageModel from 'containers/VisitorsPage/PagesModel/PageModel';
class AcquisitionDetailListViewModel {
  acquisitionDetailStore = null;
  status = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  statusTopBrowser = PAGE_STATUS.READY;
  statusTopSourceTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  summaryData = null;
  visitorData = null;
  countriesData = null;
  browsersData = null;
  devicesData = null;
  devicesTableData = null;
  acquisitionsTableData = null;
  sourcesTableData = null;
  sortByPages = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(acquisitionDetailStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.acquisitionDetailStore = acquisitionDetailStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, page) => {
    this.getVisits(dataFilter, dateFilter);
    this.getPages(dataFilter, dateFilter, page, {}, page);
  };

  getVisits = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.acquisitionDetailStore.getVisits(
      {
        ...this.dataFilter,
        page_size: '1000',
      },
      dateRangeFilter,
      this.callbackOnVisitsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getPages = async (dataFilter, dateFilter, sortBy = {}, search = {}, page = {}) => {
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

    await this.acquisitionDetailStore.getPages(
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
    this.acquisitionDetailStore.getMetrics(
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
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterPages = { ...this.dataFilterPages, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.acquisitionDetailStore.getPages(
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

  callbackOnVisitsSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.status = PAGE_STATUS.READY;
        const transformData = new AcquisitionDetailModel(data, this.globalStoreViewModel);
        this.visitorData = transformData;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' || data?.message !== 'isCancle') {
        this.status = PAGE_STATUS.READY;
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.acquisitionsTableData = {
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

export default AcquisitionDetailListViewModel;
