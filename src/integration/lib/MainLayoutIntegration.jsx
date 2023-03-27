/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy, Suspense } from 'react';

import { ThemesContextProvider, useThemeContext } from 'themes/ThemeContextProvider';
import ErrorBoundary from 'layouts/ErrorBoundary';
import { I18nextProvider } from 'react-i18next';
import i18n from 'translations/i18n';
import { BiStoreProvider, useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import BiStore from 'store/BiStore/BiStore';
import BiViewModel from 'store/BiStore/BiViewModel';
import { Toast } from 'components/Toast';
import { BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import Spinner from 'components/Spinner';

const DashboardPage = lazy(() => import('containers/Dashboard'));
const Behavior = lazy(() => import('containers/Behavior'));
const AudiencePage = lazy(() => import('containers/AudiencePage'));
const SbarLeft = lazy(() => import('./SbarLeftIntegration'));
const Header = lazy(() => import('components/Header'));

const biStore = new BiStore();
const biViewModel = new BiViewModel(biStore);

const MainLayoutIntegration = (props) => {
  return (
    <ThemesContextProvider>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            <Toast />
            <BiStoreProvider viewModel={biViewModel}>
              <div className="bi-intergration_layout">
                <App {...props} integration={true} />
              </div>
            </BiStoreProvider>
          </BrowserRouter>
        </I18nextProvider>
      </ErrorBoundary>
    </ThemesContextProvider>
  );
};

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'dashboard':
      return <DashboardPage {...props} />;

    case 'audience-overview':
      return <AudiencePage {...props} />;

    case 'behavior-utm-tracking':
      return <Behavior {...props} />;

    case 'behavior-events':
      return <Behavior {...props} />;

    default:
      return <DashboardPage {...props} />;
  }
};
const App = observer((props) => {
  const {
    biListViewModel: { integrationLink, activeDomain },
  } = useBiViewModel();

  const { theme } = useThemeContext();

  return (
    <div className={`container-fluid ${theme.theme ?? 'light'}`}>
      <div className="row">
        <main className="p-0">
          <Header {...props} noavatar={true} />
          <div className="main_content vh-100 main_content_dashboard pd-t-80 d-flex">
            <SbarLeft />

            <div className="flex-1 bg-body mh-100 overflow-hidden overflow-y-auto position-relative main-content">
              <Suspense fallback={<Spinner />}>
                <RenderComponent link={integrationLink} activeDomain={activeDomain} {...props} />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
});

export default MainLayoutIntegration;
