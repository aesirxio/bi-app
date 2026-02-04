/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditUTMLink from './UTMLinkEdit';
import { UTMLinkViewModelContextProvider } from './UTMLinkViewModel/UTMLinkViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PAGE_STATUS } from 'aesirx-uikit';
import { UTMLinkStore } from './store';
import UTMLinkViewModel from './UTMLinkViewModel/UTMLinkViewModel';

const EditUTMLinkProvider = observer(
  class EditUTMLinkProvider extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.utmLinkStore = new UTMLinkStore();
      this.utmLinkViewModel = new UTMLinkViewModel(this.utmLinkStore, this.biListViewModel);
    }
    render() {
      const { integration = false } = this.props;
      const { dataStream, dataStreamStatus, activeDomain, integrationLink, setIntegrationLink } =
        this.biListViewModel;
      return (
        <UTMLinkViewModelContextProvider>
          {dataStreamStatus === PAGE_STATUS.READY ? (
            <>
              {dataStream?.is_user_admin || integration ? (
                <EditUTMLink
                  key={integrationLink}
                  activeDomain={activeDomain}
                  isLink={this.props?.isLink}
                  integrationLink={integrationLink}
                  integration={integration}
                  setIntegrationLink={setIntegrationLink}
                />
              ) : (
                <p className="p-3 fw-semibold">Current user does not have access!</p>
              )}
            </>
          ) : (
            <></>
          )}
        </UTMLinkViewModelContextProvider>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(EditUTMLinkProvider)));
