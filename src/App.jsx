/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

import 'aesirx-uikit/dist/index.css';

import { AppProvider } from 'aesirx-uikit';
import { authRoutes, mainRoutes } from 'routes/routes';
import { isLogin } from 'auth';

import { BiStoreProvider } from 'store/BiStore/BiViewModelContextProvider';
import BiViewModel from 'store/BiStore/BiViewModel';
import BiStore from 'store/BiStore/BiStore';
import DataStream from 'components/DataStream';
import appLanguages from 'translations';
import SbarLeft from 'components/SbarLeft';

const biStore = new BiStore();
const biViewModel = new BiViewModel(biStore);

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
        leftMenu={<SbarLeft />}
      />
    </BiStoreProvider>
  );
};

export default App;
