/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import UTMLinkDetailViewModel from './UTMLinkDetailViewModel';
import UTMLinkListViewModel from './UTMLinkListViewModel';

class UTMLinkViewModel {
  utmLinkDetailViewModel = {};
  utmLinkListViewModel = {};

  constructor(utmLinkStore) {
    if (utmLinkStore) {
      this.utmLinkDetailViewModel = new UTMLinkDetailViewModel(utmLinkStore);
      this.utmLinkListViewModel = new UTMLinkListViewModel(utmLinkStore);
    }
  }

  getUTMLinkDetailViewModel = () => this.utmLinkDetailViewModel;
  getUTMLinkListViewModel = () => this.utmLinkListViewModel;
}

export default UTMLinkViewModel;
