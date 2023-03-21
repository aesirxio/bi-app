/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BiListViewModel from './BiListViewModel';
class BiViewModel {
  biListViewModel = null;
  constructor(biStore) {
    if (biStore) {
      this.biListViewModel = new BiListViewModel(biStore);
    }
  }

  getBiListViewModel = () => this.biListViewModel;
}

export default BiViewModel;
