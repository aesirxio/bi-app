/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import AcquisitionDetailStore from './AcquisitionDetailStore/AcquisitionDetailStore';
import AcquisitionDetailViewModel from './AcquisitionDetailViewModels/AcquisitionDetailModel';
import { AcquisitionDetailViewModelContextProvider } from './AcquisitionDetailViewModels/AcquisitionDetailViewModelContextProvider';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import AcquisitionDetail from './AcquisitionDetail';

import 'flag-icons/sass/flag-icons.scss';

const AcquisitionDetailContainer = observer(
  class AcquisitionDetailContainer extends Component {
    acquisitionDetailStore = null;
    acquisitionDetailViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.acquisitionDetailStore = new AcquisitionDetailStore();
      this.acquisitionDetailViewModel = new AcquisitionDetailViewModel(
        this.acquisitionDetailStore,
        this.biListViewModel
      );
    }

    render() {
      return (
        <AcquisitionDetailViewModelContextProvider viewModel={this.acquisitionDetailViewModel}>
          <AcquisitionDetail {...this.props} />
        </AcquisitionDetailViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(AcquisitionDetailContainer)));
