/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import UserFlowModel from '../UserFlowModel/UserFlowModel';
class UserFlowListViewModel {
  userFlowStore = null;
  status = PAGE_STATUS.READY;
  statusTopTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  userFlowTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };

  constructor(userFlowStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.userFlowStore = userFlowStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, page) => {
    if (!dateFilter) {
      for (const key in this.dataFilter) {
        if (key.startsWith('filter[domain]')) {
          delete this.dataFilter[key];
        }
      }
    }
    this.getUserFlow(dataFilter, dateFilter, page, {});
  };

  getUserFlow = async (dataFilter, dateFilter, sortBy = {}, search = {}) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.search = search;
    this.dataFilterUserFlow = {
      page_size: '5',
      ...this.dataFilterUserFlow,
      ...dataFilter,
      ...this.sortBy,
      ...this.search,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.userFlowStore.getUserFlow(
      this.dataFilterUserFlow,
      dateRangeFilter,
      this.callbackOnUserFlowSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.userFlowStore.getMetrics(
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

  handleFilterUserFlow = async (dataFilter) => {
    this.statusTopTable = PAGE_STATUS.LOADING;
    this.dataFilterUserFlow = {
      ...this.dataFilterUserFlow,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.userFlowStore.getUserFlow(
      this.dataFilterUserFlow,
      dateRangeFilter,
      this.callbackOnUserFlowSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnUserFlowSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTopTable = PAGE_STATUS.READY;
        const transformData = new UserFlowModel(data.list, this.globalStoreViewModel);
        this.userFlowTableData = {
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

export default UserFlowListViewModel;
