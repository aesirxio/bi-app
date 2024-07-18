/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { notify, history } from 'aesirx-uikit';
import PAGE_STATUS from '../../constants/PageStatus';
import { env } from 'aesirx-lib';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';

import queryString from 'query-string';

class BiListViewModel {
  paginationCollections = null;
  status = PAGE_STATUS.READY;
  data = [];
  listDomain = env.REACT_APP_DATA_STREAM ? JSON.parse(env.REACT_APP_DATA_STREAM) : [];
  tableRowHeader = null;
  dateFilter = {
    date_start: moment().subtract(7, 'd').format('YYYY-MM-DD'),
    date_end: moment().endOf('day').format('YYYY-MM-DD'),
  };
  dataFilter = {};
  pageSize = 5;
  isList = false;
  activeDomain = env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain;
  isSearch = false;
  integrationLink = 'dashboard';
  constructor() {
    makeAutoObservable(this);

    const checkPage = queryString.parse(location.search);
    this.activeDomain = checkPage?.domain
      ? Array.isArray(checkPage?.domain)
        ? checkPage?.domain
        : checkPage?.domain?.split(',')
      : env.REACT_APP_DATA_STREAM && [JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain];
    this.integrationLink = checkPage?.page
      ? checkPage?.page?.replace('aesirx-bi-', '')
      : 'dashboard';

    const date_start = checkPage?.date_start;
    const date_end = checkPage?.date_end;
    if (date_start || date_end) {
      this.dateFilter = {
        date_start: date_start,
        date_end: date_end,
      };
    }
  }

  setActiveDomain = (domain) => {
    const location = history.location;
    // WP or Joomla
    if (
      location.pathname === '/wp-admin/admin.php' ||
      location.pathname === '/administrator/index.php'
    ) {
      const search = {
        ...queryString.parse(location.search),
        ...{ domain: domain },
      };
      history.push({
        ...location,
        ...{ search: queryString.stringify(search) },
      });
    } else {
      const search = {
        ...queryString.parse(location.search),
        ...{ domain: domain },
      };
      history.push({
        ...location,
        ...{ search: queryString.stringify(search) },
      });
    }
    this.activeDomain = domain;
  };

  setIntegrationLink = (link) => {
    if (
      location.pathname === '/wp-admin/admin.php' ||
      location.pathname === '/administrator/index.php'
    ) {
      const search = {
        ...queryString.parse(location.search),
        ...{ page: 'aesirx-bi-' + link },
      };
      console.log(
        'unescape(queryString.stringify(search))',
        unescape(queryString.stringify(search))
      );
      history.push({
        ...location,
        ...{ search: unescape(queryString.stringify(search)) },
      });
    }
    this.integrationLink = link;
  };

  setDateFilter = (date_start, date_end) => {
    this.dateFilter = {
      ...this.dateFilter,
      date_start: moment(date_start).format('YYYY-MM-DD'),
      date_end: date_end
        ? moment(date_end).format('YYYY-MM-DD')
        : moment(date_start).format('YYYY-MM-DD'),
    };

    const search = {
      ...queryString.parse(location.search),
      ...{
        date_start: moment(date_start).format('YYYY-MM-DD'),
        date_end: date_end
          ? moment(date_end).format('YYYY-MM-DD')
          : moment(date_start).format('YYYY-MM-DD'),
      },
    };
    history.push({
      ...location,
      ...{ search: queryString.stringify(search) },
    });
  };

  resetObservableProperties = () => {};

  callbackOnErrorHandler = (error) => {
    if (error.message === 'isCancle') {
      this.status = PAGE_STATUS.READY;
    } else notify(error.message, 'error');
  };

  callbackOnDataSuccessHandler = (data) => {
    if (data) {
      this.status = PAGE_STATUS.READY;
      this.data = data;
    } else {
      this.status = PAGE_STATUS.ERROR;
    }
  };
}

export default BiListViewModel;
