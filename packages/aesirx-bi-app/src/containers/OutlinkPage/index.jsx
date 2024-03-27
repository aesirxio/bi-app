/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { matchPath, withRouter } from 'react-router-dom';
import OutlinkStore from './OutlinkStore/OutlinkStore';
import OutlinkViewModel from './OutlinkViewModels/OutlinkViewModels';
import { OutlinkViewModelContextProvider } from './OutlinkViewModels/OutlinkViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ExportButton from 'components/ExportButton';
import { history } from 'aesirx-uikit';

const OutlinkPage = lazy(() => import('./Outlink'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <OutlinkPage {...props} />;
  }
};

const OutlinkContainer = observer(
  class OutlinkContainer extends Component {
    OutlinkStore = null;
    OutlinkViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.OutlinkStore = new OutlinkStore();
      this.OutlinkViewModel = new OutlinkViewModel(this.OutlinkStore, this.biListViewModel);
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const matchOutlink = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/behavior/outlinks',
        exact: true,
        strict: false,
      });
      const dataExport =
        matchOutlink?.isExact ||
        this?.OutlinkViewModel?.outlinkListViewModel?.pagesTableData?.list?.data;

      return (
        <OutlinkViewModelContextProvider viewModel={this.OutlinkViewModel}>
          {/* <ExportButton
            data={dataExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={matchOutlink?.isExact || 'behavior-outlinks'}
          /> */}
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </OutlinkViewModelContextProvider>
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
              <Route exact path={['/behavior/outlinks', '/bi/behavior-outlinks']}>
                <OutlinkPage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(OutlinkContainer)));
