/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import DashboardStore from 'containers/Dashboard/DashboardStore/DashboardStore';
import DashboardViewModel from 'containers/Dashboard/DashboardViewModels/DashboardViewModel';
import { DashboardViewModelContextProvider } from 'containers/Dashboard/DashboardViewModels/DashboardViewModelContextProvider';
import AudiencePage from './Audience';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const AudienceContainer = observer(
  class AudienceContainer extends Component {
    dashboardStore = null;
    dashboardViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.dashboardStore = new DashboardStore();
      this.dashboardViewModel = new DashboardViewModel(this.dashboardStore, this.biListViewModel);
    }

    render() {
      return (
        <DashboardViewModelContextProvider viewModel={this.dashboardViewModel}>
          <AudiencePage />
        </DashboardViewModelContextProvider>
      );
    }
  }
);

export default withTranslation('common')(withRouter(withBiViewModel(AudienceContainer)));
