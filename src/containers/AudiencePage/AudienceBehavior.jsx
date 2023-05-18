// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from 'components/DateRangePicker';
import CardComponent from 'containers/Dashboard/Component/Card';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withAudienceViewModel } from 'containers/AudiencePage/AudienceViewModels/AudienceViewModelContextProvider';
import { BiViewModelContext } from 'store/BiStore/BiViewModelContextProvider';
import { env } from 'aesirx-lib';
import moment from 'moment';
import TopTabsBehavior from './Component/TopTabsBehavior';
import OverviewComponent from 'containers/Dashboard/Component/Overview';

const AudienceBehaviorPage = observer(
  class AudienceBehaviorPage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.audienceListViewModel = this.viewModel
        ? this.viewModel.getAudienceListViewModel()
        : null;
    }
    componentDidMount = () => {
      this.audienceListViewModel.initializeBehavior({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.audienceListViewModel.initializeBehavior({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.audienceListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
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
            this.audienceListViewModel.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
            ]
          ),
          isIncrease: false,
          loading: this.audienceListViewModel.statusMetrics,
        },
        {
          className: 'col-12 mb-24',
          title: t('txt_acg_session_duration'),
          icon: env.PUBLIC_URL + '/assets/images/duration.svg',
          iconColor: '#EF3737',
          value:
            (this.audienceListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
            ]
              ? moment
                  .utc(
                    this.audienceListViewModel?.metricsData?.[
                      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                    ] * 1000
                  )
                  .format('HH:mm:ss')
              : '00:00:00') + 's',
          isIncrease: false,
          loading: this.audienceListViewModel.statusMetrics,
        },
        {
          className: 'col-12',
          title: t('txt_page_session'),
          icon: env.PUBLIC_URL + '/assets/images/page.svg',
          iconColor: '#FFBE55',
          value: Helper.numberWithCommas(
            this.audienceListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.audienceListViewModel?.statusMetrics,
        },
      ];
    };

    render() {
      const { t } = this.props;
      const card = this.generateCard();
      return (
        <div className="py-4 px-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_behavior')}</h2>
              <p className="mb-0 text-color">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>

          <Row className="mb-24">
            <Col lg={9}>
              <OverviewComponent
                lines={['page_views']}
                areaColors={['#9747FF']}
                lineColors={['#9747FF']}
                isSelection={false}
                listViewModel={this.audienceListViewModel}
                status={this.audienceListViewModel?.statusOverview}
              />
            </Col>
            <Col lg={3}>
              <CardComponent data={card ?? []} />
            </Col>
          </Row>
          <TopTabsBehavior listViewModel={this.audienceListViewModel} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withAudienceViewModel(AudienceBehaviorPage)));
