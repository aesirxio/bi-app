/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import EventsListViewModel from './EventsListViewModel';

class EventsViewModel {
  eventsList = null;
  constructor(eventsStore, globalStore) {
    if (eventsStore) {
      this.eventsList = new EventsListViewModel(eventsStore, globalStore);
    }
  }

  getEventsListViewModel = () => this.eventsList;
}

export default EventsViewModel;
