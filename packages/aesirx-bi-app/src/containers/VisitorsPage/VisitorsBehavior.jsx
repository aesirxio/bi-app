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
          className: 'col-3 mb-24',
          title: t('txt_page_views'),
          value: Helper.numberWithCommas(
            this.visitorsListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
          ),
          isIncrease: false,
          loading: this.visitorsListViewModel.statusMetrics,
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_acg_session_duration'),
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
          className: 'col-3 mb-24',
          title: t('txt_page_session'),
          value: Helper.numberWithCommas(
            this.visitorsListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.visitorsListViewModel?.statusMetrics,
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_bounce_rate'),
          value:
            Helper.numberWithCommas(
              this.visitorsListViewModel?.metricsData?.[BI_SUMMARY_FIELD_KEY.BOUNCE_RATE]
            ) + '%',
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
          <CardComponent data={card ?? []} />
          <Row className="mb-24 ChartWrapper">
            <Col lg={12}>
              <OverviewComponent
                bars={['page_views']}
                barColors={['#0066FF']}
                isSelection={false}
                listViewModel={this.visitorsListViewModel}
                status={this.visitorsListViewModel?.statusOverview}
                data={this.visitorsListViewModel?.visitorData?.toAreaChart()}
                filterData={this.visitorsListViewModel?.visitorData?.getFilterName()}
              />
            </Col>
          </Row>
          <TopTabsBehavior listViewModel={this.visitorsListViewModel} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withVisitorsViewModel(VisitorsBehaviorPage)));
