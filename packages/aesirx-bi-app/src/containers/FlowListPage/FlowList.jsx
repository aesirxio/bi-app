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
import { Col, Row, Form } from 'react-bootstrap';
import { AesirXSelect } from 'aesirx-uikit';
import OverviewComponent from './Component/Overview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

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
        this.flowListListViewModel.initialize(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
            'with[]': 'events',
            ...(this.params?.pagination && { page: this.params?.pagination }),
          },
          {},
          {
            ...(this.params['sort[]']
              ? { 'sort[]': this.params['sort[]'] }
              : { 'sort[]': 'start' }),
            ...(this.params['sort_direction[]']
              ? {
                  'sort_direction[]': this.params['sort_direction[]'],
                }
              : { 'sort_direction[]': 'desc' }),
            ...(this.params['filter[event_name]'] && {
              'filter[event_name]': this.params['filter[event_name]'],
            }),
            ...(this.params['filter[url]'] && { 'filter[url]': this.params['filter[url]'] }),
            ...(this.params['filter[device]'] && {
              'filter[device]': this.params['filter[device]'],
            }),
          },
          this.props.integration
        );
      }

      if (this.props.activeDomain !== prevProps.activeDomain && this.props.integration) {
        this.flowListListViewModel.initialize(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
            'with[]': 'events',
          },
          {},
          {
            ...(this.params['sort[]']
              ? { 'sort[]': this.params['sort[]'] }
              : { 'sort[]': 'start' }),
            ...(this.params['sort_direction[]']
              ? {
                  'sort_direction[]': this.params['sort_direction[]'],
                }
              : { 'sort_direction[]': 'desc' }),
            ...(this.params['filter[event_name]'] && {
              'filter[event_name]': this.params['filter[event_name]'],
            }),
            ...(this.params['filter[url]'] && { 'filter[url]': this.params['filter[url]'] }),
            ...(this.params['filter[device]'] && {
              'filter[device]': this.params['filter[device]'],
            }),
          },
          this.props.integration
        );
      }
    };

    componentDidMount = () => {
      this.flowListListViewModel.initialize(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'with[]': 'events',
          ...(this.params?.pagination && { page: this.params?.pagination }),
        },
        {},
        {
          ...(this.params['sort[]'] ? { 'sort[]': this.params['sort[]'] } : { 'sort[]': 'start' }),
          ...(this.params['sort_direction[]']
            ? {
                'sort_direction[]': this.params['sort_direction[]'],
              }
            : { 'sort_direction[]': 'desc' }),
          ...(this.params['filter[event_name]'] && {
            'filter[event_name]': this.params['filter[event_name]'],
          }),
          ...(this.params['filter[url]'] && { 'filter[url]': this.params['filter[url]'] }),
          ...(this.params['filter[device]'] && { 'filter[device]': this.params['filter[device]'] }),
        },
        this.props.integration
      );
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
        },
        this.props.integration
      );
    };

    onSelectionChange = async (data) => {
      await this.flowListListViewModel.getFlowList(
        {
          'filter[domain]': this.props.activeDomain,
          'filter_not[device]': data?.value ? 'all' : 'bot',
        },
        {},
        {},
        this.props.integration
      );
      this.flowListListViewModel.toggleShowbot();
    };
    onSelectionChangeEvent = async (data) => {
      await this.flowListListViewModel.getFlowList(
        {
          'filter[domain]': this.props.activeDomain,
          'filter[event_name]': data?.value,
        },
        {},
        {},
        this.props.integration
      );
    };

    debouncedChangeHandler = _.debounce(async (value) => {
      await this.flowListListViewModel.getFlowList(
        {
          'filter[domain]': this.props.activeDomain,
          'filter[url]': value.target?.value
            ? `https://${this.context.biListViewModel.activeDomain}/${value.target?.value}`
            : 'clearDataFilter',
        },
        {},
        {},
        this.props.integration
      );
    }, 400);

    render() {
      const { t } = this.props;
      const { statusTable } = this.flowListListViewModel;
      return (
        <>
          <div className="py-4 px-4 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
              <div className="position-relative">
                <h2 className="fw-bold mb-3 mt-3">{t('txt_user_experience')}</h2>
              </div>
              <div className="position-relative havePrintButton">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <Row className="mb-24 ChartWrapper">
              <Col lg={12}>
                <OverviewComponent
                  bars={['event', 'conversion', 'pageview']}
                  barColors={['#0066FF', '#96C0FF', '#2C94EA']}
                  listViewModel={this.flowListListViewModel}
                  status={this.flowListListViewModel?.statusChart}
                  data={this.flowListListViewModel?.eventDateData?.toAreaChart()}
                  filterData={this.flowListListViewModel?.eventDateData?.getFilterName()}
                />
              </Col>
            </Row>
            <Row className="mb-2">
              {this.flowListListViewModel?.dataEvents?.toEventsList()?.length && (
                <Col lg="2" className="mb-2 mb-lg-0">
                  <AesirXSelect
                    defaultValue={
                      this.params['filter[event_name]']
                        ? {
                            label: this.params['filter[event_name]'],
                            value: this.params['filter[event_name]'],
                          }
                        : { label: 'All Events', value: 'all' }
                    }
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
              {this.flowListListViewModel?.dataConversion?.toConversionList()?.length && (
                <Col lg="2" className="mb-2 mb-lg-0">
                  <AesirXSelect
                    defaultValue={{ label: 'All Conversions', value: 'all' }}
                    options={this.flowListListViewModel?.dataConversion?.toConversionList()}
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
              <Col lg="6" className="mb-2 mb-lg-0">
                <span className="search_url d-flex position-relative border rounded-2">
                  <div className="px-2 bg-gray-400 d-flex align-items-center text-nowrap">
                    https://{this.context.biListViewModel.activeDomain}/
                  </div>
                  <input
                    placeholder={t('txt_search_url')}
                    onChange={this.debouncedChangeHandler}
                    className="form-control pe-2 pe-4 fs-14 border-0 shadow-none p-2"
                  />
                  <i className="text-green position-absolute top-0 bottom-0 end-0 pe-24 d-flex align-items-center">
                    <FontAwesomeIcon icon={faSearch} />
                  </i>
                </span>
              </Col>
              <Col lg="2" className="d-flex justify-content-lg-end align-items-center">
                <Form>
                  <div key={`bot-checkbox`}>
                    <Form.Check o className="mb-0" type={'checkbox'} id={`bot-checkbox`}>
                      <Form.Check.Input
                        checked={this.flowListListViewModel.isShowbot}
                        onClick={() => {
                          this.onSelectionChange({ value: !this.flowListListViewModel.isShowbot });
                        }}
                        type={'checkbox'}
                      />
                      <Form.Check.Label>Show bot</Form.Check.Label>
                    </Form.Check>
                  </div>
                </Form>
              </Col>
            </Row>
            <div className="position-relative ChartWrapper">
              {statusTable === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : this.flowListListViewModel?.countriesTableData?.list ? (
                <FlowListTable
                  data={this.flowListListViewModel?.countriesTableData?.list?.toFlowListTable(
                    this.props.integration
                  )}
                  pagination={this.flowListListViewModel?.countriesTableData?.pagination}
                  selectPage={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList(
                      { page: value },
                      this.props.integration
                    );
                  }}
                  selectPageSize={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList(
                      {
                        page: 1,
                        page_size: value,
                      },
                      this.props.integration
                    );
                  }}
                  status={statusTable}
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
