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
          <Country {...this.props} />
        </CountryViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(CountryContainer)));
