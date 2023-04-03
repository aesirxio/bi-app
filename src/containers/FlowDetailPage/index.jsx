import React, { Component } from 'react';

import { observer } from 'mobx-react';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { FlowViewModelContextProvider } from './FlowViewModels/FlowViewModelContextProvider';
import FlowStore from './FlowStore/FlowStore';
import FlowViewModel from './FlowViewModels/FlowViewModel';
import FlowDetailContainer from './FlowDetailContainer';
import BehaviorStore from 'containers/Behavior/BehaviorStore/BehaviorStore';

const FlowPage = observer(
  class FlowPage extends Component {
    flowStore = null;
    flowViewModel = null;
    behaviorStore = null;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.flowStore = new FlowStore({});
      this.behaviorStore = new BehaviorStore({});

      this.flowViewModel = new FlowViewModel(
        this.flowStore,
        this.behaviorStore,
        this.biListViewModel
      );
    }
    render() {
      // const { integration = false } = this.props;
      // const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <FlowViewModelContextProvider viewModel={this.flowViewModel}>
          <FlowDetailContainer {...this.props} />
        </FlowViewModelContextProvider>
      );
    }
  }
);

export default withBiViewModel(FlowPage);
