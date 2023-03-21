/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BehaviorEventsViewModel from './BehaviorEventsViewModel';

class BehaviorViewModel {
  behaviorEvents = null;
  constructor(behaviorStore, globalStore) {
    if (behaviorStore) {
      this.behaviorEvents = new BehaviorEventsViewModel(behaviorStore, globalStore);
    }
  }

  getBehaviorEventsViewModel = () => this.behaviorEvents;
}

export default BehaviorViewModel;
