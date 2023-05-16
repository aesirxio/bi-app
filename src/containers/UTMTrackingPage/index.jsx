import React, { Component, lazy } from 'react';
import { Route } from 'react-router-dom';
import UTMTrackingStore from './UTMTrackingStore/UTMTrackingStore';
import { UTMTrackingViewModelContextProvider } from './UTMTrackingViewModels/UTMTrackingViewModelContextProvider';
import UTMTrackingViewModel from './UTMTrackingViewModels/UTMTrackingViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const UTMTracking = lazy(() => import('./UTMTracking'));
const Generator = lazy(() => import('./Generator'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'utm-tracking':
      return <UTMTracking {...props} />;
    case 'utm-tracking-generator':
      return <Generator {...props} />;

    default:
      return <UTMTracking {...props} />;
  }
};

const UTMTrackingPage = observer(
  class UTMTrackingPage extends Component {
    utmTrackingStore = null;
    utmTrackingViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.utmTrackingStore = new UTMTrackingStore({});

      this.utmTrackingViewModel = new UTMTrackingViewModel(
        this.utmTrackingStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <UTMTrackingViewModelContextProvider viewModel={this.utmTrackingViewModel}>
          {integration ? (
            <RenderComponent link={integrationLink} activeDomain={activeDomain} {...this.props} />
          ) : (
            <>
              <Route exact path={['/:domain/utm-tracking']}>
                <UTMTracking />
              </Route>
              <Route exact path={['/:domain/utm-tracking/generator']}>
                <Generator />
              </Route>
            </>
          )}
        </UTMTrackingViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(UTMTrackingPage);
