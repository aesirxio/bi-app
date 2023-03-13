/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import DashboardListViewModel from './DashboardListViewModel';

class DashboardViewModel {
  dashboardListViewModel = null;

  constructor(dashboardStore, globalStore) {
    if (dashboardStore) {
      this.dashboardListViewModel = new DashboardListViewModel(dashboardStore, globalStore);
    }
  }
  getDashboardListViewModel = () => this.dashboardListViewModel;
}

export default DashboardViewModel;
