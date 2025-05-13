/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import ConsentsListModel from '../ConsentsAdvanceModel/ConsentsAdvanceListEventModel';
import ConsentsTableModel from '../ConsentsAdvanceModel/ConsentsAdvanceTableModel';
class ConsentsListViewModel {
  consentsAdvanceStore = null;
  status = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  statusConsentsList = PAGE_STATUS.READY;
  consentsListData = null;
  statusConsentsDate = PAGE_STATUS.READY;
  consentsDateData = null;
  statusConsentsTier = PAGE_STATUS.READY;
  statusTierChart = PAGE_STATUS.READY;
  consentsTierData = [];
  consentsCategoryData = null;
  statusConsentsCategory = PAGE_STATUS.READY;
  consentsCategoryByDateData = null;
  statusConsentsCategoryByDate = PAGE_STATUS.READY;
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsAdvanceStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsAdvanceStore = consentsAdvanceStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (dataFilter, dateFilter) => {
    this.statusTierChart = PAGE_STATUS.LOADING;
    if (!dateFilter) {
      const dataFilterObjects = [this.dataFilterConsentsList, this.dataFilterConsentsDate];
      dataFilterObjects?.forEach((dataFilterObj) => {
        for (const key in dataFilterObj) {
          if (key.startsWith('filter[domain]')) {
            delete dataFilterObj[key];
          }
        }
      });
    }
    this.getConsentsCategory(
      {
        ...dataFilter,
      },
      dateFilter
    );
    this.getConsentsCategoryByDate(
      {
        ...dataFilter,
      },
      dateFilter
    );
    Promise.all([
      this.getConsentsTier(
        {
          ...dataFilter,
        },
        dateFilter
      ),
      this.getEventsType(
        {
          ...dataFilter,
        },
        dateFilter,
        {
          'filter[event_name]': 'Reject consent',
        }
      ),
      this.getEventsType(
        {
          ...dataFilter,
        },
        dateFilter,
        {
          'filter[event_name]': 'Revoke consent',
        }
      ),
    ]).then(() => {
      this.statusTierChart = PAGE_STATUS.READY;
    });
  };

  getConsentsTier = (dataFilter, dateFilter) => {
    this.statusConsentsTier = PAGE_STATUS.LOADING;
    this.dataFilterConsentsDate = {
      page_size: '999',
      ...this.dataFilterConsentsDate,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsAdvanceStore.getConsentsTier(
      this.dataFilterConsentsDate,
      dateRangeFilter,
      this.callbackOnDataConsentsTierSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getConsentsCategory = (dataFilter, dateFilter) => {
    this.statusConsentsCategory = PAGE_STATUS.LOADING;
    this.dataFilterConsentsDate = {
      page_size: '999',
      ...this.dataFilterConsentsDate,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsAdvanceStore.getConsentsCategory(
      this.dataFilterConsentsDate,
      dateRangeFilter,
      this.callbackOnDataConsentsCategorySuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getConsentsCategoryByDate = (dataFilter, dateFilter) => {
    this.statusConsentsCategoryByDate = PAGE_STATUS.LOADING;
    this.dataFilterConsentsDate = {
      page_size: '999',
      ...this.dataFilterConsentsDate,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsAdvanceStore.getConsentsCategoryByDate(
      this.dataFilterConsentsDate,
      dateRangeFilter,
      this.callbackOnDataConsentsCategoryByDateSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getEventsType = async (
    dataFilter,
    dateFilter,
    sortBy = {
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
    }
  ) => {
    this.statusConsentsTier = PAGE_STATUS.LOADING;
    this.sortByEventsType = sortBy;
    this.dataFilterEventsType = {
      page_size: '999',
      ...this.dataFilterEventsType,
      ...dataFilter,
      ...this.sortByEventsType,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    await this.consentsAdvanceStore.getEventsType(
      this.dataFilterEventsType,
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
    this.consentsTierData = [];
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataConsentsTierSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsTier = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsTierData = [...this.consentsTierData, ...transformData?.toChartByTier()];
      this.consentsTierData?.sort((a, b) => (a.value > b.value ? -1 : 1));
    } else {
      this.statusConsentsTier = PAGE_STATUS.ERROR;
      this.consentsTierData = [];
    }
  };

  callbackOnDataConsentsCategorySuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsCategory = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsCategoryData = transformData;
    } else {
      this.statusConsentsCategory = PAGE_STATUS.ERROR;
    }
  };

  callbackOnDataConsentsCategoryByDateSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsCategoryByDate = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsCategoryByDateData = transformData;
    } else {
      this.statusConsentsCategoryByDate = PAGE_STATUS.ERROR;
    }
  };
}

export default ConsentsListViewModel;
