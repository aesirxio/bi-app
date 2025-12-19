import React, { Component, lazy } from 'react';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
import { Route, withRouter } from 'react-router-dom';
import RealTimeStore from './RealTimeStore/RealTimeStore';
import RealTimeViewModel from './RealTimeViewModels/RealTimeViewModel';
import { RealTimeViewModelContextProvider } from './RealTimeViewModels/RealTimeViewModelContextProvider';
import { history } from 'aesirx-uikit';
import ExportButton from 'components/ExportButton';

const RealTime = lazy(() => import('./RealTime'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'visitors-realtime':
      return <RealTime {...props} />;
  }
};

const RealTimeContainer = observer(
  class RealTimeContainer extends Component {
    realTimeStore = null;
    realTimeViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.realTimeStore = new RealTimeStore();
      this.realTimeViewModel = new RealTimeViewModel(this.realTimeStore, this.biListViewModel);
    }

    componentDidMount = () => {
      if (!this.props.integration && history.location.pathname === '/') {
        history.push(`${this.biListViewModel.activeDomain[0]}`);
      }
    };
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <RealTimeViewModelContextProvider viewModel={this.realTimeViewModel}>
          <ExportButton
            data={this?.realTimeViewModel?.realTimeListViewModel?.realtimeTableData?.list?.data}
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
        </RealTimeViewModelContextProvider>
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
              <Route exact path={['/visitors/realtime', '/bi/visitors/realtime']}>
                <RealTime {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(RealTimeContainer)));
