// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import OverviewComponent from '../Dashboard/Component/Overview';
import CardComponent from '../Dashboard/Component/Card';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withAudienceViewModel } from './AudienceViewModels/AudienceViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { env } from 'aesirx-lib';
import moment from 'moment';
import TopTabs from './Component/TopTabs';
import 'flag-icons/sass/flag-icons.scss';

const AudiencePage = observer(
  class AudiencePage extends Component {
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
      this.audienceListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.audienceListViewModel.initialize({
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
          title: t('txt_visitors'),
          icon: env.PUBLIC_URL + '/assets/images/visitor.svg',
          iconColor: '#1AB394',
          value: Helper.numberWithCommas(
            this.audienceListViewModel.metricsData?.[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
          ),
          isIncrease: true,
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
          loading: this.audienceListViewModel.statusMetrics,
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
              <h2 className="fw-bold mb-8px">{t('txt_audience')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>

          <Row className="mb-24">
            <Col lg={3}>
              <CardComponent data={card ?? []} />
            </Col>
            <Col lg={9}>
              <OverviewComponent
                bars={['visits', 'page_views']}
                barColors={['#0066FF', '#96C0FF']}
                isSelection={false}
                listViewModel={this.audienceListViewModel}
                status={this.audienceListViewModel?.statusOverview}
              />
            </Col>
          </Row>
          <TopTabs listViewModel={this.audienceListViewModel} />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withAudienceViewModel(AudiencePage)));
