import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import WoocommerceStore from './WoocommerceStore/WoocommerceStore';
import { WoocommerceViewModelContextProvider } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import WoocommerceViewModel from './WoocommerceViewModels/WoocommerceViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import ReactToPrint from 'react-to-print';
import { history } from 'aesirx-uikit';
import { Translation, withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';

const Woocommerce = lazy(() => import('./Woocommerce'));
const WoocommerceProduct = lazy(() => import('./WoocommerceProduct'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'woocommerce':
      return <Woocommerce {...props} />;
    case 'woocommerce-product':
      return <WoocommerceProduct {...props} />;

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
      const tableWoocommerceExport = [
        {
          name: 'Top Search',
          data: this?.behaviorViewModel?.woocommerceList?.productSearchTableData?.list?.data,
        },
        {
          name: 'Add to cart',
          data: this?.behaviorViewModel?.woocommerceList?.productCartTableData?.list?.data,
        },
        {
          name: 'Top Products',
          data: this?.behaviorViewModel?.woocommerceList?.productTableTopData?.list?.data,
        },
        {
          name: 'Top View',
          data: this?.behaviorViewModel?.woocommerceList?.productViewTableData?.list?.data,
        },
      ];
      console.log('this?.behaviorViewModel', this?.behaviorViewModel);
      return (
        <WoocommerceViewModelContextProvider viewModel={this.behaviorViewModel}>
          {(match?.isExact ||
            integrationLink === 'woocommerce' ||
            integrationLink === 'woocommerce-product') && (
            <ExportButton
              tableExport={tableWoocommerceExport}
              i18n={this.props.i18n}
              t={this.props.t}
              componentRef={this.componentRef}
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
              <Route exact path={['/woocommerce/product', '/bi/woocommerce/product']}>
                <WoocommerceProduct />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(WoocommercePage));
