/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy, Suspense } from 'react';

import { BiStoreProvider, useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { BiViewModel } from '../../store/BiStore/BiViewModel';
import 'scss/app.scss';

import { observer } from 'mobx-react';
import { Spinner, LoginPage } from 'aesirx-uikit';
import { AppProvider } from 'aesirx-uikit';
import { authRoutes, mainRoutes } from '../../routes/routes';
import { DataStream } from '../../components/DataStream';
import { appLanguages } from '../../translations';
import SbarLeftIntegration from './SbarLeftIntegration';
import { Storage } from 'aesirx-lib';

const DashboardPage = lazy(() => import('../../containers/Dashboard'));
const UTMTrackingPage = lazy(() => import('../../containers/UTMTrackingPage'));
const EventsPage = lazy(() => import('../../containers/EventsPage'));
const VisitorsPage = lazy(() => import('../../containers/VisitorsPage'));
const FlowPage = lazy(() => import('../../containers/FlowDetailPage'));
const RegionCountryPage = lazy(() => import('../../containers/RegionCountryPage'));
const WoocommercePage = lazy(() => import('../../containers/WoocommercePage'));

const biViewModel = new BiViewModel();

const MainLayoutIntegration = (props) => {
  const isAuthenticated = Storage.getItem('auth');

  return (
    <BiStoreProvider viewModel={biViewModel}>
      <AppProvider
        appLanguages={appLanguages}
        authRoutes={authRoutes}
        mainRoutes={mainRoutes}
        isLogin={() => true}
        componentHeader={<DataStream />}
        integration={true}
        leftMenu={<SbarLeftIntegration />}
        rootId="#biapp"
        noavatar={true}
      >
        <div className="bi-intergration_layout">
          {!isAuthenticated && window.env.STORAGE === 'external' ? (
            <LoginPage text="BI" />
          ) : (
            <App {...props} integration={true} />
          )}
        </div>
      </AppProvider>
    </BiStoreProvider>
  );
};

String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
};

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'visitors':
      return <VisitorsPage {...props} />;

    case 'visitors-locations':
      return <RegionCountryPage {...props} />;

    case 'visitors-behavior':
      return <VisitorsPage {...props} />;

    case 'behavior':
      return <VisitorsPage {...props} />;

    case 'behavior-events':
      return <EventsPage {...props} />;

    case 'behavior-events-generator':
      return <EventsPage {...props} />;

    case 'utm-tracking':
      return <UTMTrackingPage {...props} />;

    case 'utm-tracking-generator':
      return <UTMTrackingPage {...props} />;

    case 'woocommerce':
      return <WoocommercePage {...props} />;

    case link.startsWith('flow') ? link : '':
      return <FlowPage {...props} />;
    default:
      return <DashboardPage {...props} />;
  }
};
const App = observer((props) => {
  const {
    biListViewModel: { integrationLink, activeDomain },
  } = useBiViewModel();

  return (
    <Suspense fallback={<Spinner />}>
      <RenderComponent link={integrationLink} activeDomain={activeDomain} {...props} />
    </Suspense>
  );
});

export default MainLayoutIntegration;
