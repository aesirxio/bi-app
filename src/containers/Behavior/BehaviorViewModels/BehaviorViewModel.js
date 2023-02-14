/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import VisitorListViewModel from 'store/VisitorStore/VisitorListViewModel';
import BehaviorEventsViewModel from './BehaviorEventsViewModel';
import BehaviorOverviewViewModel from './BehaviorOverview';

class BehaviorViewModel {
  behaviorOverviewViewModel = null;
  visitorListViewModel = null;
  behaviorEvents = null;
  constructor(behaviorStore, visitorStore) {
    if (behaviorStore) {
      this.behaviorOverviewViewModel = new BehaviorOverviewViewModel(behaviorStore);
      this.visitorListViewModel = new VisitorListViewModel(visitorStore);
      this.behaviorEvents = new BehaviorEventsViewModel(visitorStore, visitorStore);
    }
  }

  getBehaviorOverviewViewModel = () => this.behaviorOverviewViewModel;
  getVisitorListViewModel = () => this.visitorListViewModel;
  getBehaviorEventsViewModel = () => this.behaviorEvents;
}

export default BehaviorViewModel;
