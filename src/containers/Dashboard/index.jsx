/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';
import Spinner from '../../components/Spinner';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import PAGE_STATUS from 'constants/PageStatus';
import CardComponent from './Component/Card';
import DateRangePicker from 'components/DateRangePicker';

import SummaryStore from 'store/SummaryStore/SummaryStore';
import { withRouter } from 'react-router-dom';
import VisitorStore from 'store/VisitorStore/VisitorStore';
import OverviewComponent from './Component/Overview';
import DashboardStore from './DashboardStore/DashboardStore';
import DashboardViewModel from './DashboardViewModels/DashboardViewModel';
import {
  DashboardViewModelContext,
  DashboardViewModelContextProvider,
} from './DashboardViewModels/DashboardViewModelContextProvider';
import BiStore from 'store/BiStore/BiStore';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const summaryStore = new SummaryStore();

const visitorStore = new VisitorStore();
const dashboardStore = new DashboardStore();
const biStore = new BiStore();

const dashboardViewModel = new DashboardViewModel(
  dashboardStore,
  visitorStore,
  summaryStore,
  biStore
);

const Dashboard = observer(
  class Dashboard extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
    }

    componentDidMount() {
      let fetchData = async () => {
        if (this.props.history.location.pathname === '/' || !this.props.history.location.pathname) {
          this.props.history.push(`/data-${this.biListViewModel.activeDomain}`);
        }
      };
      fetchData();
    }

    render() {
      const { t } = this.props;
      if (status === PAGE_STATUS.LOADING) {
        return <Spinner />;
      }

      return (
        <DashboardViewModelContextProvider viewModel={dashboardViewModel}>
          <div className="py-4 px-3 h-100 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
              <div className="position-relative">
                <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_dashboard')}</h2>
                <p className="mb-0 text-color">{t('txt_dashboard_below')}</p>
              </div>
              <div className="position-relative">
                <DashboardViewModelContext.Consumer>
                  {({ visitorListViewModel, summaryListViewModel }) => {
                    return (
                      <DateRangePicker
                        viewModelArr={[visitorListViewModel, summaryListViewModel]}
                      />
                    );
                  }}
                </DashboardViewModelContext.Consumer>
              </div>
            </div>
            <CardComponent />
            <div className="row">
              <div className="col-12">
                <OverviewComponent />
              </div>
            </div>
          </div>
        </DashboardViewModelContextProvider>
      );
    }
  }
);

export default withTranslation('common')(withRouter(withBiViewModel(Dashboard)));
