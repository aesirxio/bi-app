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
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import Dashboard from './Dashboard';

import 'flag-icons/sass/flag-icons.scss';
import ExportButton from 'components/ExportButton';

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

    render() {
      const tableDashboardExport = [
        {
          name: 'Top Pages',
          data: this?.dashboardViewModel?.dashboardListViewModel?.pagesTableData?.list?.data,
        },
        {
          name: 'Locations',
          data: this?.dashboardViewModel?.dashboardListViewModel?.countriesData?.length
            ? /* eslint-disable-next-line no-unused-vars */ this?.dashboardViewModel?.dashboardListViewModel?.countriesData?.map(
                ({ country_code, flag, ...keepAttrs }) => keepAttrs
              )
            : [],
        },
        {
          name: 'Browsers',
          data: this?.dashboardViewModel?.dashboardListViewModel?.browsersData?.list?.data,
        },
        {
          name: 'Devices',
          data: this?.dashboardViewModel?.dashboardListViewModel?.devicesTableData?.list?.data,
        },
      ];
      return (
        <DashboardViewModelContextProvider viewModel={this.dashboardViewModel}>
          <ExportButton
            tableExport={tableDashboardExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={'dashboard'}
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
      return (
        <div className="aesirxui">
          <Dashboard {...this.props} />
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(DashboardContainer)));
