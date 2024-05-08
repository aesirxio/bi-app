/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import OutlinkModel from '../OutlinkModel/OutlinkModel';
class OutlinkListViewModel {
  outlinkStore = null;
  status = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  outlinkTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };

  constructor(outlinkStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.outlinkStore = outlinkStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, page) => {
    this.getOutlink(dataFilter, dateFilter, page, {});
  };

  getOutlink = async (dataFilter, dateFilter, sortBy = {}, search = {}) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.search = search;
    this.dataFilterOutlink = {
      page_size: '10',
      ...this.dataFilterOutlink,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.outlinkStore.getOutlink(
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
    this.outlinkStore.getMetrics(
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

  handleFilterOutlink = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterOutlink = {
      ...this.dataFilterOutlink,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.outlinkStore.getOutlink(
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

export default OutlinkListViewModel;
