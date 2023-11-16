/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import ConsentsListModel from '../ConsentsModel/ConsentsListEventModel';
import ConsentsTableModel from '../ConsentsModel/ConsentsTableModel';
class ConsentsListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusConsentsList = PAGE_STATUS.READY;
  consentsListData = null;
  statusConsentsDate = PAGE_STATUS.READY;
  consentsDateData = null;
  statusConsentsTier = PAGE_STATUS.READY;
  consentsTierData = null;
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (dataFilter, dateFilter) => {
    this.getConsentsList(
      {
        ...dataFilter,
      },
      dateFilter
    );
    this.getConsentsDate(
      {
        ...dataFilter,
      },
      dateFilter
    );
    this.getConsentsTier(
      {
        ...dataFilter,
      },
      dateFilter
    );
  };

  getConsentsList = (dataFilter, dateFilter) => {
    this.statusConsentsList = PAGE_STATUS.LOADING;
    this.dataFilterConsentsList = {
      page_size: '5',
      ...this.dataFilterConsentsList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsStore.getConsentsList(
      this.dataFilterConsentsList,
      dateRangeFilter,
      this.callbackOnDataConsentsListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getConsentsDate = (dataFilter, dateFilter) => {
    this.statusConsentsDate = PAGE_STATUS.LOADING;
    this.dataFilterConsentsDate = {
      page_size: '999',
      ...this.dataFilterConsentsDate,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsStore.getConsentsDate(
      this.dataFilterConsentsDate,
      dateRangeFilter,
      this.callbackOnDataConsentsDateSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getConsentsTier = (dataFilter, dateFilter) => {
    this.statusConsentsDate = PAGE_STATUS.LOADING;
    this.dataFilterConsentsDate = {
      page_size: '999',
      ...this.dataFilterConsentsDate,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsStore.getConsentsTier(
      this.dataFilterConsentsDate,
      dateRangeFilter,
      this.callbackOnDataConsentsTierSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusConsentsList = PAGE_STATUS.LOADING;
    this.statusConsentsDate = PAGE_STATUS.LOADING;
    this.statusConsentsTier = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableConsentsList = async (dataFilter) => {
    this.statusConsentsList = PAGE_STATUS.LOADING;
    this.dataFilterConsentsList = {
      ...this.dataFilterConsentsList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getConsentsList(
      this.dataFilterConsentsList,
      dateRangeFilter,
      this.callbackOnDataConsentsListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataConsentsListSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsList = PAGE_STATUS.READY;
      const transformData = new ConsentsTableModel(data.list, this.globalStoreViewModel);
      this.consentsListData = {
        list: transformData?.toConsentsListTable(),
        pagination: data.pagination,
      };
    } else {
      this.statusConsentsList = PAGE_STATUS.ERROR;
      this.consentsListData = [];
    }
  };

  callbackOnDataConsentsDateSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsDate = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsDateData = {
        list: transformData?.toChartByDate(),
        pagination: data.pagination,
      };
    } else {
      this.statusConsentsDate = PAGE_STATUS.ERROR;
      this.consentsDateData = [];
    }
  };

  callbackOnDataConsentsTierSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsTier = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsTierData = transformData?.toChartByTier();
      console.log('this.consentsTierData', this.consentsTierData);
    } else {
      this.statusConsentsTier = PAGE_STATUS.ERROR;
      this.consentsTierData = [];
    }
  };
}

export default ConsentsListViewModel;
