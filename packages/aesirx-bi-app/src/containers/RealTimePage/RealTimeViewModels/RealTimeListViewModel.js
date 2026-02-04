/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { history, notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable, runInAction } from 'mobx';
import moment from 'moment';
import RealTimeModel from '../RealTimeModel/RealTimeModel';
import queryString from 'query-string';
import { BI_LIVE_VISITORS_TOTAL_FIELD_KEY } from 'aesirx-lib';

class RealTimeListViewModel {
  realTimeStore = null;
  status = PAGE_STATUS.READY;
  statusTable = PAGE_STATUS.READY;
  statusChart = PAGE_STATUS.READY;
  statusLiveVisitorsTotal = PAGE_STATUS.READY;
  statusLiveVisitorsDevice = PAGE_STATUS.READY;
  formSelectTimeStatus = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  realtimeTableData = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  dataFilterRealTime = {};
  liveVisitorsTotalData = null;
  liveVisitorsDeviceData = null;
  constructor(realTimeStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.realTimeStore = realTimeStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter, dataFilterTable, isReload = false) => {
    if (!dateFilter) {
      const dataFilterObjects = [this.dataFilter, this.dataFilterEvents, this.dataFilterConversion];
      dataFilterObjects?.forEach((dataFilterObj) => {
        for (const key in dataFilterObj) {
          if (key.startsWith('filter[domain]')) {
            delete dataFilterObj[key];
          }
        }
      });
    }
    this.getRealTime({ ...dataFilter, ...dataFilterTable }, dateFilter, {}, isReload);
  };

  getRealTime = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' },
    isReload = false
  ) => {
    this.statusTable = !isReload ? PAGE_STATUS.LOADING : PAGE_STATUS.READY;
    this.sortBy = sortBy;
    this.dataFilter = {
      page_size: '20',
      ...this.dataFilter,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    this.globalStoreViewModel.dataFilter = {
      ...(sortBy['sort[]'] && { 'sort[]': sortBy['sort[]'] }),
      ...(sortBy['sort_direction[]'] && { 'sort_direction[]': sortBy['sort_direction[]'] }),
    };
    this.realTimeStore.getRealTime(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnRealTimeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getLiveVisitorsTotal = async (dataFilter, isReload = false) => {
    console.log('isReload', isReload);
    this.statusLiveVisitorsTotal = !isReload ? PAGE_STATUS.LOADING : PAGE_STATUS.READY;
    this.dataFilterLiveVisitors = {
      ...dataFilter,
    };
    await this.realTimeStore.getLiveVisitorsTotal(
      this.dataFilterLiveVisitors,
      this.callbackOnLiveVisitorsTotalSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  getLiveVisitorsDevice = async (dataFilter, isReload = false) => {
    this.statusLiveVisitorsDevice = !isReload ? PAGE_STATUS.LOADING : PAGE_STATUS.READY;
    this.dataFilterLiveVisitors = {
      page_size: '8',
      ...dataFilter,
    };
    await this.realTimeStore.getLiveVisitorsDevice(
      this.dataFilterLiveVisitors,
      this.callbackOnLiveVisitorsDeviceSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilter = (dataFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    this.realTimeStore.getRealTime(
      this.dataFilter,
      dateRangeFilter,
      this.callbackOnRealTimeSuccessHandler,
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

  handleFilterRealTime = async (dataFilter, intergration) => {
    const location = history.location;
    this.statusTable = PAGE_STATUS.LOADING;

    this.dataFilterRealTime = { ...this.dataFilter, ...dataFilter };
    this.globalStoreViewModel.dataFilter = { pagination: this.dataFilterRealTime?.page };

    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.realTimeStore.getRealTime(
      this.dataFilterRealTime,
      dateRangeFilter,
      this.callbackOnRealTimeSuccessHandler,
      this.callbackOnErrorHandler
    );
    if (dataFilter?.page) {
      const search = {
        ...queryString.parse(location.search),
        ...{ pagination: dataFilter?.page },
      };
      !intergration &&
        window.history.replaceState('', '', `/visitors/realtime?${queryString.stringify(search)}`);
    }
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    this.statusTable = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnRealTimeSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.statusTable = PAGE_STATUS.READY;
        const transformData = new RealTimeModel(data.list, this.globalStoreViewModel);
        this.realtimeTableData = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLiveVisitorsTotalSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.liveVisitorsTotalData = data?.list[BI_LIVE_VISITORS_TOTAL_FIELD_KEY.TOTAL];
        this.statusLiveVisitorsTotal = PAGE_STATUS.READY;
      }
    } else {
      this.statusLiveVisitorsTotal = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnLiveVisitorsDeviceSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled' && data?.message !== 'isCancle') {
        this.liveVisitorsDeviceData = data?.list;
        this.statusLiveVisitorsDevice = PAGE_STATUS.READY;
      }
    } else {
      this.statusLiveVisitorsDevice = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  updateConsentsTemplate = async (formData, integration) => {
    this.formSelectTimeStatus = PAGE_STATUS.LOADING;
    const data = await this.realTimeStore.updateConsentsTemplate(formData, integration);
    runInAction(async () => {
      if (!data?.error) {
        this.onSuccessConsentTemplateHandler(data?.response, 'Updated successfully');
      } else {
        this.callbackOnErrorHandler(data?.response);
      }
    });
    return data;
  };
  onSuccessConsentTemplateHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
      this.formSelectTimeStatus = PAGE_STATUS.READY;
    }
  };
}

export default RealTimeListViewModel;
