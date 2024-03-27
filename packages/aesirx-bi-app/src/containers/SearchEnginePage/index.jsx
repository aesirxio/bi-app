/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component, lazy } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { matchPath, withRouter } from 'react-router-dom';
import SearchEngineStore from './SearchEngineStore/SearchEngineStore';
import SearchEngineViewModel from './SearchEngineViewModels/SearchEngineViewModels';
import { SearchEngineViewModelContextProvider } from './SearchEngineViewModels/SearchEngineViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Route } from 'react-router-dom';
import ExportButton from 'components/ExportButton';
import { history } from 'aesirx-uikit';

const SearchEnginePage = lazy(() => import('./SearchEngine'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <SearchEnginePage {...props} />;
  }
};

const SearchEngineContainer = observer(
  class SearchEngineContainer extends Component {
    SearchEngineStore = null;
    SearchEngineViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.SearchEngineStore = new SearchEngineStore();
      this.SearchEngineViewModel = new SearchEngineViewModel(
        this.SearchEngineStore,
        this.biListViewModel
      );
    }

    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const matchSearchEngine = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/acquisition/search-engines',
        exact: true,
        strict: false,
      });
      const dataExport =
        matchSearchEngine?.isExact ||
        this?.SearchEngineViewModel?.searchEngineListViewModel?.pagesTableData?.list?.data;

      return (
        <SearchEngineViewModelContextProvider viewModel={this.SearchEngineViewModel}>
          <ExportButton
            data={dataExport}
            i18n={this.props.i18n}
            t={this.props.t}
            componentRef={this.componentRef}
            sectionName={matchSearchEngine?.isExact || 'search-engines'}
          />
          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </SearchEngineViewModelContextProvider>
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
              <Route exact path={['/acquisition/search-engines', '/bi/acquisition-search-engines']}>
                <SearchEnginePage {...this.props} />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(SearchEngineContainer)));
