/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
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
      dataFilter,
      this.callbackOnDataSuccessHandler,
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

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;

      this.data = data;
      if (data?.events) {
        const transformData = new BehaviorEventModel(data?.events, this.globalStoreViewModel);
        this.relatedVisitorData = transformData;
      } else {
        this.status = PAGE_STATUS.ERROR;
        this.relatedVisitorData = null;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = {};
    }
  };
}

export default FlowDetailViewModel;
