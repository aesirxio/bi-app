/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

import Header from 'components/Header';
import SbarLeft from './SbarLeftIntegration';
import { ThemesContextProvider } from 'themes/ThemeContextProvider';
import ErrorBoundary from 'layouts/ErrorBoundary';
import { I18nextProvider } from 'react-i18next';
import i18n from 'translations/i18n';
import { BiStoreProvider } from 'store/BiStore/BiViewModelContextProvider';
import BiStore from 'store/BiStore/BiStore';
import BiViewModel from 'store/BiStore/BiViewModel';
import { Toast } from 'components/Toast';
const biStore = new BiStore();
const biViewModel = new BiViewModel(biStore);
const MainLayoutIntegration = () => {
  return (
    <ThemesContextProvider>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Toast />
          <BiStoreProvider viewModel={biViewModel}>
            <div className="container-fluid">
              <div className="row">
                <main className="p-0">
                  <Header />
                  <div className="main_content vh-100 main_content_dashboard pd-t-80 d-flex">
                    <SbarLeft />
                    <div className="flex-1 bg-body mh-100 overflow-hidden overflow-y-auto position-relative main-content">
                      123
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </BiStoreProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </ThemesContextProvider>
  );
};

export default MainLayoutIntegration;
