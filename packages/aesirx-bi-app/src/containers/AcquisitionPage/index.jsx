/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { matchPath, withRouter } from 'react-router-dom';
import AcquisitionStore from './AcquisitionStore/AcquisitionStore';
import AcquisitionViewModel from './AcquisitionViewModels/AcquisitionViewModels';
import { AcquisitionViewModelContextProvider } from './AcquisitionViewModels/AcquisitionViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ExportButton from 'components/ExportButton';
import { history } from 'aesirx-uikit';

const AcquisitionPage = lazy(() => import('./Acquisition'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <AcquisitionPage {...props} />;
  }
};

const AcquisitionContainer = observer(
  class AcquisitionContainer extends Component {
    AcquisitionStore = null;
    AcquisitionViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.AcquisitionStore = new AcquisitionStore();
      this.AcquisitionViewModel = new AcquisitionViewModel(
        this.AcquisitionStore,
        this.biListViewModel
      );
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const matchAcquisition = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/acquisition',
        exact: true,
        strict: false,
      });
      const dataExport =
        matchAcquisition?.isExact ||
        this?.AcquisitionViewModel?.acquisitionListViewModel?.pagesTableData?.list?.data;

      return (
        <AcquisitionViewModelContextProvider viewModel={this.AcquisitionViewModel}>
          <ExportButton
            data={dataExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={matchAcquisition?.isExact || 'acquisition'}
          />
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </AcquisitionViewModelContextProvider>
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
              <Route exact path={['/acquisition', '/bi/acquisition']}>
                <AcquisitionPage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(AcquisitionContainer)));
