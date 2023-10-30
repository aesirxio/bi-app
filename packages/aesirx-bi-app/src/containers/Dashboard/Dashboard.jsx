/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import OverviewComponent from './Component/Overview';

import { withDashboardViewModel } from './DashboardViewModels/DashboardViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { BI_DEVICES_FIELD_KEY, BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import DateRangePicker from '../../components/DateRangePicker';
import { env } from 'aesirx-lib';
import { Col, Row } from 'react-bootstrap';
import Countries from './Component/Countries';
import Browsers from './Component/Browsers';
import TopTable from '../VisitorsPage/Component/TopTable';
import { Image } from 'aesirx-uikit';

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
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
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
    render() {
      const { t } = this.props;

      let maxDevices =
        this.dashboardListViewModel.devicesData?.length &&
        this.dashboardListViewModel.devicesData.reduce(function (prev, current) {
          if (
            +current[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] >
            +prev[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
          ) {
            return current;
          } else {
            return prev;
          }
        });
      const maxDevicePercent =
        this.dashboardListViewModel.devicesData?.length &&
        (maxDevices[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] /
          this.dashboardListViewModel.devicesData.reduce(
            (a, b) => +a + +b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS],
            0
          )) *
          100;

      return (
        <div className="py-4 px-4 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative">
              <h2 className="fw-bold mb-8px">{t('txt_dashboard')}</h2>
              <p className="mb-0">{t('txt_dashboard_below')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <Row className="mt-24">
            <Col lg="3">
              <div className="bg-white shadow-sm rounded-3 h-100">
                <div className="bg-white border-bottom">
                  <div className="bg-dark-blue text-white p-24 rounded-3 rounded-bottom-0 fw-medium">
                    <h5 className="fs-6 mb-12px fw-medium">
                      {t('txt_visitors')} <span className="text-success ms-1">•</span>
                    </h5>
                    <div className="fs-24">
                      {Helper.numberWithCommas(
                        this.dashboardListViewModel.summaryData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS
                        ]
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-24 pb-18px rounded-3 rounded-bottom-0 fw-medium">
                    <h5 className="fs-6 mb-12px text-gray-900 fw-medium">
                      {t('txt_unique_visitors')}
                    </h5>
                    <div className="fs-24">
                      {Helper.numberWithCommas(
                        this.dashboardListViewModel.summaryData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
                        ]
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-24 pt-0 rounded-3 rounded-bottom-0 fw-medium">
                    <h5 className="fs-6 mb-12px text-gray-900 fw-medium">{t('txt_page_views')}</h5>
                    <div className="fs-24">
                      {Helper.numberWithCommas(
                        this.dashboardListViewModel.summaryData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS
                        ]
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white p-24 rounded-3 rounded-top-0">
                  {this.dashboardListViewModel.devicesData?.map((device, index) => {
                    let imgIcon = `${env.PUBLIC_URL}/assets/images/device_mobile.png`;
                    switch (device[BI_DEVICES_FIELD_KEY?.DEVICE]) {
                      case 'desktop':
                        imgIcon = `${env.PUBLIC_URL}/assets/images/device_desktop.png`;
                        break;
                      case 'iPad':
                        imgIcon = `${env.PUBLIC_URL}/assets/images/device_tablet.png`;
                        break;
                      case 'tablet':
                        imgIcon = `${env.PUBLIC_URL}/assets/images/device_tablet.png`;
                        break;
                    }
                    return (
                      <div
                        className="d-flex align-items-center justify-content-between w-100 mb-12px"
                        key={index}
                      >
                        <div className="d-flex align-items-center">
                          <Image
                            className={`me-12px`}
                            style={{ width: 44, height: 44 }}
                            src={imgIcon}
                            alt={'icons'}
                          />
                          <div className="fw-medium text-capitalize">
                            {device[BI_DEVICES_FIELD_KEY?.DEVICE]}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {maxDevices[BI_DEVICES_FIELD_KEY?.DEVICE] ===
                            device[BI_DEVICES_FIELD_KEY?.DEVICE] && (
                            <div className="fs-sm me-12px text-gray-900">
                              {maxDevicePercent?.toFixed(2)}%
                            </div>
                          )}
                          <div className="fw-medium fs-18px">
                            {device[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS]}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Col>
            <Col lg="9">
              <OverviewComponent
                bars={['visits', 'page_views']}
                barColors={['#0066FF', '#96C0FF']}
                listViewModel={this.dashboardListViewModel}
                status={this.dashboardListViewModel?.status}
              />
            </Col>
          </Row>
          <Row className="my-24 pb-24">
            <Col lg={6} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_pages')}</h4>
                <TopTable
                  data={this.dashboardListViewModel?.pagesTableData?.list}
                  pagination={this.dashboardListViewModel?.pagesTableData?.pagination}
                  isPagination={true}
                  simplePagination={true}
                  selectPage={async (value) => {
                    await this.dashboardListViewModel.handleFilterPages({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.dashboardListViewModel.handleFilterPages({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={this.dashboardListViewModel?.statusTopPageTable}
                  {...this.props}
                />
              </div>
            </Col>
            <Col lg={6} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <Countries {...this.props} />
              </div>
            </Col>
            <Col lg={6} className="mb-24">
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
