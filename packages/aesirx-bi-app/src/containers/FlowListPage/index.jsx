import React, { Component, lazy } from 'react';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import FlowListStore from './FlowListStore/FlowListStore';
import FlowListViewModel from './FlowListViewModels/FlowViewModel';
import { FlowListViewModelContextProvider } from './FlowListViewModels/FlowListViewModelContextProvider';
import { history } from 'aesirx-uikit';
import ExportButton from 'components/ExportButton';

const FlowList = lazy(() => import('./FlowList'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'flow-list':
      return <FlowList {...props} />;
  }
};

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
        console.log('hehe');
        history.push(`${this.biListViewModel.activeDomain[0]}`);
      }
    };
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <FlowListViewModelContextProvider viewModel={this.flowListViewModel}>
          <ExportButton
            data={this?.flowListViewModel?.flowListListViewModel?.countriesTableData?.list?.data}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={'location'}
          />
          <ComponentToPrint
            ref={(el) => (this.componentRef = el)}
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
          />
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
          {this.props.integration ? (
            <RenderComponent
              link={this.props.integrationLink}
              activeDomain={this.props.activeDomain}
              {...this.props}
            />
          ) : (
            <>
              <Route exact path={['/flow-list', '/bi/flow-list']}>
                <FlowList {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(FlowListContainer)));
