/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import FlowDetailViewModel from './FlowDetailViewModel';

class FlowViewModel {
  flowDetailViewModel = null;
  constructor(flowDetailStore, behaviorStore, globalStore) {
    if ((flowDetailStore, behaviorStore)) {
      this.flowDetailViewModel = new FlowDetailViewModel(
        flowDetailStore,
        behaviorStore,
        globalStore
      );
    }
  }

  getFlowViewModel = () => this.flowDetailViewModel;
}

export default FlowViewModel;
