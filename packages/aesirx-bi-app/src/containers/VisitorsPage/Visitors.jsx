// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import OverviewComponent from '../Dashboard/Component/Overview';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withVisitorsViewModel } from './VisitorsViewModels/VisitorsViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import moment from 'moment';
import TopTabs from './Component/TopTabs';
import 'flag-icons/sass/flag-icons.scss';

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
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.visitorsListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.visitorsListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_visitors')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
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
                      {t('txt_unique_page_views')}
                    </h5>
                    <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                      {Helper.numberWithCommas(
                        this.visitorsListViewModel.metricsData?.[
                          BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
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
                bars={['visits', 'unique_visits']}
                barColors={['#0066FF', '#96C0FF']}
                isSelection={false}
                listViewModel={this.visitorsListViewModel}
                status={this.visitorsListViewModel?.statusOverview}
              />
            </Col>
          </Row>
          <TopTabs listViewModel={this.visitorsListViewModel} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withVisitorsViewModel(VisitorsPage)));
