import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Country from './Country';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import CountryStore from './CountryStore/CountryStore';
import CountryViewModel from './CountryViewModels/CountryViewModel';
import { CountryViewModelContextProvider } from './CountryViewModels/CountryViewModelContextProvider';
import { history } from 'aesirx-uikit';
import ReactToPrint from 'react-to-print';

const CountryContainer = observer(
  class CountryContainer extends Component {
    countryStore = null;
    countryViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.countryStore = new CountryStore();
      this.countryViewModel = new CountryViewModel(this.countryStore, this.biListViewModel);
    }

    componentDidMount = () => {
      if (!this.props.integration && history.location.pathname === '/') {
        history.push(`${this.biListViewModel.activeDomain}`);
      }
    };
    render() {
      return (
        <CountryViewModelContextProvider viewModel={this.countryViewModel}>
          <ReactToPrint
            trigger={() => {
              return (
                <a
                  className={`btn btn-success me-2 text-nowrap fw-semibold py-16 lh-sm printButton ${this.props?.i18n?.language}`}
                  href="#"
                >
                  {this.props.t('txt_export_pdf')}
                </a>
              );
            }}
            content={() => this.componentRef}
          />
          <ComponentToPrint ref={(el) => (this.componentRef = el)} />
        </CountryViewModelContextProvider>
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
      return <Country {...this.props} />;
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(CountryContainer)));
