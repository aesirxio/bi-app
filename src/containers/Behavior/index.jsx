import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import BehaviorStore from './BehaviorStore/BehaviorStore';
import { BehaviorViewModelContextProvider } from './BehaviorViewModels/BehaviorViewModelContextProvider';
import BehaviorViewModel from './BehaviorViewModels/BehaviorViewModel';
import VisitorStore from 'store/VisitorStore/VisitorStore';
const Events = lazy(() => import('./Events'));
const Overview = lazy(() => import('./Overview'));
const UTMTracking = lazy(() => import('./UTMTracking'));
const ClickAnchor = lazy(() => import('./ClickAnchor'));

const behaviorStore = new BehaviorStore({});
const visitorStore = new VisitorStore({});

const behaviorViewModel = new BehaviorViewModel(behaviorStore, visitorStore);

const Behavior = () => {
  return (
    <BehaviorViewModelContextProvider viewModel={behaviorViewModel}>
      <Route exact path={['/data-:domain/behavior/overview']}>
        <Overview />
      </Route>
      <Route exact path={['/data-:domain/behavior/click-anchor']}>
        <ClickAnchor />
      </Route>
      <Route exact path={['/data-:domain/behavior/utm-tracking']}>
        <UTMTracking />
      </Route>
      <Route exact path={['/data-:domain/behavior/events']}>
        <Events />
      </Route>
    </BehaviorViewModelContextProvider>
  );
};

export default Behavior;
