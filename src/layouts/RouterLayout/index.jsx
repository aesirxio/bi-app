/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

import { Route, Switch, useLocation } from 'react-router-dom';
import { authRoutes, mainRoutes, settingRoutes } from '../../routes/routes';

import AuthLayout from '../AuthLayout';
import MainLayout from '../MainLayout';
import SettingLayout from '../SettingLayout';

import { Toast } from '../../components/Toast';
import NotFound from '../../containers/NotFound';
import { BiStoreProvider } from 'store/BiStore/BiViewModelContextProvider';
import BiViewModel from 'store/BiStore/BiViewModel';
import BiStore from 'store/BiStore/BiStore';
import { AnalyticsReact } from 'analytics';

const biStore = new BiStore();
const biViewModel = new BiViewModel(biStore);
const RouterLayout = () => {
  const authPath = authRoutes
    .map((item) => {
      return item.path;
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  const mainPath = mainRoutes
    .map((item) => {
      return item.path;
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  const settingPath = settingRoutes
    .map((item) => {
      return item.path;
    })
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);
  const location = useLocation();
  return (
    <>
      <Toast />
      <AnalyticsReact pathname={location.pathname} />
      <Switch>
        <Route exact path={authPath}>
          <AuthLayout />
        </Route>
        <BiStoreProvider viewModel={biViewModel}>
          <Route exact path={mainPath}>
            <MainLayout />
          </Route>
          <Route exact path={settingPath}>
            <SettingLayout />
          </Route>
        </BiStoreProvider>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
};

export default RouterLayout;
