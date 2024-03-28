/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AcquisitionListViewModel from './AcquisitionListViewModel';

class AcquisitionViewModel {
  acquisitionListViewModel = null;

  constructor(acquisitionStore, globalStore) {
    if (acquisitionStore) {
      this.acquisitionListViewModel = new AcquisitionListViewModel(acquisitionStore, globalStore);
    }
  }
  getAcquisitionListViewModel = () => this.acquisitionListViewModel;
}

export default AcquisitionViewModel;
