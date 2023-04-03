/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'components/Toast';
import PAGE_STATUS from 'constants/PageStatus';
import BehaviorEventModel from 'containers/Behavior/BehaviorModel/BehaviorListEventModel';
import { makeAutoObservable } from 'mobx';
class FlowDetailViewModel {
  flowStore = null;
  behaviorStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  relatedVisitorData = null;
  dataFilter = {};
  constructor(flowStore, behaviorStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.flowStore = flowStore;
    this.behaviorStore = behaviorStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  getFlowDetail = (flowId, dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };

    this.flowStore.getFlowDetail(
      flowId,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getVisitor = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };

    this.behaviorStore.getVisitor(
      dataFilter,
      dateRangeFilter,
      this.callbackOnVisitorDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnVisitorDataSuccessHandler = (data) => {
    if (data) {
      console.log(data);
      this.status = PAGE_STATUS.READY;
      const transformData = new BehaviorEventModel(data, this.globalStoreViewModel);
      this.relatedVisitorData = transformData;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.relatedVisitorData = null;
    }
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;

      this.data = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = {};
    }
  };
}

export default FlowDetailViewModel;
