/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AcquisitionCampaignListModel from './AcquisitionCampaignListModel';

class AcquisitionCampaignViewModel {
  acquisitionCampaignEvents = null;
  constructor(acquisitionCampaignStore, globalStore) {
    if (acquisitionCampaignStore) {
      this.acquisitionCampaignEvents = new AcquisitionCampaignListModel(
        acquisitionCampaignStore,
        globalStore
      );
    }
  }

  getAcquisitionCampaignListModel = () => this.acquisitionCampaignEvents;
}

export default AcquisitionCampaignViewModel;
