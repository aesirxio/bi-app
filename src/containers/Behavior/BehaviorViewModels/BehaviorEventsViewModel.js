/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import BehaviorEventModel from '../BehaviorModel/BehaviorListEventModel';
class BehaviorEventsViewModel {
  behaviorStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  attributeData = null;

  constructor(behaviorStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.behaviorStore = behaviorStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  transformDataToBehaviorEventModel = () => {
    return new BehaviorEventModel(this.data);
  };

  getVisitor = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    // this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.behaviorStore.getVisitor(
      dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttribute = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };

    this.behaviorStore.getAttribute(
      dataFilter,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.behaviorStore.getVisitor(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      const transformData = new BehaviorEventModel(data, this.globalStoreViewModel);
      this.data = transformData;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;

      this.attributeData = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.attributeData = {};
    }
  };
}

export default BehaviorEventsViewModel;
