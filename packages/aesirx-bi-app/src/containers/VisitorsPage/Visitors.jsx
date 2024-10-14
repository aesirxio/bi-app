// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import OverviewComponent from '../Dashboard/Component/Overview';
import { BI_SUMMARY_FIELD_KEY, Helper, env } from 'aesirx-lib';
import { Link, withRouter } from 'react-router-dom';
import { withVisitorsViewModel } from './VisitorsViewModels/VisitorsViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import moment from 'moment';
import TopTabs from './Component/TopTabs';
import 'flag-icons/sass/flag-icons.scss';
import PAGE_STATUS from 'constants/PageStatus';
import FlowListTable from 'containers/FlowListPage/Component/FlowListTable';
import ComponentNoData from 'components/ComponentNoData';
import { RingLoaderComponent } from 'aesirx-uikit';

const VisitorsPage = observer(
  class VisitorsPage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.visitorsListViewModel = this.viewModel
        ? this.viewModel.getVisitorsListViewModel()
        : null;
    }
    componentDidMount = () => {
      this.visitorsListViewModel.initialize({
        ...this.context.biListViewModel.activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      });
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.visitorsListViewModel.initialize({
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        });
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.visitorsListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortFlowList = async (column) => {
      this.visitorsListViewModel.getFlowList(
        {
          ...this.props.domain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'with[]': 'events',
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.visitorsListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleChangeLink = (e, link) => {
      e.preventDefault();
      if (link) {
        this.context.biListViewModel.setIntegrationLink(link);
      }
    };

    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="fw-medium mb-3 mt-3">{t('txt_visitors')}</h2>
            </div>
            <div className="position-relative havePrintButton">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <Row className="mb-24">
            <Col lg="3">
              <div className="bg-white shadow-sm rounded-3 h-100 d-flex flex-column">
                <div className="p-32px d-flex flex-column flex-grow-1">
                  <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                    <h5
                      className="fs-6 mb-14px text-gray-900 fw-medium"
                      style={{ fontSize: '16px' }}
                    >
                      {t('txt_visitors')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {Helper.numberWithCommas(
                        this.visitorsListViewModel.metricsData?.[
                          BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS
                        ]
                      )}
                    </div>
                  </div>
                  <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                    <h5
                      className="fs-6 mb-14px text-gray-900 fw-medium"
                      style={{ fontSize: '16px' }}
                    >
                      {t('txt_unique_visitors')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {Helper.numberWithCommas(
                        this.visitorsListViewModel.metricsData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS
                        ]
                      )}
                    </div>
                  </div>
                  <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                    <h5
                      className="fs-6 mb-14px text-gray-900 fw-medium"
                      style={{ fontSize: '16px' }}
                    >
                      {t('txt_average_visit_duration')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {this.visitorsListViewModel?.metricsData?.[
                        BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                      ]
                        ? moment
                            .utc(
                              this.visitorsListViewModel?.metricsData?.[
                                BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                              ] * 1000
                            )
                            .format('m [min] s [s]')
                        : '0 min 0s'}
                    </div>
                  </div>

                  <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                    <h5
                      className="fs-6 mb-14px text-gray-900 fw-medium"
                      style={{ fontSize: '16px' }}
                    >
                      {t('txt_page_views')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {Helper.numberWithCommas(
                        this.visitorsListViewModel.metricsData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS
                        ]
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-3 fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                    <h5
                      className="fs-6 mb-14px text-gray-900 fw-medium"
                      style={{ fontSize: '16px' }}
                    >
                      {t('txt_bounce_rate')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {Helper.numberWithCommas(
                        this.visitorsListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.BOUNCE_RATE]
                      ) + '%'}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={9}>
              <OverviewComponent
                bars={['unique_visits', 'visits']}
                barColors={['#0066FF', '#96C0FF']}
                isSelection={false}
                listViewModel={this.visitorsListViewModel}
                status={this.visitorsListViewModel?.statusOverview}
                data={this.visitorsListViewModel?.visitsData?.toAreaChart()}
                filterData={this.visitorsListViewModel?.visitsData?.getFilterName()}
              />
            </Col>
          </Row>
          <TopTabs
            listViewModel={this.visitorsListViewModel}
            domain={this.context.biListViewModel.activeDomain}
            handleChangeLink={this.handleChangeLink}
            {...this.props}
          />
          <div className="position-relative ChartWrapper my-4 bg-white rounded-3 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="ps-3">{t('txt_user_experience')}</h4>
              {this.props.integration ? (
                <a
                  href="#"
                  onClick={(e) => this.handleChangeLink(e, `/flow-list`)}
                  className={'text-success me-2 text-nowrap fw-semibold'}
                >
                  {t('txt_view_more')}
                </a>
              ) : (
                <Link to="/flow-list" className="text-success me-2 text-nowrap fw-semibold">
                  {t('txt_view_more')}
                </Link>
              )}
            </div>

            {this.visitorsListViewModel?.statusFlowList === PAGE_STATUS.LOADING ? (
              <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
            ) : this.visitorsListViewModel?.flowListTableData?.list ? (
              <FlowListTable
                data={this.visitorsListViewModel?.flowListTableData?.list?.toFlowListTable(
                  this.props.integration
                )}
                isPagination={false}
                pagination={this.visitorsListViewModel?.flowListTableData?.pagination}
                selectPage={async (value) => {
                  await this.visitorsListViewModel.handleFilterFlowList({ page: value });
                }}
                selectPageSize={async (value) => {
                  await this.visitorsListViewModel.handleFilterFlowList({
                    page: 1,
                    page_size: value,
                  });
                }}
                status={status}
                sortAPI={true}
                handleSort={this.handleSortFlowList}
                sortBy={this.visitorsListViewModel?.sortByFlowList}
                {...this.props}
              />
            ) : (
              <div className="position-relative ChartWrapper bg-white rounded-3 shadow-sm">
                <div className="position-absolute top-50 start-50 translate-middle">
                  <ComponentNoData
                    icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                    title={t('txt_no_data')}
                    width="w-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withVisitorsViewModel(VisitorsPage)));
