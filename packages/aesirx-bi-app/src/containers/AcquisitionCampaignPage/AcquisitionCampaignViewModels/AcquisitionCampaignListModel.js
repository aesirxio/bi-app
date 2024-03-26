/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import AcquisitionCampaignModel from '../AcquisitionCampaignModel/AcquisitionCampaignModel';
import { BI_SUMMARY_FIELD_KEY, BI_VISITORS_FIELD_KEY } from 'aesirx-lib';
class AcquisitionCampaignListModel {
  acquisitionCampaignStore = null;
  statusAttribute = PAGE_STATUS.READY;
  statusAttributeList = PAGE_STATUS.READY;
  statusTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataFilter = {};
  attributeData = null;
  dataAttribute = null;
  dataAttributeList = null;

  sortBy = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(acquisitionCampaignStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.acquisitionCampaignStore = acquisitionCampaignStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  transformDataToAcquisitionCampaignModel = () => {
    return new AcquisitionCampaignModel(this.data);
  };

  getAttributeTable = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'start', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.sortBy = sortBy;
    this.dataFilterTable = {
      page_size: '5',
      ...this.dataFilterTable,
      ...dataFilter,
      ...this.sortBy,
    };
    if (dataFilter['filter[attribute_value]'] === 'all') {
      if (this.dataFilterTable['filter[attribute_value]']) {
        delete this.dataFilterTable['filter[attribute_value]'];
      }
    }
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.acquisitionCampaignStore.getAttribute(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttributeList = (dataFilter, dateFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterAttributeList = {
      page_size: '5',
      ...this.dataFilterAttributeList,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.acquisitionCampaignStore.getAttribute(
      this.dataFilterAttributeList,
      dateRangeFilter,
      this.callbackOnDataAttributeListSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttributeDate = (dataFilter, dateFilter) => {
    this.statusAttribute = PAGE_STATUS.LOADING;
    this.dataFilterAttribute = {
      page_size: '1000',
      ...this.dataFilterAttribute,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };
    this.acquisitionCampaignStore.getAttributeDate(
      this.dataFilterAttribute,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.statusAttribute = PAGE_STATUS.LOADING;
    this.statusTable = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.acquisitionCampaignStore.getAttributeTable(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
    this.acquisitionCampaignStore.getAttributeDate(
      this.dataFilterAttribute,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterTable = async (dataFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = { ...this.dataFilterTable, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.acquisitionCampaignStore.getAttributeTable(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnErrorHandler = (error) => {
    this.statusAttribute = PAGE_STATUS.READY;
    this.statusTable = PAGE_STATUS.READY;
    notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusTable = PAGE_STATUS.READY;

        const transformFormat = data?.list[0]?.values?.map((item) => {
          return {
            value: item?.value,
            [BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS]:
              item[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS],
            [BI_SUMMARY_FIELD_KEY?.TOTAL_NUMBER_OF_VISITORS]:
              item[BI_SUMMARY_FIELD_KEY?.TOTAL_NUMBER_OF_VISITORS],
            [BI_SUMMARY_FIELD_KEY?.AVERAGE_SESSION_DURATION]:
              item[BI_SUMMARY_FIELD_KEY?.AVERAGE_SESSION_DURATION],
            [BI_SUMMARY_FIELD_KEY?.NUMBER_OF_PAGES_PER_SESSION]:
              item[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_PAGES_PER_SESSION],
            [BI_SUMMARY_FIELD_KEY?.BOUNCE_RATE]: item[BI_SUMMARY_FIELD_KEY?.BOUNCE_RATE],
          };
        });
        const transformData = new AcquisitionCampaignModel(
          transformFormat,
          this.globalStoreViewModel
        );
        this.data = {
          list: transformData,
          pagination: data.pagination,
        };
      }
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusAttribute = PAGE_STATUS.READY;
        const transformData = new AcquisitionCampaignModel(data, this.globalStoreViewModel);
        this.dataAttribute = transformData;
      }
    } else {
      this.statusAttribute = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeListSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.statusAttributeList = PAGE_STATUS.READY;
        const transformData = new AcquisitionCampaignModel(data?.list, this.globalStoreViewModel);
        this.dataAttributeList = transformData;
      }
    } else {
      this.statusAttributeList = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };
}

export default AcquisitionCampaignListModel;
