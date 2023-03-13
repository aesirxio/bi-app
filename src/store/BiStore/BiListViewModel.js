/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import { env } from 'env';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

class BiListViewModel {
  biStore = null;
  paginationCollections = null;
  status = PAGE_STATUS.READY;
  data = [];
  listDomain = JSON.parse(env.REACT_APP_DATA_STREAM) ?? [];
  tableRowHeader = null;
  dateFilter = {
    date_start: moment().subtract(30, 'd').format('YYYY-MM-DD'),
    date_end: moment().endOf('day').format('YYYY-MM-DD'),
  };
  dataFilter = {};
  pageSize = 5;
  isList = false;
  activeDomain = env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain;
  isSearch = false;
  constructor(biStore) {
    makeAutoObservable(this);
    this.biStore = biStore;
  }

  setActiveDomain = (domain) => {
    this.activeDomain = domain;
  };

  setDateFilter = (date_start, date_end) => {
    this.dateFilter = {
      ...this.dateFilter,
      date_start: moment(date_start).format('YYYY-MM-DD'),
      date_end: moment(date_end).format('YYYY-MM-DD'),
    };
  };

  resetObservableProperties = () => {};

  callbackOnErrorHandler = (error) => {
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

export default BiListViewModel;
