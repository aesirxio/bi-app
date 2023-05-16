/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import CardComponent from './Component/Card';

import { withRouter } from 'react-router-dom';
import OverviewComponent from './Component/Overview';

import { withDashboardViewModel } from './DashboardViewModels/DashboardViewModelContextProvider';
import { BiViewModelContext } from 'store/BiStore/BiViewModelContextProvider';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import DateRangePicker from 'components/DateRangePicker';
import { env } from 'aesirx-lib';
import { Col, Row } from 'react-bootstrap';
import Countries from './Component/Countries';
import moment from 'moment';
import Browsers from './Component/Browsers';
import TopTable from 'containers/AudiencePage/Component/TopTable';

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
          className: 'col-lg-3 mb-2 mb-lg-0',
          title: t('txt_visitors'),
          icon: env.PUBLIC_URL + '/assets/images/visitor.svg',
          iconColor: '#1AB394',
          value: Helper.numberWithCommas(
            this.dashboardListViewModel.summaryData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
          ),
          isIncrease: true,
          loading: this.dashboardListViewModel.status,
          // options: [{ label: t('txt_all_users'), value: 'all-user' }],
          // defaultValue: { label: t('txt_all_users'), value: 'all-user' },
        },
        {
          className: 'col-lg-3 mb-2 mb-lg-0',
          title: t('txt_page_views'),
          icon: env.PUBLIC_URL + '/assets/images/view.svg',
          iconColor: '#2E71B1',
          value: Helper.numberWithCommas(
            this.dashboardListViewModel.summaryData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
            ]
          ),
          isIncrease: false,
          loading: this.dashboardListViewModel.status,
        },
        {
          className: 'col-lg-3 mb-2 mb-lg-0',
          title: t('txt_acg_session_duration'),
          icon: env.PUBLIC_URL + '/assets/images/duration.svg',
          iconColor: '#EF3737',
          value:
            (this.dashboardListViewModel?.summaryData?.[
              BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
            ]
              ? moment
                  .utc(
                    this.dashboardListViewModel?.summaryData?.[
                      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                    ] * 1000
                  )
                  .format('HH:mm:ss')
              : '00:00:00') + 's',
          isIncrease: false,
          loading: this.dashboardListViewModel.status,
        },
        {
          className: 'col-lg-3 mb-2 mb-lg-0',
          title: t('txt_page_session'),
          icon: env.PUBLIC_URL + '/assets/images/page.svg',
          iconColor: '#FFBE55',
          value: Helper.numberWithCommas(
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
          <div className="row mt-24">
            <div className="col-lg-6">
              <OverviewComponent
                lines={['visits', 'page_views']}
                areaColors={['#3BB346', '#9747FF']}
                lineColors={['#0FC6C2', '#9747FF']}
                listViewModel={this.dashboardListViewModel}
                status={this.dashboardListViewModel?.status}
              />
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <TopTable
                  data={this.dashboardListViewModel?.pagesTableData?.list}
                  pagination={this.dashboardListViewModel?.pagesTableData?.pagination}
                  isPagination={false}
                  selectPage={async (value) => {
                    await this.dashboardListViewModel.handleFilterPages({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.dashboardListViewModel.handleFilterPages({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={this.dashboardListViewModel?.status}
                  {...this.props}
                />
              </div>
            </div>
          </div>
          <Row className="my-24 pb-24">
            <Col lg={6}>
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <Countries {...this.props} />
              </div>
            </Col>
            <Col lg={6}>
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <Browsers {...this.props} />
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withDashboardViewModel(Dashboard)));
