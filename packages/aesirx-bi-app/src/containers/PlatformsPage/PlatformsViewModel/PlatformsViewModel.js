/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PlatformsListViewModel from './PlatformsListViewModel';

class PlatformsViewModel {
  platformsListViewModel = null;

  constructor(platformsStore, globalStore) {
    if (platformsStore) {
      this.platformsListViewModel = new PlatformsListViewModel(platformsStore, globalStore);
    }
  }
  getPlatformsListViewModel = () => this.platformsListViewModel;
}

export default PlatformsViewModel;
