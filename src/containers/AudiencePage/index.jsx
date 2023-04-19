/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import AudienceStore from 'containers/AudiencePage/AudienceStore/AudienceStore';
import AudienceViewModel from 'containers/AudiencePage/AudienceViewModels/AudienceViewModel';
import { AudienceViewModelContextProvider } from 'containers/AudiencePage/AudienceViewModels/AudienceViewModelContextProvider';
import AudiencePage from './Audience';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const AudienceContainer = observer(
  class AudienceContainer extends Component {
    audienceStore = null;
    audienceViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.audienceStore = new AudienceStore();
      this.audienceViewModel = new AudienceViewModel(this.audienceStore, this.biListViewModel);
    }

    render() {
      return (
        <AudienceViewModelContextProvider viewModel={this.audienceViewModel}>
          <AudiencePage {...this.props} />
        </AudienceViewModelContextProvider>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(AudienceContainer)));
