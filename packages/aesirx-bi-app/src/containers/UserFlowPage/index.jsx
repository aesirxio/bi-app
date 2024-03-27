/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { matchPath, withRouter } from 'react-router-dom';
import UserFlowStore from './UserFlowStore/UserFlowStore';
import UserFlowViewModel from './UserFlowViewModels/UserFlowViewModels';
import { UserFlowViewModelContextProvider } from './UserFlowViewModels/UserFlowViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ExportButton from 'components/ExportButton';
import { history } from 'aesirx-uikit';

const UserFlowPage = lazy(() => import('./UserFlow'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <UserFlowPage {...props} />;
  }
};

const UserFlowContainer = observer(
  class UserFlowContainer extends Component {
    UserFlowStore = null;
    UserFlowViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.UserFlowStore = new UserFlowStore();
      this.UserFlowViewModel = new UserFlowViewModel(this.UserFlowStore, this.biListViewModel);
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const matchUserFlow = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/behavior/users-flow',
        exact: true,
        strict: false,
      });
      const dataExport =
        matchUserFlow?.isExact ||
        this?.UserFlowViewModel?.userFlowListViewModel?.pagesTableData?.list?.data;

      return (
        <UserFlowViewModelContextProvider viewModel={this.UserFlowViewModel}>
          {/* <ExportButton
            data={dataExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={matchUserFlow?.isExact || 'behavior-userFlows'}
          /> */}
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </UserFlowViewModelContextProvider>
      );
    }
  }
);

const ComponentToPrint = observer(
  class extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="aesirxui">
          {this.props.integration ? (
            <RenderComponent
              link={this.props.integrationLink}
              activeDomain={this.props.activeDomain}
              {...this.props}
            />
          ) : (
            <>
              <Route exact path={['/behavior/users-flow', '/bi/behavior-users-flow']}>
                <UserFlowPage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(UserFlowContainer)));
