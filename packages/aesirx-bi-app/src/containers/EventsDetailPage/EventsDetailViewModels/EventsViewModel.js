/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import EventsDetailViewModel from './EventsDetailViewModel';

class EventsViewModel {
  eventsDetail = null;
  constructor(EventsDetailStore, globalStore) {
    if (EventsDetailStore) {
      this.eventsDetail = new EventsDetailViewModel(EventsDetailStore, globalStore);
    }
  }

  getEventsDetailViewModel = () => this.eventsDetail;
}

export default EventsViewModel;
