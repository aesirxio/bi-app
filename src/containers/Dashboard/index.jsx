import React from 'react';
import { BiStoreProvider, withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import BiViewModel from 'store/BiStore/BiViewModel';
import BiStore from 'store/BiStore/BiStore';
import DashboardDetail from './dashboard';
import { withTranslation } from 'react-i18next';
const biStore = new BiStore();
const biViewModel = new BiViewModel(biStore);
const Dashboard = () => {
  return (
    <BiStoreProvider viewModel={biViewModel}>
      <DashboardDetail></DashboardDetail>
    </BiStoreProvider>
  );
};
export default withTranslation('common')(withBiViewModel(Dashboard));
