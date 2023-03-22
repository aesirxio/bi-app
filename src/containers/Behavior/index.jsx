import React, { Component, lazy } from 'react';
import { Route } from 'react-router-dom';
import BehaviorStore from './BehaviorStore/BehaviorStore';
import { BehaviorViewModelContextProvider } from './BehaviorViewModels/BehaviorViewModelContextProvider';
import BehaviorViewModel from './BehaviorViewModels/BehaviorViewModel';
import UTMTracking from './UTMTracking';
import Events from './Events';
import { observer } from 'mobx-react';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
// const Events = lazy(() => import('./Events'));
const Overview = lazy(() => import('./Overview'));
// const UTMTracking = lazy(() => import('./UTMTracking'));
const ClickAnchor = lazy(() => import('./ClickAnchor'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'behavior-utm-tracking':
      return <UTMTracking {...props} />;

    case 'behavior-events':
      return <Events {...props} />;

    default:
      return <UTMTracking {...props} />;
  }
};

const Behavior = observer(
  class Behavior extends Component {
    behaviorStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.behaviorStore = new BehaviorStore({});

      this.behaviorViewModel = new BehaviorViewModel(this.behaviorStore, this.biListViewModel);
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink } = this.biListViewModel;
      return (
        <BehaviorViewModelContextProvider viewModel={this.behaviorViewModel}>
          {integration ? (
            <RenderComponent link={integrationLink} {...this.props} />
          ) : (
            <>
              <Route exact path={['/:domain/behavior/overview']}>
                <Overview />
              </Route>
              <Route exact path={['/:domain/behavior/click-anchor']}>
                <ClickAnchor />
              </Route>
              <Route exact path={['/:domain/behavior/utm-tracking']}>
                <UTMTracking />
              </Route>
              <Route exact path={['/:domain/behavior/events']}>
                <Events />
              </Route>
            </>
          )}
        </BehaviorViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(Behavior);
