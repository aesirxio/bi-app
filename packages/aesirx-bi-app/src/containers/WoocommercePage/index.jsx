import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import WoocommerceStore from './WoocommerceStore/WoocommerceStore';
import { WoocommerceViewModelContextProvider } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import WoocommerceViewModel from './WoocommerceViewModels/WoocommerceViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import ReactToPrint from 'react-to-print';
import { history } from 'aesirx-uikit';
import { Translation } from 'react-i18next';

const Woocommerce = lazy(() => import('./Woocommerce'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'woocommerce':
      return <Woocommerce {...props} />;

    default:
      return <Woocommerce {...props} />;
  }
};

const WoocommercePage = observer(
  class WoocommercePage extends Component {
    woocommerceStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.woocommerceStore = new WoocommerceStore({});

      this.behaviorViewModel = new WoocommerceViewModel(
        this.woocommerceStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/woocommerce',
        exact: true,
        strict: false,
      });
      return (
        <WoocommerceViewModelContextProvider viewModel={this.behaviorViewModel}>
          {(match?.isExact || integrationLink === 'woocommerce') && (
            <ReactToPrint
              trigger={() => {
                return (
                  <Translation>
                    {(t, { i18n }) => (
                      <a
                        className={`btn btn-success me-2 text-nowrap fw-semibold py-16 lh-sm printButton ${i18n?.language}`}
                        href="#"
                      >
                        {t('txt_export_pdf')}
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
        </WoocommerceViewModelContextProvider>
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
              <Route exact path={['/woocommerce', '/bi/woocommerce']}>
                <Woocommerce />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withBiViewModel(WoocommercePage);
