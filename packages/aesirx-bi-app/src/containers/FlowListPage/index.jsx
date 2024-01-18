import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import FlowList from './FlowList';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import FlowListStore from './FlowListStore/FlowListStore';
import FlowListViewModel from './FlowListViewModels/FlowViewModel';
import { FlowListViewModelContextProvider } from './FlowListViewModels/FlowListViewModelContextProvider';
import { history } from 'aesirx-uikit';
import ExportButton from 'components/ExportButton';

const FlowListContainer = observer(
  class FlowListContainer extends Component {
    flowListStore = null;
    flowListViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.flowListStore = new FlowListStore();
      this.flowListViewModel = new FlowListViewModel(this.flowListStore, this.biListViewModel);
    }

    componentDidMount = () => {
      if (!this.props.integration && history.location.pathname === '/') {
        history.push(`${this.biListViewModel.activeDomain}`);
      }
    };
    render() {
      return (
        <FlowListViewModelContextProvider viewModel={this.flowListViewModel}>
          <ExportButton
            data={this?.flowListViewModel?.flowListListViewModel?.countriesTableData?.list?.data}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={'location'}
          />
          <ComponentToPrint ref={(el) => (this.componentRef = el)} />
        </FlowListViewModelContextProvider>
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
          <FlowList {...this.props} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(FlowListContainer)));
