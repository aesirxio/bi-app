/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import ConsentsListViewModel from './ConsentsListViewModel';

class ConsentsViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new ConsentsListViewModel(consentsStore, globalStore);
    }
  }

  getConsentsListViewModel = () => this.consentsList;
}

export default ConsentsViewModel;
