/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify } from 'aesirx-uikit';
import PAGE_STATUS from '../../../constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import WoocommerceListModel from '../WoocommerceModel/WoocommerceListEventModel';
import WoocoomerceTableModel from '../WoocommerceModel/WoocommerceTableModel';
class WoocommerceListViewModel {
  woocommerceStore = null;
  status = PAGE_STATUS.READY;
  statusTable = PAGE_STATUS.READY;
  statusTopProductViewTable = PAGE_STATUS.READY;
  statusTopProductCartTable = PAGE_STATUS.READY;
  statusTopProductSearchTable = PAGE_STATUS.READY;
  globalStoreViewModel = null;
  data = null;
  dataWoocommerce = null;
  dataAddToCart = null;
  dataSearchProduct = null;
  dataCheckout = null;
  dataFilter = {};
  attributeData = null;
  productViewTableData = null;
  productCartTableData = null;
  productSearchTableData = null;
  constructor(woocommerceStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.woocommerceStore = woocommerceStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = async (dataFilter, dateFilter) => {
    this.getVisitor(
      {
        ...dataFilter,
        'filter[attribute_name]': 'analytics_woocommerce',
        'filter_not[event_name]': 'visit',
      },
      dateFilter
    );
    this.getWoocommerce(
      {
        ...dataFilter,
        'filter[attribute_name]': 'analytics_woocommerce',
        'filter_not[event_name]': 'visit',
      },
      dateFilter
    );
    Promise.all([
      this.getAttribute(
        {
          ...dataFilter,
          page_size: 5,
          'filter[attribute_name]': 'wooocommerce_product_name',
        },
        dateFilter,
        'cart'
      ),
      this.getAttribute(
        {
          ...dataFilter,
          page_size: 5,
          'filter[attribute_name]': 'wooocommerce_search',
        },
        dateFilter,
        'search'
      ),
      this.getAttribute(
        {
          ...dataFilter,
          page_size: 5,
          'filter[attribute_name]': 'woo.view_product',
        },
        dateFilter,
        'view_product'
      ),
    ]);
  };

  getVisitor = (dataFilter, dateFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = {
      page_size: '5',
      'sort[]': 'number_of_page_views',
      'sort_direction[]': 'desc',
      ...this.dataFilterTable,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.woocommerceStore.getVisitor(
      this.dataFilterTable,
      dateRangeFilter,
      this.callbackOnDataSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getWoocommerce = (dataFilter, dateFilter) => {
    this.status = PAGE_STATUS.LOADING;
    this.dataFilterWoocommerce = {
      page_size: '1000',
      ...this.dataFilterWoocommerce,
      ...dataFilter,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.woocommerceStore.getWoocommerce(
      this.dataFilterWoocommerce,
      dateRangeFilter,
      this.callbackOnDataWoocommerceSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getAttribute = (dataFilter, dateFilter, attr) => {
    this.status = PAGE_STATUS.LOADING;
    this.statusTopProductViewTable = PAGE_STATUS.LOADING;
    this.statusTopProductCartTable = PAGE_STATUS.LOADING;
    this.statusTopProductSearchTable = PAGE_STATUS.LOADING;
    this.dataFilter = { ...this.dataFilter, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel?.dateFilter, ...dateFilter };

    this.woocommerceStore.getAttribute(
      dataFilter,
      dateRangeFilter,
      this.callbackOnDataAttributeSuccessHandler,
      this.callbackOnErrorHandler,
      attr
    );
  };

  setDataFilter = (dataFilter) => {
    this.dataFilter = dataFilter;
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    this.statusTopProductViewTable = PAGE_STATUS.LOADING;
    this.statusTopProductCartTable = PAGE_STATUS.LOADING;
    this.statusTopProductSearchTable = PAGE_STATUS.LOADING;
    const dateRangeFilter = {
      ...this.globalStoreViewModel.dateFilter,
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };

    this.dateFilter = { ...this.dateFilter, ...dateRangeFilter };
    this.initialize(this.dataFilter, dateRangeFilter);
  };

  handleFilterTable = async (dataFilter) => {
    this.statusTable = PAGE_STATUS.LOADING;
    this.dataFilterTable = { ...this.dataFilterTable, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.woocommerceStore.getVisitor(
      this.dataFilterTable,
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
    if (data?.list) {
      this.statusTable = PAGE_STATUS.READY;
      const transformData = new WoocommerceListModel(data?.list, this.globalStoreViewModel);
      this.data = {
        list: transformData,
        pagination: data.pagination,
      };
    } else {
      this.statusTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataWoocommerceSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      const transformData = new WoocommerceListModel(data, this.globalStoreViewModel);
      this.dataWoocommerce = transformData;
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDataAttributeSuccessHandler = (data, attr) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      if (attr === 'cart') {
        this.statusTopProductCartTable = PAGE_STATUS.READY;
        const transformData = new WoocoomerceTableModel(data[0]?.values, this.globalStoreViewModel);
        this.productCartTableData = {
          list: transformData?.toProductCartTableTop(),
          pagination: data.pagination,
        };
      } else if (attr === 'search') {
        this.statusTopProductSearchTable = PAGE_STATUS.READY;
        const transformData = new WoocoomerceTableModel(data[0]?.values, this.globalStoreViewModel);
        this.productSearchTableData = {
          list: transformData?.toProductSearchTableTop(),
          pagination: data.pagination,
        };
      } else if (attr === 'checkout') {
        const transformData = new WoocoomerceTableModel(data[0]?.values, this.globalStoreViewModel);
        this.dataCheckout = transformData?.toWoocoomerceTableCheckoutTop();
      } else if (attr === 'view_product') {
        this.statusTopProductViewTable = PAGE_STATUS.READY;
        const transformData = new WoocoomerceTableModel(data[0]?.values, this.globalStoreViewModel);
        this.productViewTableData = {
          list: transformData?.toViewProductTableTop(),
          pagination: data.pagination,
        };
      } else {
        this.attributeData = data;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopProductCartTable = PAGE_STATUS.ERROR;
      this.statusTopProductViewTable = PAGE_STATUS.ERROR;
      this.statusTopProductSearchTable = PAGE_STATUS.ERROR;
      this.dataAddToCart = {};
      this.dataSearchProduct = {};
      this.dataCheckout = {};
      this.attributeData = {};
    }
  };
}

export default WoocommerceListViewModel;
