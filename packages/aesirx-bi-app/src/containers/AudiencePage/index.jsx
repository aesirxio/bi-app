/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import AudienceStore from './AudienceStore/AudienceStore';
import AudienceViewModel from './AudienceViewModels/AudienceViewModel';
import { AudienceViewModelContextProvider } from './AudienceViewModels/AudienceViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

const AudiencePage = lazy(() => import('./Audience'));
const AudienceBehaviorPage = lazy(() => import('./AudienceBehavior'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'behavior':
      return <AudienceBehaviorPage {...props} />;
    default:
      return <AudiencePage {...props} />;
  }
};

const AudienceContainer = observer(
  class AudienceContainer extends Component {
    audienceStore = null;
    audienceViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.audienceStore = new AudienceStore();
      this.audienceViewModel = new AudienceViewModel(this.audienceStore, this.biListViewModel);
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <AudienceViewModelContextProvider viewModel={this.audienceViewModel}>
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
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </AudienceViewModelContextProvider>
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
              <Route exact path={['/audience', '/bi/audience']}>
                <AudiencePage {...this.props} />
              </Route>
              <Route exact path={['/behavior', '/bi/behavior']}>
                <AudienceBehaviorPage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(AudienceContainer)));
