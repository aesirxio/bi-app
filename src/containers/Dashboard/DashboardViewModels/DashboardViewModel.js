/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import VisitorListViewModel from 'store/VisitorStore/VisitorListViewModel';
import SummaryListViewModel from 'store/SummaryStore/SummaryListViewModel';
import BiListViewModel from 'store/BiStore/BiListViewModel';
import DashboardListViewModel from './DashboardListViewModel';

class DashboardViewModel {
  visitorListViewModel = null;
  dashboardListViewModel = null;
  summaryListViewModel = null;
  biListViewModel = null;
  constructor(dashboardStore, visitorStore, summaryStore, biStore) {
    if (dashboardStore) {
      this.dashboardListViewModel = new DashboardListViewModel(dashboardStore);
      this.visitorListViewModel = new VisitorListViewModel(visitorStore);
      this.summaryListViewModel = new SummaryListViewModel(summaryStore);
      this.biListViewModel = new BiListViewModel(biStore);
    }
  }
  getDashboardListViewModel = () => this.dashboardListViewModel;
  getVisitorListViewModel = () => this.visitorListViewModel;
  getSummaryListViewModel = () => this.summaryListViewModel;
  getBiListViewModel = () => this.biListViewModel;
}

export default DashboardViewModel;
