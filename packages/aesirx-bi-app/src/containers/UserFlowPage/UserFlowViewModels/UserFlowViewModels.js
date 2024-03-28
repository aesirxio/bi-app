/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import UserFlowListViewModel from './UserFlowListViewModel';

class UserFlowViewModel {
  userFlowListViewModel = null;

  constructor(userFlowStore, globalStore) {
    if (userFlowStore) {
      this.userFlowListViewModel = new UserFlowListViewModel(userFlowStore, globalStore);
    }
  }
  getUserFlowListViewModel = () => this.userFlowListViewModel;
}

export default UserFlowViewModel;
