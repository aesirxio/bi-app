/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditUser from './UserEdit';
import { UserViewModelContextProvider } from './UserViewModel/UserViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PAGE_STATUS } from 'aesirx-uikit';

const EditUserProvider = observer(
  class EditUserProvider extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
    }
    render() {
      const { dataStream, dataStreamStatus } = this.biListViewModel;
      return (
        <UserViewModelContextProvider>
          {dataStreamStatus === PAGE_STATUS.READY ? (
            <>
              {dataStream?.is_user_admin ? (
                <EditUser />
              ) : (
                <p className="p-3 fw-semibold">Current user does not have access!</p>
              )}
            </>
          ) : (
            <></>
          )}
        </UserViewModelContextProvider>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(EditUserProvider)));
