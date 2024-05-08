/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import ConsentsTemplateListViewModel from './ConsentsTemplateListViewModel';

class ConsentsTemplateViewModel {
  consentsList = null;
  constructor(consentsStore, globalStore) {
    if (consentsStore) {
      this.consentsList = new ConsentsTemplateListViewModel(consentsStore, globalStore);
    }
  }

  getConsentsTemplateListViewModel = () => this.consentsList;
}

export default ConsentsTemplateViewModel;
