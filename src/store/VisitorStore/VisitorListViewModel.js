/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

class VisitorListViewModel {
  visitorStore = null;
  paginationCollections = null;
  status = PAGE_STATUS.READY;
  data = [];
  tableRowHeader = null;
  dataFilter = {
    'filter[start_date]': moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    'filter[end_date]': moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
  };
  pageSize = 5;
  isList = false;
  visitorIdsSelected = null;
  isSearch = false;
  constructor(visitorStore) {
    makeAutoObservable(this);
    this.visitorStore = visitorStore;
  }

  getVisitor = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    this.visitorStore.getVisitor(
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHander
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };

    this.visitorStore.getVisitor(
      this.dataFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHander
    );
  };
  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      'filter[start_date]': moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
      'filter[end_date]': moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    };
    this.dataFilter = { ...this.dataFilter, ...dateRangeFilter };

    this.visitorStore.getVisitor(
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

export default VisitorListViewModel;
