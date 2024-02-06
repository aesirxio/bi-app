import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConsentsStore from './ConsentsStore/ConsentsStore';
import { ConsentsViewModelContextProvider } from './ConsentsViewModels/ConsentsViewModelContextProvider';
import ConsentsViewModel from './ConsentsViewModels/ConsentsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';

const Consents = lazy(() => import('./Consents'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'consents':
      return <Consents {...props} />;

    default:
      return <Consents {...props} />;
  }
};

const ConsentsPage = observer(
  class ConsentsPage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new ConsentsStore({});

      this.behaviorViewModel = new ConsentsViewModel(this.consentsStore, this.biListViewModel);
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <ConsentsViewModelContextProvider viewModel={this.behaviorViewModel}>
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
        </ConsentsViewModelContextProvider>
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
              <Route exact path={['/consents', '/bi/consents']}>
                <Consents />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(ConsentsPage)));
