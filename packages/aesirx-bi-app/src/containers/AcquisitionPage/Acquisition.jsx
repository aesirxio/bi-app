import PieChartComponent from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import CardComponent from '../Dashboard/Component/Card';
import { BI_SUMMARY_FIELD_KEY, Helper, env } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withAcquisitionViewModel } from './AcquisitionViewModels/AcquisitionViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import moment from 'moment';
import TopTabsChannel from './Component/TopTabsChannel';
import OverviewComponent from '../Dashboard/Component/Overview';
import queryString from 'query-string';
import ComponentNoData from 'components/ComponentNoData';

const AcquisitionPage = observer(
  class AcquisitionPage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.acquisitionListViewModel = this.viewModel
        ? this.viewModel.getAcquisitionListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
    }
    componentDidMount = () => {
      this.acquisitionListViewModel.initialize(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'filter[acquisition]': true,
        },
        {},
        { ...(this.params?.pagination && { page: this.params?.pagination }) }
      );
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.acquisitionListViewModel.initialize(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
            'filter[acquisition]': true,
          },
          {},
          { ...(this.params?.pagination && { page: this.params?.pagination }) }
        );
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.acquisitionListViewModel.handleFilterDateRange(
        startDate ?? endDate,
        endDate ?? startDate
      );
    };

    generateCard = () => {
      const { t } = this.props;
      return [
        {
          className: 'col-3 mb-24',
          title: t('txt_visitors'),
          value: Helper.numberWithCommas(
            this.acquisitionListViewModel.metricsData?.[
              BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS
            ]
          ),
          isIncrease: false,
          loading: this.acquisitionListViewModel.statusMetrics,
          tooltip: t('txt_tooltip_visitors'),
        },

        {
          className: 'col-3 mb-24',
          title: t('txt_page_session'),
          value: Helper.numberWithCommas(
            this.acquisitionListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.acquisitionListViewModel?.statusMetrics,
          tooltip: t('txt_tooltip_page_session'),
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_bounce_rate'),
          value:
            Helper.numberWithCommas(
              this.acquisitionListViewModel?.metricsData?.[BI_SUMMARY_FIELD_KEY.BOUNCE_RATE]
            ) + '%',
          isIncrease: false,
          loading: this.acquisitionListViewModel?.statusMetrics,
          tooltip: t('txt_tooltip_bounce_rate'),
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_acg_session_duration'),
          value:
            (this.acquisitionListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
            ]
              ? moment
                  .utc(
                    this.acquisitionListViewModel?.metricsData?.[
                      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                    ] * 1000
                  )
                  .format('HH:mm:ss')
              : '00:00:00') + 's',
          isIncrease: false,
          loading: this.acquisitionListViewModel.statusMetrics,
          tooltip: t('txt_tooltip_avg_session_duration'),
        },
      ];
    };

    handleSort = async (column) => {
      this.acquisitionListViewModel.getChannel(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.acquisitionListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSearch = async (search) => {
      this.acquisitionListViewModel.getChannel(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {},
        { 'filter[url]': search }
      );
    };

    render() {
      const { t } = this.props;
      const card = this.generateCard();
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_acquisition')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <CardComponent data={card ?? []} />
          <Row className="mb-24 ChartWrapper">
            <Col lg={8}>
              <OverviewComponent
                bars={['visits']}
                barColors={['#0066FF']}
                isSelection={false}
                listViewModel={this.acquisitionListViewModel}
                status={this.acquisitionListViewModel?.statusOverview}
                data={this.acquisitionListViewModel?.visitsData?.toAreaChart()}
                filterData={this.acquisitionListViewModel?.visitsData?.getFilterName()}
              />
            </Col>
            <Col lg={4}>
              <div className="mb-24 ChartWrapper bg-white rounded-3 d-flex align-items-center w-100 h-100 position-relative">
                <div className="w-100">
                  {this.acquisitionListViewModel?.channelTableData?.list?.data?.length ? (
                    <PieChartComponent
                      height={400}
                      data={this.acquisitionListViewModel?.channelTableData?.list?.toPieChart()}
                      status={this.acquisitionListViewModel?.statusTopTable}
                      colors={['#0066FF', '#4747EB', '#96C0FF', '#D5EEFF']}
                      legendPosition="bottom"
                    />
                  ) : (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <ComponentNoData
                        icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                        title={t('txt_no_data')}
                        width="w-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <TopTabsChannel
            listViewModel={this.acquisitionListViewModel}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            {...this.props}
          />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withAcquisitionViewModel(AcquisitionPage)));
