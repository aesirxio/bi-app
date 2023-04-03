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

import { withRouter } from 'react-router-dom';
import OverviewComponent from './Component/Overview';

import { withDashboardViewModel } from './DashboardViewModels/DashboardViewModelContextProvider';
import { BiViewModelContext } from 'store/BiStore/BiViewModelContextProvider';
import numberWithCommas from 'utils/formatNumber';
import { BI_SUMMARY_FIELD_KEY } from 'aesirx-dma-lib';
import DateRangePicker from 'components/DateRangePicker';
import { env } from 'env';

const Dashboard = observer(
  class Dashboard extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.dashboardListViewModel = this.viewModel
        ? this.viewModel.getDashboardListViewModel()
        : null;
    }

    componentDidUpdate = (prevProps) => {
      console.log(this.props.location !== prevProps.location);
      if (this.props.location !== prevProps.location && !this.props.integration) {
        this.dashboardListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }

      if (this.props.activeDomain !== prevProps.activeDomain && this.props.integration) {
        this.dashboardListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };

    componentDidMount = () => {
      this.dashboardListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.dashboardListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    generateCard = () => {
      const { t } = this.props;
      return [
        {
          className: 'col-3',
          title: t('txt_visitors'),
          icon: env.PUBLIC_URL + '/assets/images/visitor.svg',
          iconColor: '#1AB394',
          value: numberWithCommas(
            this.dashboardListViewModel.summaryData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
          ),
          isIncrease: true,
          loading: this.dashboardListViewModel.status,
          options: [{ label: t('txt_all_users'), value: 'all-user' }],
          defaultValue: { label: t('txt_all_users'), value: 'all-user' },
        },
        {
          className: 'col-3',
          title: t('txt_page_views'),
          icon: env.PUBLIC_URL + '/assets/images/view.svg',
          iconColor: '#2E71B1',
          value: numberWithCommas(
            this.dashboardListViewModel.summaryData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
          ),
          isIncrease: false,
          loading: this.dashboardListViewModel.status,
          options: [
            { label: t('txt_all'), value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS },
            {
              label: t('txt_unique'),
              value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS,
            },
          ],
          defaultValue: { label: t('txt_all'), value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS },
        },
        {
          className: 'col-3',
          title: t('txt_acg_session_duration'),
          icon: env.PUBLIC_URL + '/assets/images/duration.svg',
          iconColor: '#EF3737',
          value:
            numberWithCommas(
              this.dashboardListViewModel?.summaryData?.[
                BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
              ]
            ) + 's',
          isIncrease: false,
          loading: this.dashboardListViewModel.status,
        },
        {
          className: 'col-3',
          title: t('txt_page_session'),
          icon: env.PUBLIC_URL + '/assets/images/page.svg',
          iconColor: '#FFBE55',
          value: numberWithCommas(
            this.dashboardListViewModel?.summaryData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.dashboardListViewModel.status,
        },
      ];
    };

    render() {
      const { t } = this.props;
      const { status } = this.dashboardListViewModel;

      if (status === PAGE_STATUS.LOADING) {
        return <Spinner />;
      }
      const card = this.generateCard();
      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative">
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_dashboard')}</h2>
              <p className="mb-0 text-color">{t('txt_dashboard_below')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <CardComponent data={card ?? []} />
          <div className="row">
            <div className="col-12">
              <OverviewComponent />
            </div>
          </div>
        </div>
      );
    }
  }
);

export default withTranslation('common')(withRouter(withDashboardViewModel(Dashboard)));
