/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';

class UserListViewModel {
  formStatus = PAGE_STATUS.READY;
  cityListViewModel = {};
  items = [];
  filter = {};
  successResponse = {
    state: false,
    content_id: '',
    listPublishStatus: [],
    1: [],
    filters: {
      'list[limit]': 50,
    },
    listUsers: [],
    pagination: null,
    listUsersWithoutPagination: [],
  };

  constructor(userStore) {
    makeAutoObservable(this);
    this.userStore = userStore;
  }

  setForm = (cityListViewModel) => {
    this.cityListViewModel = cityListViewModel;
  };

  initializeAllData = async () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
    const data = await this.userStore.getList(this.filter);

    runInAction(() => {
      if (!data?.error) {
        this.callbackOnSuccessGetUsersHandler(data?.response);
      } else {
        this.onErrorListHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  handleFilter = (filter) => {
    this.filter = { ...this.filter, ...filter };
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
  };

  onErrorHandler = (error) => {
    Array.isArray(error?._messages) && error?._messages[0]?.message
      ? notify(error?._messages[0]?.message, 'error')
      : error?.message && notify(error?.message, 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  onErrorListHandler = (error) => {
    if (error?.code === 404) {
      notify('Cannot create!', 'error');
      this.successResponse.listUsersWithoutPagination = [];
    } else {
      Array.isArray(error?._messages) && error?._messages[0]?.message
        ? notify(error?._messages[0]?.message, 'error')
        : error?.message && notify(error?.message, 'error');
    }

    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  deleteUsers = async (arr) => {
    const data = await this.userStore.delete(arr);
    runInAction(async () => {
      if (!data?.error) {
        await this.initializeAllData();
        this.onSuccessHandler(data?.response, 'Deleted successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  callbackOnSuccessGetUsersHandler = (result) => {
    if (result?.length) {
      this.successResponse.listUsersWithoutPagination = result?.map((o) => {
        return { value: o?._id?.$oid, label: o?.sop };
      });
    }
  };

  isLoading = () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
  };
}

export default UserListViewModel;
