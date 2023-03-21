import React, { Component, lazy } from 'react';
import { Route } from 'react-router-dom';
import BehaviorStore from './BehaviorStore/BehaviorStore';
import { BehaviorViewModelContextProvider } from './BehaviorViewModels/BehaviorViewModelContextProvider';
import BehaviorViewModel from './BehaviorViewModels/BehaviorViewModel';
import { observer } from 'mobx-react';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
const Events = lazy(() => import('./Events'));
const Overview = lazy(() => import('./Overview'));
const UTMTracking = lazy(() => import('./UTMTracking'));
const ClickAnchor = lazy(() => import('./ClickAnchor'));

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
      return (
        <BehaviorViewModelContextProvider viewModel={this.behaviorViewModel}>
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
        </BehaviorViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(Behavior);
