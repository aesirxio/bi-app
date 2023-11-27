/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

import 'aesirx-uikit/dist/index.css';
import 'scss/app.scss';
import { AppProvider, isLogin } from 'aesirx-uikit';
import { authRoutes, mainRoutes } from './routes/routes';

import { BiStoreProvider } from './store/BiStore/BiViewModelContextProvider';
import { BiViewModel } from './store/BiStore/BiViewModel';
import { appLanguages } from './translations';
import { DataStream } from './components/DataStream';

import Menu from './components/Menu';

const biViewModel = new BiViewModel();

const App = () => {
  return (
    <BiStoreProvider viewModel={biViewModel}>
      <AppProvider
        appLanguages={appLanguages}
        authRoutes={authRoutes}
        mainRoutes={mainRoutes}
        isLogin={isLogin}
        componentHeader={<DataStream />}
        rootId="#biapp"
        leftMenu={<Menu />}
        logo={'/assets/images/logo_company.svg'}
        isColorMode={false}
      />
    </BiStoreProvider>
  );
};

export default App;
