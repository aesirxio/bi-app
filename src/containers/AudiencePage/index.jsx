/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import AudienceStore from 'containers/AudiencePage/AudienceStore/AudienceStore';
import AudienceViewModel from 'containers/AudiencePage/AudienceViewModels/AudienceViewModel';
import { AudienceViewModelContextProvider } from 'containers/AudiencePage/AudienceViewModels/AudienceViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';

const AudiencePage = lazy(() => import('./Audience'));
const AudienceBehaviorPage = lazy(() => import('./AudienceBehavior'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'audience-behavior':
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
          {integration ? (
            <RenderComponent link={integrationLink} activeDomain={activeDomain} {...this.props} />
          ) : (
            <>
              <Route exact path={['/:domain/audience/overview']}>
                <AudiencePage {...this.props} />
              </Route>
              <Route exact path={['/:domain/audience/behavior']}>
                <AudienceBehaviorPage {...this.props} />
              </Route>
            </>
          )}
        </AudienceViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(AudienceContainer)));
