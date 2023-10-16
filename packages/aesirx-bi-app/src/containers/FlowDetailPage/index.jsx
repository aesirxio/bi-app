import React, { Component } from 'react';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { FlowViewModelContextProvider } from './FlowViewModels/FlowViewModelContextProvider';
import FlowStore from './FlowStore/FlowStore';
import FlowViewModel from './FlowViewModels/FlowViewModel';
import FlowDetailContainer from './FlowDetailContainer';
import EventsStore from '../EventsPage/EventsStore/EventsStore';

const FlowPage = observer(
  class FlowPage extends Component {
    flowStore = null;
    flowViewModel = null;
    eventsStore = null;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.flowStore = new FlowStore({});
      this.eventsStore = new EventsStore({});

      this.flowViewModel = new FlowViewModel(
        this.flowStore,
        this.eventsStore,
        this.biListViewModel
      );
    }
    render() {
      return (
        <FlowViewModelContextProvider viewModel={this.flowViewModel}>
          <FlowDetailContainer {...this.props} />
        </FlowViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(FlowPage);
