/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { matchPath, withRouter } from 'react-router-dom';
import VisitorsStore from './VisitorsStore/VisitorsStore';
import VisitorsViewModel from './VisitorsViewModels/VisitorsViewModels';
import { VisitorsViewModelContextProvider } from './VisitorsViewModels/VisitorsViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ExportButton from 'components/ExportButton';
import { history } from 'aesirx-uikit';

const VisitorsPage = lazy(() => import('./Visitors'));
const VisitorsBehaviorPage = lazy(() => import('./VisitorsBehavior'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'behavior':
      return <VisitorsBehaviorPage {...props} />;

    default:
      return <VisitorsPage {...props} />;
  }
};

const VisitorsContainer = observer(
  class VisitorsContainer extends Component {
    VisitorsStore = null;
    VisitorsViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.VisitorsStore = new VisitorsStore();
      this.VisitorsViewModel = new VisitorsViewModel(this.VisitorsStore, this.biListViewModel);
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const matchVisitor = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/visitors',
        exact: true,
        strict: false,
      });
      const matchBehavior = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/behavior',
        exact: true,
        strict: false,
      });
      const dataExport =
        matchBehavior?.isExact || integrationLink === 'behavior'
          ? this?.VisitorsViewModel?.visitorsListViewModel?.pagesTableData?.list?.data
          : null;
      const tableVisitorExport =
        matchVisitor?.isExact || integrationLink === 'visitors'
          ? [
              {
                name: 'Countries',
                data: this?.VisitorsViewModel?.visitorsListViewModel?.countriesTableData?.list
                  ?.data,
              },
              {
                name: 'Cities',
                data: this?.VisitorsViewModel?.visitorsListViewModel?.citiesTableData?.list?.data,
              },
              {
                name: 'Browsers',
                data: this?.VisitorsViewModel?.visitorsListViewModel?.browsersTableData?.list?.data,
              },
              {
                name: 'Devices',
                data: this?.VisitorsViewModel?.visitorsListViewModel?.devicesTableData?.list?.data,
              },
              {
                name: 'Languages',
                data: this?.VisitorsViewModel?.visitorsListViewModel?.languagesTableData?.list
                  ?.data,
              },
            ]
          : [];
      return (
        <VisitorsViewModelContextProvider viewModel={this.VisitorsViewModel}>
          <ExportButton
            data={dataExport}
            tableExport={tableVisitorExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
          />

          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </VisitorsViewModelContextProvider>
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
              <Route exact path={['/visitors', '/bi/visitors']}>
                <VisitorsPage {...this.props} />
              </Route>
              <Route exact path={['/behavior', '/bi/behavior']}>
                <VisitorsBehaviorPage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(VisitorsContainer)));
