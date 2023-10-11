/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import UTMTrackingEventsViewModel from './UTMTrackingEventsViewModel';

class UTMTrackingViewModel {
  utmTrackingEvents = null;
  constructor(utmTrackingStore, globalStore) {
    if (utmTrackingStore) {
      this.utmTrackingEvents = new UTMTrackingEventsViewModel(utmTrackingStore, globalStore);
    }
  }

  getUTMTrackingEventsViewModel = () => this.utmTrackingEvents;
}

export default UTMTrackingViewModel;
