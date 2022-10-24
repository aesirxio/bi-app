/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

class SummaryListViewModel {
  summaryStore = null;
  paginationCollections = null;
  status = PAGE_STATUS.READY;
  data = [];
  tableRowHeader = null;
  dataFilter = {
    date_start: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    date_end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    domain: 'dam.aesirx.io',
  };
  pageSize = 5;
  isList = false;
  summaryIdsSelected = null;
  isSearch = false;
  constructor(summaryStore) {
    makeAutoObservable(this);
    this.summaryStore = summaryStore;
  }

  getSummary = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, dataFilter };
    this.summaryStore.getSummary(
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHander
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };

    this.summaryStore.getSummary(
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHander
    );
  };
  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      date_start: moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    };
    this.dataFilter = { ...this.dataFilter, ...dateRangeFilter };

    this.summaryStore.getSummary(
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHander
    );
  };
  resetObservableProperties = () => {};

  callbackOnErrorHander = (error) => {
    if (error.message === 'isCancle') {
      this.status = PAGE_STATUS.READY;
    } else notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      this.data = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
    }
  };
}

export default SummaryListViewModel;
