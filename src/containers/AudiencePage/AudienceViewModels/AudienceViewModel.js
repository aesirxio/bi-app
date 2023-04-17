/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AudienceListViewModel from './AudienceListViewModel';

class AudienceViewModel {
  audienceListViewModel = null;

  constructor(audienceStore, globalStore) {
    if (audienceStore) {
      this.audienceListViewModel = new AudienceListViewModel(audienceStore, globalStore);
    }
  }
  getAudienceListViewModel = () => this.audienceListViewModel;
}

export default AudienceViewModel;
