import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRealTimeViewModel } from './RealTimeViewModels/RealTimeViewModelContextProvider';
import { observer } from 'mobx-react';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import PAGE_STATUS from '../../constants/PageStatus';
import { RingLoaderComponent, Image } from 'aesirx-uikit';
import RealTimeTable from './Component/RealTimeTable';
import ComponentNoData from '../../components/ComponentNoData';
import { BI_SUMMARY_FIELD_KEY, BI_DEVICES_FIELD_KEY, env, Helper } from 'aesirx-lib';
import 'flag-icons/sass/flag-icons.scss';
import queryString from 'query-string';
import { Col, Row, Spinner } from 'react-bootstrap';
import { AesirXSelect } from 'aesirx-uikit';
import _ from 'lodash';
const RealTime = observer(
  class RealTime extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.realTimeListViewModel = this.viewModel
        ? this.viewModel.getRealTimeListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
      this.realtimeInterval = null;
    }

    loadRealTimeData = async (isReload) => {
      if (
        (this.realTimeListViewModel?.realtimeTableData?.pagination?.page === 1 &&
          this.realTimeListViewModel?.realtimeTableData?.pagination?.page_size === 20) ||
        !isReload
      ) {
        this.realTimeListViewModel.initialize(
          {
            ...this.context.biListViewModel.activeDomain
              ?.map((value, index) => ({
                [`filter[domain][${index + 1}]`]: value,
              }))
              ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
          },
          isReload
        );
      }
      Promise.all([
        this.realTimeListViewModel.getLiveVisitorsTotal(
          this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          isReload
        ),
        this.realTimeListViewModel.getLiveVisitorsDevice(
          this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          isReload
        ),
      ]);
    };
    componentDidMount = () => {
      this.loadRealTimeData(false);
      try {
        this.realtimeInterval = setInterval(async () => {
          this.loadRealTimeData(true);
        }, 15000);
      } catch (e) {
        console.log(e);
      }
    };

    componentWillUnmount() {
      if (this.realtimeInterval) {
        clearInterval(this.realtimeInterval);
        this.realtimeInterval = null;
      }
    }

    render() {
      const { t } = this.props;
      const { statusTable } = this.realTimeListViewModel;
      const realTimeSyncArr = [
        { label: 'Last 1 minutes', value: 1 },
        { label: 'Last 5 minutes', value: 5 },
        { label: 'Last 15 minutes', value: 15 },
        { label: 'Last 30 minutes', value: 30 },
      ];
      return (
        <>
          <div className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap w-100">
              <div className="position-relative">
                <h2 className="fw-medium mb-3 mt-3">Real-Time Visitors</h2>
              </div>
            </div>
            <div className="d-inline-flex align-items-center justify-content-start bg-white rounded py-2 px-24 mb-3">
              <div className="me-3">Time window: </div>
              <div className="position-relative">
                {this.realTimeListViewModel?.formSelectTimeStatus === PAGE_STATUS.LOADING ? (
                  <div className="position-absolute start-50 top-50 translate-middle z-1 opacity-50 bg-white w-100 h-100 d-flex align-items-center justify-content-center">
                    <Spinner size="sm" variant="success" className="fs-6" />
                  </div>
                ) : (
                  <></>
                )}
                <AesirXSelect
                  options={realTimeSyncArr}
                  className="border rounded-1"
                  onChange={async (data) => {
                    await this.realTimeListViewModel.updateConsentsTemplate({
                      domain: this.context.biListViewModel.activeDomain[0],
                      realtime_sync: data?.value,
                    });
                    this.context.biListViewModel.dataStream.realtime_sync = data?.value;
                    await this.loadRealTimeData(false);
                  }}
                  value={
                    this.context.biListViewModel.dataStream?.realtime_sync
                      ? realTimeSyncArr?.find(
                          (e) => e.value === this.context.biListViewModel.dataStream?.realtime_sync
                        )
                      : {
                          label: 'Last 5 minutes',
                          value: 5,
                        }
                  }
                />
              </div>
            </div>
            <Row className="mb-24">
              <Col lg={3}>
                <div className="bg-white shadow-sm rounded-3 h-100">
                  <div className="bg-white border-bottom">
                    <div className="bg-dark-blue text-white p-24 rounded-3 fw-medium d-flex align-items-center justify-content-between">
                      <h5 className="fs-6 mb-0 fw-medium">{t('txt_real_time_active_users')}</h5>
                      <div className="fs-1 position-relative">
                        {this.realTimeListViewModel?.statusLiveVisitorsTotal ===
                        PAGE_STATUS.LOADING ? (
                          <Spinner size="sm" variant="success" className="fs-6" />
                        ) : (
                          Helper.numberWithCommas(this.realTimeListViewModel.liveVisitorsTotalData)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {this.realTimeListViewModel.liveVisitorsDeviceData?.map((device, index) => {
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
                  <Col
                    lg={3}
                    className={` ${
                      index !== this.realTimeListViewModel.liveVisitorsDeviceData?.length - 1
                        ? 'border-bottom'
                        : ''
                    }`}
                    key={index}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100 h-100 mb-12px py-3 bg-white rounded-3 px-24">
                      <div className="d-flex align-items-center">
                        <Image
                          className={`me-12px`}
                          style={{ width: 44, height: 44 }}
                          src={imgIcon}
                          alt={'icons'}
                        />
                        <div className="fw-medium text-capitalize">
                          {device[BI_DEVICES_FIELD_KEY?.DEVICE]
                            ? device[BI_DEVICES_FIELD_KEY?.DEVICE]
                            : 'Unknown'}
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        {this.realTimeListViewModel?.statusLiveVisitorsList ===
                        PAGE_STATUS.LOADING ? (
                          <Spinner size="sm" variant="success" />
                        ) : (
                          <>
                            {
                              <div className="fs-sm me-12px text-gray-900">
                                {(
                                  (device[BI_SUMMARY_FIELD_KEY?.NUMBER_OF_VISITORS] /
                                    this.realTimeListViewModel.liveVisitorsDeviceData.reduce(
                                      (a, b) => +a + +b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS],
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
                  </Col>
                );
              })}
            </Row>
            <div className="position-relative ChartWrapper">
              {statusTable === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : this.realTimeListViewModel?.realtimeTableData?.list ? (
                <RealTimeTable
                  data={this.realTimeListViewModel?.realtimeTableData?.list?.toRealTimeTable(
                    this.props.integration,
                    this.context.biListViewModel.dataStream?.utm_currency
                  )}
                  pagination={this.realTimeListViewModel?.realtimeTableData?.pagination}
                  selectPage={async (value) => {
                    await this.realTimeListViewModel.handleFilterRealTime(
                      { page: value },
                      this.props.integration
                    );
                  }}
                  selectPageSize={async (value) => {
                    await this.realTimeListViewModel.handleFilterRealTime(
                      {
                        page: 1,
                        page_size: value,
                      },
                      this.props.integration
                    );
                  }}
                  status={statusTable}
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
export default withTranslation()(withRouter(withRealTimeViewModel(RealTime)));
