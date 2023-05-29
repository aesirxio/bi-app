/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import DashboardStore from './DashboardStore/DashboardStore';
import DashboardViewModel from './DashboardViewModels/DashboardViewModel';
import { DashboardViewModelContextProvider } from './DashboardViewModels/DashboardViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import Dashboard from './Dashboard';
import { history } from 'aesirx-uikit';
import ReactToPrint from 'react-to-print';
import 'flag-icons/sass/flag-icons.scss';

const DashboardContainer = observer(
  class DashboardContainer extends Component {
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

    componentDidMount = () => {
      if (!this.props.integration && history.location.pathname === '/') {
        history.push(`${this.biListViewModel.activeDomain}`);
      }
    };
    render() {
      return (
        <DashboardViewModelContextProvider viewModel={this.dashboardViewModel}>
          <ReactToPrint
            trigger={() => {
              return (
                <a
                  className={`btn btn-success me-2 text-nowrap fw-semibold py-16 lh-sm printButton ${this.props?.i18n?.language}`}
                  href="#"
                >
                  {this.props.t('txt_export_pdf')}
                </a>
              );
            }}
            content={() => this.componentRef}
          />
          <ComponentToPrint ref={(el) => (this.componentRef = el)} />
        </DashboardViewModelContextProvider>
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
      return <Dashboard {...this.props} />;
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(DashboardContainer)));
