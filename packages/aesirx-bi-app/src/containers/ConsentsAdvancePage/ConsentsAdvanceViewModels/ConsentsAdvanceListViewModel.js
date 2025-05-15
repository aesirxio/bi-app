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
  consentsOverrideLanguageData = null;
  statusConsentsOverrideLanguage = PAGE_STATUS.READY;
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
    this.getConsentsRegion(
      {
        ...dataFilter,
      },
      dateFilter
    );
    this.getConsentsOverrideLanguage(
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

  getConsentsRegion = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'datetime', 'sort_direction[]': 'desc' }
  ) => {
    this.statusConsentsList = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilterConsentsList = {
      page_size: '5',
      ...this.dataFilterConsentsList,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsAdvanceStore.getConsentsRegion(
      this.dataFilterConsentsList,
      dateRangeFilter,
      this.callbackOnDataConsentsListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };
  getConsentsOverrideLanguage = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'datetime', 'sort_direction[]': 'desc' }
  ) => {
    this.statusConsentsOverrideLanguage = PAGE_STATUS.LOADING;
    this.sortByOverrideLanguage = sortBy;
    this.dataFilterConsentsOverrideLanguage = {
      page_size: '5',
      ...this.dataFilterConsentsOverrideLanguage,
      ...dataFilter,
      ...this.sortBy,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.consentsAdvanceStore.getConsentsOverrideLanguage(
      this.dataFilterConsentsOverrideLanguage,
      dateRangeFilter,
      this.callbackOnDataConsentsOverrideLanguageSuccessHandler,
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

  handleFilterTableConsentsList = async (dataFilter) => {
    this.statusConsentsList = PAGE_STATUS.LOADING;
    this.dataFilterConsentsList = {
      ...this.dataFilterConsentsList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.consentsAdvanceStore.getConsentsRegion(
      this.dataFilterConsentsList,
      dateRangeFilter,
      this.callbackOnDataConsentsListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    this.statusConsentsCategory = PAGE_STATUS.READY;
    this.statusConsentsCategoryByDate = PAGE_STATUS.READY;
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

  callbackOnDataConsentsOverrideLanguageSuccessHandler = (data) => {
    if (data) {
      this.statusConsentsOverrideLanguage = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data, this.globalStoreViewModel);
      this.consentsOverrideLanguageData = transformData;
    } else {
      this.statusConsentsOverrideLanguage = PAGE_STATUS.ERROR;
      this.consentsOverrideLanguageData = null;
    }
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
      this.consentsCategoryData = null;
      this.statusConsentsCategory = PAGE_STATUS.ERROR;
    }
  };

  callbackOnDataConsentsCategoryByDateSuccessHandler = (data) => {
    if (data?.list) {
      this.statusConsentsCategoryByDate = PAGE_STATUS.READY;
      const transformData = new ConsentsListModel(data?.list, this.globalStoreViewModel);
      this.consentsCategoryByDateData = transformData;
    } else {
      this.consentsCategoryByDateData = null;
      this.statusConsentsCategoryByDate = PAGE_STATUS.ERROR;
    }
  };
}

export default ConsentsListViewModel;
