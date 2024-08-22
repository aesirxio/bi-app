import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withFlowListViewModel } from './FlowListViewModels/FlowListViewModelContextProvider';
import { observer } from 'mobx-react';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import DateRangePicker from '../../components/DateRangePicker';
import PAGE_STATUS from '../../constants/PageStatus';
import { RingLoaderComponent, Image } from 'aesirx-uikit';
import FlowListTable from './Component/FlowListTable';
import ComponentNoData from '../../components/ComponentNoData';
import {
  BI_SUMMARY_FIELD_KEY,
  BI_DEVICES_FIELD_KEY,
  BI_FLOW_LIST_FIELD_KEY,
  env,
  Helper,
} from 'aesirx-lib';
import 'flag-icons/sass/flag-icons.scss';
import queryString from 'query-string';
import { Col, Row, Form, Spinner } from 'react-bootstrap';
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
            ...this.context.biListViewModel.activeDomain
              ?.map((value, index) => ({
                [`filter[domain][${index + 1}]`]: value,
              }))
              ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
            ...this.context.biListViewModel.activeDomain
              ?.map((value, index) => ({
                [`filter[domain][${index + 1}]`]: value,
              }))
              ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
      try {
        setInterval(async () => {
          this.flowListListViewModel.isShowlive &&
            (await Promise.all([
              this.flowListListViewModel.getLiveVisitorsTotal(
                this.context.biListViewModel.activeDomain
                  ?.map((value, index) => ({
                    [`filter[domain][${index + 1}]`]: value,
                  }))
                  ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                true
              ),
              this.flowListListViewModel.getLiveVisitorsDevice(
                this.context.biListViewModel.activeDomain
                  ?.map((value, index) => ({
                    [`filter[domain][${index + 1}]`]: value,
                  }))
                  ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
                true
              ),
            ]));
        }, 15000);
      } catch (e) {
        console.log(e);
      }
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.flowListListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortFlowList = async (column) => {
      this.flowListListViewModel.getFlowList(
        {
          ...this.props.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'with[]': 'events',
        },
        {},
        {
          'sort[]':
            column?.id === BI_FLOW_LIST_FIELD_KEY.GEO
              ? 'geo.country.name'
              : column?.id === BI_FLOW_LIST_FIELD_KEY.TRAFFIC
              ? 'device'
              : column?.id,
          'sort_direction[]':
            this.flowListListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        },
        this.props.integration
      );
    };

    onSelectionChange = async (data) => {
      await this.flowListListViewModel.getFlowList(
        {
          ...this.props.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'filter_not[device]': data?.value ? 'all' : 'bot',
          'filter[bad_user]': data?.value ? 'true' : 'false',
        },
        {},
        {},
        this.props.integration
      );
      this.flowListListViewModel.toggleShowbot();
    };
    onSelectionLiveChange = async () => {
      this.flowListListViewModel.toggleShowlive();
      await Promise.all([
        this.flowListListViewModel.getLiveVisitorsTotal(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
          },
          false
        ),
        this.flowListListViewModel.getLiveVisitorsDevice(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
          },
          false
        ),
      ]);
    };
    onSelectionChangeEvent = async (data) => {
      await this.flowListListViewModel.getFlowList(
        {
          ...this.props.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
          ...this.props.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
                <h2 className="fw-medium mb-3 mt-3">{t('txt_user_experience')}</h2>
              </div>
              <div className="position-relative havePrintButton">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <Row className="mb-24 ChartWrapper">
              {this.flowListListViewModel.isShowlive ? (
                <Col lg={4}>
                  <div className="bg-white shadow-sm rounded-3 h-100">
                    <div className="bg-white border-bottom">
                      <div className="bg-dark-blue text-white p-24 rounded-3 rounded-bottom-0 fw-medium d-flex align-items-center justify-content-between">
                        <h5 className="fs-6 mb-0 fw-medium">{t('txt_real_time_active_users')}</h5>
                        <div className="fs-1 position-relative">
                          {this.flowListListViewModel?.statusLiveVisitorsTotal ===
                          PAGE_STATUS.LOADING ? (
                            <Spinner size="sm" variant="success" className="fs-6" />
                          ) : (
                            Helper.numberWithCommas(
                              this.flowListListViewModel.liveVisitorsTotalData
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-3 rounded-top-0 position-relative ChartWrapper">
                      {this.flowListListViewModel?.statusLiveVisitorsList ===
                      PAGE_STATUS.LOADING ? (
                        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
                      ) : (
                        <>
                          <div className="bg-white p-24 rounded-3 rounded-top-0">
                            {this.flowListListViewModel.liveVisitorsDeviceData?.map(
                              (device, index) => {
                                let imgIcon = `${env.PUBLIC_URL}/assets/images/device_mobile.png`;
                                switch (device[BI_DEVICES_FIELD_KEY?.DEVICE]) {
                                  case 'desktop':
                                    imgIcon = `${env.PUBLIC_URL}/assets/images/device_desktop.png`;
                                    break;
                                  case 'iPad':
                                    imgIcon = `${env.PUBLIC_URL}/assets/images/device_tablet.png`;
                                    break;
                                  case 'tablet':
                                    imgIcon = `${env.PUBLIC_URL}/assets/images/device_tablet.png`;
                                    break;
                                }
                                return (
                                  <div
                                    className={`d-flex align-items-center justify-content-between w-100 mb-12px py-3 ${
                                      index !==
                                      this.flowListListViewModel.liveVisitorsDeviceData?.length - 1
                                        ? 'border-bottom'
                                        : ''
                                    }`}
                                    key={index}
                                  >
                                    <div className="d-flex align-items-center">
                                      <Image
                                        className={`me-12px`}
                                        style={{ width: 44, height: 44 }}
                                        src={imgIcon}
                                        alt={'icons'}
                                      />
                                      <div className="fw-medium text-capitalize">
                                        {device[BI_DEVICES_FIELD_KEY?.DEVICE]}
                                      </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      {this.flowListListViewModel?.status ===
                                      PAGE_STATUS.LOADING ? (
                                        <Spinner size="sm" variant="success" />
                                      ) : (
                                        <>
                                          {
                                            <div className="fs-sm me-12px text-gray-900">
                                              {(
                                                (device[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS] /
                                                  this.flowListListViewModel.liveVisitorsDeviceData.reduce(
                                                    (a, b) =>
                                                      +a +
                                                      +b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS],
                                                    0
                                                  )) *
                                                100
                                              )?.toFixed(2)}
                                              %
                                            </div>
                                          }
                                          <div className="fw-medium fs-18px">
                                            {device[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS]}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Col>
              ) : (
                <></>
              )}
              <Col lg={this.flowListListViewModel.isShowlive ? 8 : 12}>
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
              <Col lg="5" className="mb-2 mb-lg-0">
                <span className="search_url d-flex position-relative border rounded-2">
                  <div className="px-2 bg-gray-400 d-flex align-items-center text-nowrap">
                    https://{this.context.biListViewModel.activeDomain[0]}/
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
              <Col lg="3" className="d-flex justify-content-lg-end align-items-center">
                <Form className="d-flex align-items-center">
                  <div className="me-2" key={`bot-checkbox`}>
                    <Form.Check
                      id={`bot-checkbox`}
                      checked={this.flowListListViewModel.isShowbot}
                      onClick={() => {
                        this.onSelectionChange({ value: !this.flowListListViewModel.isShowbot });
                      }}
                      type={'switch'}
                      label={`Show Bot/Bad Traffic`}
                    />
                  </div>
                  <div key={`live-checkbox`}>
                    <Form.Check
                      id={`live-checkbox`}
                      checked={this.flowListListViewModel.isShowlive}
                      onClick={() => {
                        this.onSelectionLiveChange({
                          value: !this.flowListListViewModel.isShowlive,
                        });
                      }}
                      type={'switch'}
                      label={`Show live`}
                    />
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
