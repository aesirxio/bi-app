import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import ConsentsStore from './ConsentsStore/ConsentsStore';
import { ConsentsViewModelContextProvider } from './ConsentsViewModels/ConsentsViewModelContextProvider';
import ConsentsViewModel from './ConsentsViewModels/ConsentsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import ReactToPrint from 'react-to-print';
import { history } from 'aesirx-uikit';
import { Translation } from 'react-i18next';

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
      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/consents',
        exact: true,
        strict: false,
      });
      return (
        <ConsentsViewModelContextProvider viewModel={this.behaviorViewModel}>
          {(match?.isExact ||
            integrationLink === 'consents' ||
            integrationLink === 'consents-date' ||
            integrationLink === 'consents-tier') && (
            <ReactToPrint
              trigger={() => {
                return (
                  <Translation>
                    {(t, { i18n }) => (
                      <a
                        className={`btn btn-light me-2 text-nowrap py-13 lh-sm rounded-1 printButton ${i18n?.language}`}
                        href="#"
                      >
                        {t('txt_export')}
                      </a>
                    )}
                  </Translation>
                );
              }}
              content={() => this.componentRef}
            />
          )}

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

export default withBiViewModel(ConsentsPage);
