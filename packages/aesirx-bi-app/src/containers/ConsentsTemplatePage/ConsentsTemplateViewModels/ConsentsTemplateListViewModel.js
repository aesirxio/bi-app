/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class ConsentsTemplateListViewModel {
  consentsStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusConsentsTemplate = PAGE_STATUS.READY;
  statusUpdateConsentsTemplate = PAGE_STATUS.READY;
  consentsTemplate = null;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (activeDomain) => {
    this.getConsentsTemplate(activeDomain);
  };

  getConsentsTemplate = (activeDomain) => {
    this.statusConsentsTemplate = PAGE_STATUS.LOADING;

    this.consentsStore.getConsentsTemplate(
      activeDomain,
      this.callbackOnDataConsentsTemplateListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  updateConsentsTemplate = (data) => {
    this.statusUpdateConsentsTemplate = PAGE_STATUS.LOADING;
    this.consentsStore.updateConsentsTemplate(
      data,
      this.callbackOnDataUpdateConsentTemplateSuccessHandler,
      this.callbackOnErrorUpdateConsentHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusConsentsTemplate = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTableConsentsTemplateList = async (dataFilter) => {
    this.statusConsentsTemplate = PAGE_STATUS.LOADING;
    this.dataFilterConsentsTemplateList = {
      ...this.dataFilterConsentsTemplateList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsStore.getConsentsTemplate(
      this.dataFilterConsentsTemplateList,
      dateRangeFilter,
      this.callbackOnDataConsentsTemplateListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusConsentsTemplate = PAGE_STATUS.READY;
    this.consentsTemplate = {};
    // notify(error.message, 'error');
  };
  callbackOnErrorUpdateConsentHandler = () => {
    this.status = PAGE_STATUS.READY;
    this.statusUpdateConsentsTemplate = PAGE_STATUS.READY;
    // notify(error.message, 'error');
  };

  callbackOnDataConsentsTemplateListSuccessHandler = (data) => {
    if (data) {
      this.statusConsentsTemplate = PAGE_STATUS.READY;
      this.consentsTemplate = data;
    } else {
      this.statusConsentsTemplate = PAGE_STATUS.ERROR;
      this.consentsTemplate = {};
    }
  };

  callbackOnDataUpdateConsentTemplateSuccessHandler = (data) => {
    if (data) {
      this.statusUpdateConsentsTemplate = PAGE_STATUS.READY;
      this.consentsTemplate = data;
      notify('Update Successful');
    } else {
      this.statusUpdateConsentsTemplate = PAGE_STATUS.ERROR;
      this.consentsTemplate = {};
    }
  };
}

export default ConsentsTemplateListViewModel;
