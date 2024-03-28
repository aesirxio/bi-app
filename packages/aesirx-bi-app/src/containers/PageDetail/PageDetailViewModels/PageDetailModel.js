/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PageDetailListViewModel from './PageDetailViewModel';

class PageDetailModel {
  pageDetailListViewModel = null;

  constructor(pageDetailStore, globalStore) {
    if (pageDetailStore) {
      this.pageDetailListViewModel = new PageDetailListViewModel(pageDetailStore, globalStore);
    }
  }
  getPageDetailListViewModel = () => this.pageDetailListViewModel;
}

export default PageDetailModel;
