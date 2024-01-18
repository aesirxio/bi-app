/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import FlowListListViewModel from './FlowListViewModel';

class FlowListViewModel {
  flowListListViewModel = null;

  constructor(flowListStore, globalStore) {
    if (flowListStore) {
      this.flowListListViewModel = new FlowListListViewModel(flowListStore, globalStore);
    }
  }
  getFlowListListViewModel = () => this.flowListListViewModel;
}

export default FlowListViewModel;
