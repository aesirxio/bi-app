/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditTagEvent from './TagEventEdit';
import { TagEventViewModelContextProvider } from './TagEventViewModel/TagEventViewModelContextProvider';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { PAGE_STATUS } from 'aesirx-uikit';
import { TagEventStore } from './store';
import TagEventViewModel from './TagEventViewModel/TagEventViewModel';

const EditTagEventProvider = observer(
  class EditTagEventProvider extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
      this.tagEventStore = new TagEventStore();
      this.tagEventViewModel = new TagEventViewModel(this.tagEventStore, this.biListViewModel);
    }
    render() {
      const { integration = false } = this.props;
      const { dataStream, dataStreamStatus, activeDomain, integrationLink, setIntegrationLink } =
        this.biListViewModel;
      return (
        <TagEventViewModelContextProvider>
          {dataStreamStatus === PAGE_STATUS.READY ? (
            <>
              {dataStream?.is_user_admin || integration ? (
                <EditTagEvent
                  key={integrationLink}
                  activeDomain={activeDomain}
                  isLink={this.props?.isLink}
                  integrationLink={integrationLink}
                  integration={integration}
                  setIntegrationLink={setIntegrationLink}
                />
              ) : (
                <p className="p-3 fw-semibold">Current user does not have access!</p>
              )}
            </>
          ) : (
            <></>
          )}
        </TagEventViewModelContextProvider>
      );
    }
  }
);
export default withTranslation()(withRouter(withBiViewModel(EditTagEventProvider)));
