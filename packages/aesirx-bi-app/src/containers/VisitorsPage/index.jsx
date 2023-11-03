/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import VisitorsStore from './VisitorsStore/VisitorsStore';
import VisitorsViewModel from './VisitorsViewModels/VisitorsViewModels';
import { VisitorsViewModelContextProvider } from './VisitorsViewModels/VisitorsViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

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
      return (
        <VisitorsViewModelContextProvider viewModel={this.VisitorsViewModel}>
          <ReactToPrint
            trigger={() => {
              return (
                <a
                  className={`btn btn-light me-2 text-nowrap py-13 lh-sm rounded-1 printButton ${this.props?.i18n?.language}`}
                  href="#"
                >
                  {this.props.t('txt_export')}
                </a>
              );
            }}
            content={() => this.componentRef}
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
