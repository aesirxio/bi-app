/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import PageDetailStore from './PageDetailStore/PageDetailStore';
import PageDetailViewModel from './PageDetailViewModels/PageDetailModel';
import { PageDetailViewModelContextProvider } from './PageDetailViewModels/PageDetailViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import PageDetail from './PageDetail';

import 'flag-icons/sass/flag-icons.scss';

const PageDetailContainer = observer(
  class PageDetailContainer extends Component {
    pageDetailStore = null;
    pageDetailViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.pageDetailStore = new PageDetailStore();
      this.pageDetailViewModel = new PageDetailViewModel(
        this.pageDetailStore,
        this.biListViewModel
      );
    }

    render() {
      return (
        <PageDetailViewModelContextProvider viewModel={this.pageDetailViewModel}>
          <PageDetail {...this.props} />
        </PageDetailViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(PageDetailContainer)));
