import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConsentsAdvanceStore from './ConsentsAdvanceStore/ConsentsAdvanceStore';
import { ConsentsAdvanceViewModelContextProvider } from './ConsentsAdvanceViewModels/ConsentsAdvanceViewModelContextProvider';
import ConsentsAdvanceViewModel from './ConsentsAdvanceViewModels/ConsentsAdvanceViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';

const ConsentsAdvance = lazy(() => import('./ConsentsAdvance'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'consents-advance':
      return <ConsentsAdvance {...props} />;

    default:
      return <ConsentsAdvance {...props} />;
  }
};

const ConsentsAdvancePage = observer(
  class ConsentsAdvancePage extends Component {
    consentsAdvanceStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsAdvanceStore = new ConsentsAdvanceStore({});

      this.behaviorViewModel = new ConsentsAdvanceViewModel(
        this.consentsAdvanceStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <ConsentsAdvanceViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ExportButton
            data={this?.behaviorViewModel?.consentsList?.consentsListData?.list?.data}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={'consent'}
          />

          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </ConsentsAdvanceViewModelContextProvider>
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
              <Route exact path={['/consents/advance', '/bi/consents-advance']}>
                <ConsentsAdvance />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(ConsentsAdvancePage)));
