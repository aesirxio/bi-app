import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withFlowListViewModel } from './FlowListViewModels/FlowListViewModelContextProvider';
import { observer } from 'mobx-react';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import DateRangePicker from '../../components/DateRangePicker';
import PAGE_STATUS from '../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import FlowListTable from './Component/FlowListTable';
import ComponentNoData from '../../components/ComponentNoData';
import { BI_FLOW_LIST_FIELD_KEY, env } from 'aesirx-lib';
import 'flag-icons/sass/flag-icons.scss';
import queryString from 'query-string';
import { Col, Row } from 'react-bootstrap';
import { AesirXSelect } from 'aesirx-uikit';
import OverviewComponent from './Component/Overview';

const FlowList = observer(
  class FlowList extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.flowListListViewModel = this.viewModel
        ? this.viewModel.getFlowListListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
    }

    componentDidUpdate = (prevProps) => {
      if (this.props.location !== prevProps.location && !this.props.integration) {
        this.flowListListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'with[]': 'events',
          ...(this.params?.pagination && { page: this.params?.pagination }),
        });
      }

      if (this.props.activeDomain !== prevProps.activeDomain && this.props.integration) {
        this.flowListListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'with[]': 'events',
          ...(this.params?.pagination && { page: this.params?.pagination }),
        });
      }
    };

    componentDidMount = () => {
      this.flowListListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
        'with[]': 'events',
        ...(this.params?.pagination && { page: this.params?.pagination }),
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.flowListListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortFlowList = async (column) => {
      this.flowListListViewModel.getFlowList(
        {
          'filter[domain]': this.props.activeDomain,
          'with[]': 'events',
        },
        {},
        {
          'sort[]': column?.id === BI_FLOW_LIST_FIELD_KEY.GEO ? 'geo.country.name' : column?.id,
          'sort_direction[]':
            this.flowListListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    onSelectionChange = async (data) => {
      await this.flowListListViewModel.getFlowList({
        'filter[domain]': this.props.activeDomain,
        'filter_not[device]': data?.value,
      });
    };
    onSelectionChangeEvent = async (data) => {
      console.log('this.props', this.props);
      await this.flowListListViewModel.getFlowList({
        'filter[domain]': this.props.activeDomain,
        'filter[event_name]': data?.value,
      });
    };
    render() {
      const { t } = this.props;
      const { status } = this.flowListListViewModel;
      return (
        <>
          <div className="py-4 px-4 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
              <div className="position-relative">
                <h2 className="fw-bold mb-3 mt-3">{t('txt_user_experience')}</h2>
              </div>
              <div className="position-relative">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <Row className="mb-24 ChartWrapper">
              <Col lg={12}>
                <OverviewComponent
                  bars={['event', 'conversion']}
                  barColors={['#0066FF', '#96C0FF']}
                  listViewModel={this.flowListListViewModel}
                  status={this.flowListListViewModel?.statusChart}
                  data={this.flowListListViewModel?.eventDateData?.toAreaChart()}
                  filterData={this.flowListListViewModel?.eventDateData?.getFilterName()}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg="2">
                <AesirXSelect
                  defaultValue={{ label: 'Include Bot', value: 'all' }}
                  options={[
                    { label: 'Include Bot', value: 'all' },
                    { label: 'Exclude Bot', value: 'bot' },
                  ]}
                  className={`fs-sm`}
                  isBorder={true}
                  onChange={(data) => {
                    this.onSelectionChange(data);
                  }}
                  plColor={'#808495'}
                  isSearchable={false}
                />
              </Col>
              {this.flowListListViewModel?.dataEvents?.toEventsList()?.length && (
                <Col lg="2">
                  <AesirXSelect
                    defaultValue={{ label: 'All Event', value: 'all' }}
                    options={this.flowListListViewModel?.dataEvents?.toEventsList()}
                    className={`fs-sm`}
                    isBorder={true}
                    onChange={(data) => {
                      this.onSelectionChangeEvent(data);
                    }}
                    plColor={'#808495'}
                    isSearchable={false}
                  />
                </Col>
              )}
              {this.flowListListViewModel?.dataConversion?.toEventsList()?.length && (
                <Col lg="2">
                  <AesirXSelect
                    defaultValue={{ label: 'All Conversion', value: 'all' }}
                    options={this.flowListListViewModel?.dataConversion?.toEventsList()}
                    className={`fs-sm`}
                    isBorder={true}
                    onChange={(data) => {
                      this.onSelectionChangeEvent(data);
                    }}
                    plColor={'#808495'}
                    isSearchable={false}
                  />
                </Col>
              )}
            </Row>
            <div className="position-relative ChartWrapper">
              {status === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : this.flowListListViewModel?.countriesTableData?.list ? (
                <FlowListTable
                  data={this.flowListListViewModel?.countriesTableData?.list?.toFlowListTable(
                    this.props.integration
                  )}
                  pagination={this.flowListListViewModel?.countriesTableData?.pagination}
                  selectPage={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={status}
                  sortAPI={true}
                  handleSort={this.handleSortFlowList}
                  sortBy={this.flowListListViewModel?.sortBy}
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
        </>
      );
    }
  }
);
export default withTranslation()(withRouter(withFlowListViewModel(FlowList)));
