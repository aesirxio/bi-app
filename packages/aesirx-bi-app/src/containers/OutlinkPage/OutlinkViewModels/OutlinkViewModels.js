/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import OutlinkListViewModel from './OutlinkListViewModel';

class OutlinkViewModel {
  outlinkListViewModel = null;

  constructor(outlinkStore, globalStore) {
    if (outlinkStore) {
      this.outlinkListViewModel = new OutlinkListViewModel(outlinkStore, globalStore);
    }
  }
  getOutlinkListViewModel = () => this.outlinkListViewModel;
}

export default OutlinkViewModel;
