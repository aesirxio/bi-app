/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import ConsentsListViewModel from './ConsentsAdvanceListViewModel';

class ConsentsAdvanceViewModel {
  consentsList = null;
  constructor(consentsAdvanceStore, globalStore) {
    if (consentsAdvanceStore) {
      this.consentsList = new ConsentsListViewModel(consentsAdvanceStore, globalStore);
    }
  }

  getConsentsListViewModel = () => this.consentsList;
}

export default ConsentsAdvanceViewModel;
