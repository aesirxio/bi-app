import React, { Component, lazy } from 'react';
import { Route } from 'react-router-dom';
import EventsStore from './EventsStore/EventsStore';
import { EventsViewModelContextProvider } from './EventsViewModels/EventsViewModelContextProvider';
import EventsViewModel from './EventsViewModels/EventsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const Events = lazy(() => import('./Events'));
const Generator = lazy(() => import('./Generator'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'events':
      return <Events {...props} />;
    case 'events-generator':
      return <Generator {...props} />;

    default:
      return <Events {...props} />;
  }
};

const EventsPage = observer(
  class EventsPage extends Component {
    eventsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.eventsStore = new EventsStore({});

      this.behaviorViewModel = new EventsViewModel(this.eventsStore, this.biListViewModel);
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <EventsViewModelContextProvider viewModel={this.behaviorViewModel}>
          {integration ? (
            <RenderComponent link={integrationLink} activeDomain={activeDomain} {...this.props} />
          ) : (
            <>
              <Route exact path={['/:domain/events']}>
                <Events />
              </Route>
              <Route exact path={['/:domain/events/generator']}>
                <Generator />
              </Route>
            </>
          )}
        </EventsViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(EventsPage);
