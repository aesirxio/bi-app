import React, { Component, lazy } from 'react';
import { withRouter } from 'react-router-dom';
import EventsDetailStore from './EventsDetailStore/EventsDetailStore';
import { EventsDetailViewModelContextProvider } from './EventsDetailViewModels/EventsDetailViewModelContextProvider';
import EventsViewModel from './EventsDetailViewModels/EventsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const Events = lazy(() => import('./EventsDetail'));

const EventsDetailPage = observer(
  class EventsDetailPage extends Component {
    EventsDetailStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.EventsDetailStore = new EventsDetailStore({});

      this.behaviorViewModel = new EventsViewModel(this.EventsDetailStore, this.biListViewModel);
    }
    render() {
      return (
        <EventsDetailViewModelContextProvider viewModel={this.behaviorViewModel}>
          <Events {...this.props} />
        </EventsDetailViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(withRouter(EventsDetailPage)));
