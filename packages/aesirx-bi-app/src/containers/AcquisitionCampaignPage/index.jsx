import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import AcquisitionCampaignStore from './AcquisitionCampaignStore/AcquisitionCampaignStore';
import { AcquisitionCampaignViewModelContextProvider } from './AcquisitionCampaignViewModels/AcquisitionCampaignViewModelContextProvider';
import AcquisitionCampaignViewModel from './AcquisitionCampaignViewModels/AcquisitionCampaignViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { history } from 'aesirx-uikit';
import { withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';
const AcquisitionCampaign = lazy(() => import('./AcquisitionCampaign'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <AcquisitionCampaign {...props} />;
  }
};

const AcquisitionCampaignPage = observer(
  class AcquisitionCampaignPage extends Component {
    acquisitionCampaignStore = null;
    acquisitionCampaignViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.acquisitionCampaignStore = new AcquisitionCampaignStore({});

      this.acquisitionCampaignViewModel = new AcquisitionCampaignViewModel(
        this.acquisitionCampaignStore,
        this.biListViewModel
      );
    }
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;

      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/acquisition/campaigns',
        exact: true,
        strict: false,
      });
      return (
        <AcquisitionCampaignViewModelContextProvider viewModel={this.acquisitionCampaignViewModel}>
          {(match?.isExact || integrationLink === 'acquisition-campaigns') && (
            <ExportButton
              data={
                this?.acquisitionCampaignViewModel?.acquisitionCampaignEvents?.data?.list?.toEventTableAcquisitionCampaign(
                  true
                )?.data
              }
              i18n={this.props.i18n}
              t={this.props.t}
              componentRef={this.componentRef}
              sectionName={'acquisition-campaigns'}
            />
          )}

          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </AcquisitionCampaignViewModelContextProvider>
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
              <Route exact path={['/acquisition/campaigns', '/bi/acquisition-campaigns']}>
                <AcquisitionCampaign />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(AcquisitionCampaignPage));
