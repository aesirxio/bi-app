import React, { Component, lazy } from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConsentsTemplateStore from './ConsentsTemplateStore/ConsentsTemplateStore';
import { ConsentsTemplateViewModelContextProvider } from './ConsentsTemplateViewModels/ConsentsTemplateViewModelContextProvider';
import ConsentsTemplateViewModel from './ConsentsTemplateViewModels/ConsentsTemplateViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { withTranslation } from 'react-i18next';

const ConsentsTemplate = lazy(() => import('./ConsentsTemplate'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'consents-template':
      return <ConsentsTemplate {...props} />;

    default:
      return <ConsentsTemplate {...props} />;
  }
};

const ConsentsTemplatePage = observer(
  class ConsentsTemplatePage extends Component {
    consentsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.consentsStore = new ConsentsTemplateStore({});

      this.behaviorViewModel = new ConsentsTemplateViewModel(
        this.consentsStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      return (
        <ConsentsTemplateViewModelContextProvider viewModel={this.behaviorViewModel}>
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </ConsentsTemplateViewModelContextProvider>
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
              <Route exact path={['/consents/template', '/bi/consents-templates']}>
                <ConsentsTemplate />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(ConsentsTemplatePage)));
