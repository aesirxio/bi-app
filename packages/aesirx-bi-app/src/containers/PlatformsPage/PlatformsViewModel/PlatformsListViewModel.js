import { makeAutoObservable } from 'mobx';
import PAGE_STATUS from '../../../constants/PageStatus';
import moment from 'moment';
import { notify } from 'aesirx-uikit';
import platformsModel from '../PlatformsModel/PlatformsModel';
import PageModel from 'containers/VisitorsPage/PagesModel/PageModel';

class PlatformsListViewModel {
  platformsStore = null;
  status = PAGE_STATUS.READY;
  statusTopPageTable = PAGE_STATUS.READY;
  statusTopBrowser = PAGE_STATUS.READY;
  statusTopSourceTable = PAGE_STATUS.READY;
  pagesTableData = null;
  globalStoreViewModel = null;
  browsersData = null;
  devicesData = null;
  devicesTableData = null;
  ispsData = null;
  ispsTableData = null;
  sortByDevices = { 'sort[]': '', 'sort_direction[]': '' };
  sortByBrowsers = { 'sort[]': '', 'sort_direction[]': '' };
  sortByIsps = { 'sort[]': '', 'sort_direction[]': '' };
  constructor(platformsStore, globalStoreViewModel) {
    makeAutoObservable(this);
    this.platformsStore = platformsStore;
    this.globalStoreViewModel = globalStoreViewModel;
  }

  initialize = (dataFilter, dateFilter) => {
    this.getBrowsers(dataFilter, dateFilter);
    this.getDevices(dataFilter, dateFilter);
    this.getIsps(dataFilter, dateFilter);
  };

  getPages = async (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_page_views', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopPageTable = PAGE_STATUS.LOADING;
    this.sortByPages = sortBy;
    this.dataFilterPages = {
      page_size: '8',
      ...this.dataFilterPages,
      ...dataFilter,
      ...this.sortByPages,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };
    console.log(dateRangeFilter);

    await this.platformsStore.getPages(
      this.dataFilterPages,
      dateRangeFilter,
      this.callbackOnPagesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnPagesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        this.statusTopPageTable = PAGE_STATUS.READY;
        const transformData = new PageModel(data.list, this.globalStoreViewModel);
        this.pagesTableData = {
          list: transformData.toPagesTableTopDashboard(),
          pagination: data.pagination,
        };
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.statusTopPageTable = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnSummaryDataSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.status = PAGE_STATUS.READY;
        this.summaryData = data;
      }
    } else {
      this.status = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  getBrowsers = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByBrowsers = sortBy;
    this.dataFilterBrowsers = {
      page_size: '8',
      ...this.dataFilterBrowsers,
      ...dataFilter,
      ...this.sortByBrowsers,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.platformsStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getDevices = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByDevices = sortBy;
    this.dataFilterDevices = {
      page_size: '8',
      ...this.dataFilterDevices,
      ...dataFilter,
      ...this.sortByDevices,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.platformsStore.getDevices(
      this.dataFilterDevices,
      dateRangeFilter,
      this.callbackOnDevicesSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  getIsps = (
    dataFilter,
    dateFilter,
    sortBy = { 'sort[]': 'number_of_visitors', 'sort_direction[]': 'desc' }
  ) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.sortByIsps = sortBy;
    this.dataFilterIsps = {
      page_size: '8',
      ...this.dataFilterIsps,
      ...dataFilter,
      ...this.sortByIsps,
    };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter, ...dateFilter };

    this.platformsStore.getIsps(
      this.dataFilterIsps,
      dateRangeFilter,
      this.callbackOnIspsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnIspsSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.ispsData = data?.list;
        const transformData = new platformsModel(data.list, this.globalStoreViewModel);
        console.log(transformData);
        this.ispsTableData = {
          list: transformData.toIspsTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnDevicesSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        this.devicesData = data?.list;
        const transformData = new platformsModel(data.list, this.globalStoreViewModel);
        this.devicesTableData = {
          list: transformData.toDevicesTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  handleFilterBrowsers = async (dataFilter) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.dataFilterBrowsers = { ...this.dataFilterBrowsers, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.platformsStore.getBrowsers(
      this.dataFilterBrowsers,
      dateRangeFilter,
      this.callbackOnBrowsersSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  handleFilterIsps = async (dataFilter) => {
    this.statusTopBrowser = PAGE_STATUS.LOADING;
    this.dataFilterIsps = { ...this.dataFilterIsps, ...dataFilter };
    const dateRangeFilter = { ...this.globalStoreViewModel.dateFilter };
    await this.platformsStore.getIsps(
      this.dataFilterIsps,
      dateRangeFilter,
      this.callbackOnIspsSuccessHandler,
      this.callbackOnErrorHandler
    );
  };

  callbackOnBrowsersSuccessHandler = (data) => {
    if (data) {
      if (data?.message !== 'canceled') {
        const transformData = new platformsModel(data.list, this.globalStoreViewModel);
        this.browsersData = {
          list: transformData.toBrowsersTableTop(),
          pagination: data.pagination,
        };
        this.statusTopBrowser = PAGE_STATUS.READY;
      }
    } else {
      this.statusTopBrowser = PAGE_STATUS.ERROR;
      this.data = [];
    }
  };

  callbackOnErrorHandler = (error) => {
    this.status = PAGE_STATUS.READY;
    console.log('error', error);
    notify(error.message, 'error');
  };

  handleFilterDateRange = (startDate, endDate) => {
    this.status = PAGE_STATUS.LOADING;
    let dateRangeFilter = {
      date_start: moment(startDate).format('YYYY-MM-DD'),
      date_end: moment(endDate).endOf('day').format('YYYY-MM-DD'),
    };
    this.initialize(this.dataFilter, dateRangeFilter);
  };
}

export default PlatformsListViewModel;
