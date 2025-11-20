/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import UserDetailViewModel from './UserDetailViewModel';
import UserListViewModel from './UserListViewModel';

class UserViewModel {
  userDetailViewModel = {};
  userListViewModel = {};

  constructor(userStore) {
    if (userStore) {
      this.userDetailViewModel = new UserDetailViewModel(userStore);
      this.userListViewModel = new UserListViewModel(userStore);
    }
  }

  getUserDetailViewModel = () => this.userDetailViewModel;
  getUserListViewModel = () => this.userListViewModel;
}

export default UserViewModel;
