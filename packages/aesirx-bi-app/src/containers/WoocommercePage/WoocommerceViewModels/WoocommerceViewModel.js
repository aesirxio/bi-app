/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import WoocommerceListViewModel from './WoocommerceListViewModel';

class WoocommerceViewModel {
  woocommerceList = null;
  constructor(woocommerceStore, globalStore) {
    if (woocommerceStore) {
      this.woocommerceList = new WoocommerceListViewModel(woocommerceStore, globalStore);
    }
  }

  getWoocommerceListViewModel = () => this.woocommerceList;
}

export default WoocommerceViewModel;
