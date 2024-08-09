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
  statusTierChart = PAGE_STATUS.READY;
  consentsTierData = [];
  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(consentsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.consentsStore = consentsStore;
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

  getConsentsList = (
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
    this.statusConsentsTier = PAGE_STATUS.LOADING;
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

    await this.consentsStore.getEventsType(
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
      this.consentsTierData = [...this.consentsTierData, ...transformData?.toChartByTier()];
      this.consentsTierData?.sort((a, b) => (a.value > b.value ? -1 : 1));
    } else {
      this.statusConsentsTier = PAGE_STATUS.ERROR;
      this.consentsTierData = [];
    }
  };
}

export default ConsentsListViewModel;
