/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AcquisitionDetailListViewModel from './AcquisitionDetailViewModel';

class AcquisitionDetailModel {
  acquisitionDetailListViewModel = null;

  constructor(acquisitionDetailStore, globalStore) {
    if (acquisitionDetailStore) {
      this.acquisitionDetailListViewModel = new AcquisitionDetailListViewModel(
        acquisitionDetailStore,
        globalStore
      );
    }
  }
  getAcquisitionDetailListViewModel = () => this.acquisitionDetailListViewModel;
}

export default AcquisitionDetailModel;
