import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import { BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import { withRouter } from 'react-router-dom';
import { withSearchEngineViewModel } from './SearchEngineViewModels/SearchEngineViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import moment from 'moment';
import OverviewComponent from '../Dashboard/Component/Overview';
import queryString from 'query-string';
import OutlinkTable from './Component/OutlinkTable';

const SearchEnginePage = observer(
  class SearchEnginePage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.searchEngineListViewModel = this.viewModel
        ? this.viewModel.getSearchEngineListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
    }
    componentDidMount = () => {
      this.searchEngineListViewModel.initialize(
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
        this.searchEngineListViewModel.initialize(
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
      this.searchEngineListViewModel.handleFilterDateRange(
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
            this.searchEngineListViewModel.metricsData?.[
              BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS
            ]
          ),
          isIncrease: false,
          loading: this.searchEngineListViewModel.statusMetrics,
        },

        {
          className: 'col-3 mb-24',
          title: t('txt_page_session'),
          value: Helper.numberWithCommas(
            this.searchEngineListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION
            ]
          ),
          isIncrease: false,
          loading: this.searchEngineListViewModel?.statusMetrics,
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_bounce_rate'),
          value:
            Helper.numberWithCommas(
              this.searchEngineListViewModel?.metricsData?.[BI_SUMMARY_FIELD_KEY.BOUNCE_RATE]
            ) + '%',
          isIncrease: false,
          loading: this.searchEngineListViewModel?.statusMetrics,
        },
        {
          className: 'col-3 mb-24',
          title: t('txt_acg_session_duration'),
          value:
            (this.searchEngineListViewModel?.metricsData?.[
              BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
            ]
              ? moment
                  .utc(
                    this.searchEngineListViewModel?.metricsData?.[
                      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
                    ] * 1000
                  )
                  .format('HH:mm:ss')
              : '00:00:00') + 's',
          isIncrease: false,
          loading: this.searchEngineListViewModel.statusMetrics,
        },
      ];
    };

    handleSort = async (column) => {
      this.searchEngineListViewModel.getPages(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.searchEngineListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSearch = async (search) => {
      this.searchEngineListViewModel.getPages(
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
      console.log('teste', this.searchEngineListViewModel?.channelTableData?.list);
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_search_engines')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <Row className="mb-24 ChartWrapper">
            <Col lg={12}>
              <OverviewComponent
                bars={['visits']}
                barColors={['#0066FF']}
                isSelection={false}
                listViewModel={this.searchEngineListViewModel}
                status={this.searchEngineListViewModel?.statusOverview}
                data={this.searchEngineListViewModel?.visitsData?.toAreaChart()}
                filterData={this.searchEngineListViewModel?.visitsData?.getFilterName()}
              />
            </Col>
          </Row>
          <OutlinkTable
            listViewModel={this.searchEngineListViewModel}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            {...this.props}
          />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withSearchEngineViewModel(SearchEnginePage)));
