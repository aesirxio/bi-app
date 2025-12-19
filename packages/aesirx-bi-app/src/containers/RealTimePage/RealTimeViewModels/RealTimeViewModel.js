/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import RealTimeListViewModel from './RealTimeListViewModel';

class RealTimeViewModel {
  realTimeListViewModel = null;

  constructor(realTimeStore, globalStore) {
    if (realTimeStore) {
      this.realTimeListViewModel = new RealTimeListViewModel(realTimeStore, globalStore);
    }
  }
  getRealTimeListViewModel = () => this.realTimeListViewModel;
}

export default RealTimeViewModel;
