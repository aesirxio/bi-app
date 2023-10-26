/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import VisitorsListViewModel from './VisitorsListViewModel';

class VisitorsViewModel {
  visitorsListViewModel = null;

  constructor(visitorsStore, globalStore) {
    if (visitorsStore) {
      this.visitorsListViewModel = new VisitorsListViewModel(visitorsStore, globalStore);
    }
  }
  getVisitorsListViewModel = () => this.visitorsListViewModel;
}

export default VisitorsViewModel;
