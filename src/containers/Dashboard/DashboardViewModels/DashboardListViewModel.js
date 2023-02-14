/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PAGE_STATUS from 'constants/PageStatus';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
class DashboardListViewModel {
  dashboardStore = null;
  status = PAGE_STATUS.READY;
  dateFilter = {
    date_start: moment().startOf('month').format('YYYY-MM-DD'),
    date_end: moment().endOf('day').format('YYYY-MM-DD'),
  };
  data = null;
  constructor(dashboardStore) {
    makeAutoObservable(this);
    this.dashboardStore = dashboardStore;
  }
}

export default DashboardListViewModel;
