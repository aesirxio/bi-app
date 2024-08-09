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
import { BI_FLOW_DETAIL_KEY, Helper } from 'aesirx-lib';
import DateRangePicker from '../../components/DateRangePicker';
import { Col, Row, Spinner } from 'react-bootstrap';
import Countries from './Component/Countries';
import Browsers from './Component/Browsers';
import TopTable from '../VisitorsPage/Component/TopTable';
import { PAGE_STATUS, RingLoaderComponent } from 'aesirx-uikit';
import { Link } from 'react-router-dom';

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
        this.dashboardListViewModel.initialize(
          this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        );
      }
    };

    componentDidMount = async () => {
      this.dashboardListViewModel.initialize(
        this.context.biListViewModel.activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      );
      try {
        setInterval(async () => {
          this.dashboardListViewModel.getLiveVisitorsTotal(
            {
              'filter[domain]': this.context.biListViewModel.activeDomain,
            },
            true
          );
          this.dashboardListViewModel.getLiveVisitorsList(
            {
              'filter[domain]': this.context.biListViewModel.activeDomain,
            },
            true
          );
        }, 15000);
      } catch (e) {
        console.log(e);
      }
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.dashboardListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortPage = async (column) => {
      this.dashboardListViewModel.getPages(
        this.context.biListViewModel.activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.dashboardListViewModel?.sortByPages['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSortSources = async (column) => {
      this.dashboardListViewModel.getReferer(
        this.context.biListViewModel.activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.dashboardListViewModel?.sortBySources['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };
    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative">
              <h2 className="fw-medium mb-3 mt-3">{t('txt_dashboard')}</h2>
            </div>
            <div className="position-relative havePrintButton">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <Row>
            <Col lg="4">
              <div className="bg-white shadow-sm rounded-3 h-100">
                <div className="bg-white border-bottom">
                  <div className="bg-dark-blue text-white p-24 rounded-3 rounded-bottom-0 fw-medium d-flex align-items-center justify-content-between">
                    <h5 className="fs-6 mb-0 fw-medium">{t('txt_real_time_active_users')}</h5>
                    <div className="fs-1 position-relative">
                      {this.dashboardListViewModel?.statusLiveVisitorsTotal ===
                      PAGE_STATUS.LOADING ? (
                        <Spinner size="sm" variant="success" className="fs-6" />
                      ) : (
                        Helper.numberWithCommas(this.dashboardListViewModel.liveVisitorsTotalData)
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3 rounded-top-0 position-relative ChartWrapper">
                  <div className="bg-secondary-25 py-2">
                    <Row>
                      <Col sm="3">
                        <div className="text-gray-heading fw-semibold text-center">Local</div>
                      </Col>
                      <Col sm="9">
                        <div className="text-gray-heading fw-semibold">Page</div>
                      </Col>
                    </Row>
                  </div>
                  {this.dashboardListViewModel?.statusLiveVisitorsList === PAGE_STATUS.LOADING ? (
                    <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
                  ) : (
                    <>
                      <div>
                        {this.dashboardListViewModel.liveVisitorsListData?.map((item, index) => {
                          const urlParams =
                            item?.events[item?.events?.length - 1]?.url &&
                            new URL(item?.events[item?.events?.length - 1]?.url);
                          return (
                            <Row key={index} className="py-10">
                              <Col sm="3">
                                <div className="text-center">
                                  <span
                                    className={`me-1 fi fi-${item[
                                      BI_FLOW_DETAIL_KEY.GEO
                                    ]?.country?.code?.toLowerCase()}`}
                                  ></span>
                                </div>
                              </Col>
                              <Col sm="9">
                                <div className="">
                                  {urlParams === ''
                                    ? 'Unknown'
                                    : urlParams?.pathname !== '/'
                                    ? urlParams?.pathname + urlParams?.search
                                    : urlParams?.host}
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                      </div>
                      <div className="bg-white border-top text-center py-3">
                        {this.props.integration ? (
                          <a
                            href="#"
                            onClick={(e) => this.props.handleChangeLink(e, `/flow-list`)}
                            className={'text-secondary-50 text-nowrap fw-medium'}
                          >
                            {t('txt_view_more')}
                          </a>
                        ) : (
                          <Link to="/flow-list" className="text-secondary-50 text-nowrap fw-medium">
                            {t('txt_view_more')}
                          </Link>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg="8">
              <OverviewComponent
                bars={['visits', 'page_views']}
                barColors={['#0066FF', '#96C0FF']}
                listViewModel={this.dashboardListViewModel}
                status={this.dashboardListViewModel?.status}
                data={this.dashboardListViewModel?.visitorData?.toAreaChart()}
                filterData={this.dashboardListViewModel?.visitorData?.getFilterName()}
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={6} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative d-flex flex-column">
                <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_sources')}</h4>
                <TopTable
                  data={this.dashboardListViewModel?.sourcesTableData?.list}
                  pagination={this.dashboardListViewModel?.sourcesTableData?.pagination}
                  isPagination={true}
                  simplePagination={true}
                  selectPage={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={this.dashboardListViewModel?.statusTopSourceTable}
                  sortAPI={true}
                  handleSort={this.handleSortSources}
                  sortBy={this.dashboardListViewModel?.sortBySources}
                  tdClass={'py-1'}
                  {...this.props}
                />
              </div>
            </Col>
            <Col lg={6} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative d-flex flex-column">
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
                  sortAPI={true}
                  handleSort={this.handleSortPage}
                  sortBy={this.dashboardListViewModel?.sortByPages}
                  tdClass={'py-1'}
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

          <Row>
            <Col lg={12} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_event')}</h4>
                <TopTable
                  data={this.dashboardListViewModel?.eventNameTypeTableData?.list}
                  pagination={this.dashboardListViewModel?.eventNameTypeTableData?.pagination}
                  isPagination={true}
                  simplePagination={true}
                  selectPage={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={this.dashboardListViewModel?.statusTopBrowser}
                  sortAPI={true}
                  handleSort={this.handleSortSources}
                  sortBy={this.dashboardListViewModel?.sortByEventsType}
                  {...this.props}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12} className="mb-24">
              <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_menu_utm_tracking')}</h4>
                <TopTable
                  data={this.dashboardListViewModel?.attributeTypeTableData?.list}
                  pagination={this.dashboardListViewModel?.attributeTypeTableData?.pagination}
                  isPagination={true}
                  simplePagination={true}
                  selectPage={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.dashboardListViewModel.handleFilterSources({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={this.dashboardListViewModel?.statusTopBrowser}
                  sortAPI={true}
                  handleSort={this.handleSortSources}
                  sortBy={this.dashboardListViewModel?.sortByEventsType}
                  {...this.props}
                />
              </div>
            </Col>
          </Row>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withDashboardViewModel(Dashboard)));
