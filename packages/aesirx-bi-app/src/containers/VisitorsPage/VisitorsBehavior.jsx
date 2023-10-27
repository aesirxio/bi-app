// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import CardComponent from '../Dashboard/Component/Card';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withVisitorsViewModel } from './VisitorsViewModels/VisitorsViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { env } from 'aesirx-lib';
import moment from 'moment';
import TopTabsBehavior from './Component/TopTabsBehavior';
import OverviewComponent from '../Dashboard/Component/Overview';

const VisitorsBehaviorPage = observer(
  class VisitorsBehaviorPage extends Component {
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
      this.visitorsListViewModel.initializeBehavior({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.visitorsListViewModel.initializeBehavior({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.visitorsListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    generateCard = () => {
      const { t } = this.props;
      return [
        {
          className: 'col-12 mb-24',
          title: t('txt_page_views'),
          icon: env.PUBLIC_URL + '/assets/images/view.svg',
          iconColor: '#2E71B1',
          value: Helper.numberWithCommas(
            this.visitorsListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
          ),
          isIncrease: false,
          loading: this.visitorsListViewModel.statusMetrics,
          options: [
            {
              label: t('txt_all'),
              value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
              actualValue: Helper.numberWithCommas(
                this.visitorsListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
              ),
            },
            {
              label: t('txt_unique'),
              value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS,
              actualValue: Helper.numberWithCommas(
                this.visitorsListViewModel.metricsData?.[
                  BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
                ]
              ),
            },
          ],
          defaultValue: {
            label: t('txt_all'),
            value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
            actualValue: Helper.numberWithCommas(
              this.visitorsListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
            ),
          },
        },
        {
          className: 'col-12 mb-24',
          title: t('txt_acg_session_duration'),
          icon: env.PUBLIC_URL + '/assets/images/duration.svg',
          iconColor: '#EF3737',
          value:
            (this.visitorsListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
            ]
              ? moment
                  .utc(
                    this.visitorsListViewModel?.metricsData?.[
                      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                    ] * 1000
                  )
                  .format('HH:mm:ss')
              : '00:00:00') + 's',
          isIncrease: false,
          loading: this.visitorsListViewModel.statusMetrics,
        },
        {
          className: 'col-12',
          title: t('txt_page_session'),
          icon: env.PUBLIC_URL + '/assets/images/page.svg',
          iconColor: '#FFBE55',
          value: Helper.numberWithCommas(
            this.visitorsListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.visitorsListViewModel?.statusMetrics,
        },
      ];
    };

    render() {
      const { t } = this.props;
      const card = this.generateCard();
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_behavior')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>

          <Row className="mb-24">
            <Col lg={9}>
              <OverviewComponent
                bars={['page_views']}
                barColors={['#0066FF']}
                isSelection={false}
                listViewModel={this.visitorsListViewModel}
                status={this.visitorsListViewModel?.statusOverview}
              />
            </Col>
            <Col lg={3}>
              <CardComponent data={card ?? []} />
            </Col>
          </Row>
          <TopTabsBehavior listViewModel={this.visitorsListViewModel} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withVisitorsViewModel(VisitorsBehaviorPage)));
