import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withDashboardViewModel } from '../DashboardViewModels/DashboardViewModelContextProvider';
import GeoChart from '../../../components/GeoChart';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import PAGE_STATUS from '../../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { BI_COUNTRIES_FIELD_KEY, env } from 'aesirx-lib';
import { BiViewModelContext } from '../../../store/BiStore/BiViewModelContextProvider';

const Countries = observer(
  class Countries extends Component {
    static contextType = BiViewModelContext;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.state = { loading: false };
      this.dashboardListViewModel = this.viewModel
        ? this.viewModel.getDashboardListViewModel()
        : null;
    }

    render() {
      const { t } = this.props;
      const { status } = this.dashboardListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100">
          {status === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {/* <a
                  className="fs-14 text-body cursor-pointer"
                  onClick={() => {
                    if (this.props.integration) {
                      this.context.biListViewModel.setIntegrationLink(`region-country`);
                    } else {
                      this.props.history.push(
                        `${this.context.biListViewModel.activeDomain}/region-country`
                      );
                    }
                  }}
                >
                  <span className="pe-1">{t('txt_view_more')}</span>
                  <span
                    className="icon arrow d-inline-block align-text-bottom ms-auto bg-success"
                    style={{
                      WebkitMaskImage: `url(${env.PUBLIC_URL}/assets/images/arrow-right.svg)`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      width: '10px',
                      height: '16px',
                    }}
                  ></span>
                </a> */}
              {this.dashboardListViewModel?.countriesData?.length ? (
                <>
                  <Tab.Container id="countries-tab" defaultActiveKey="map">
                    <div className="d-flex justify-content-between align-items-center mb-24">
                      <h4 className="me-24 mb-0 fw-semibold fs-5">{t('txt_locations')}</h4>
                      <Nav variant="pills" className="nav-custom">
                        <Nav.Item>
                          <Nav.Link eventKey="map" className="ps-0">
                            {t('txt_map')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="countries" className="ps-0">
                            {t('txt_countries')}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <Tab.Content className="h-100">
                      <Tab.Pane eventKey="map">
                        <GeoChart
                          data={this.dashboardListViewModel?.countriesData}
                          continent={'world'}
                        />
                      </Tab.Pane>
                      <Tab.Pane eventKey="countries">
                        <div className="d-flex align-items-center justify-content-between text-gray fw-semibold pb-1 mb-15 text-uppercase border-bottom">
                          <div>{t('txt_Country')}</div>
                          <div>{t('txt_views')}</div>
                        </div>
                        {this.dashboardListViewModel?.countriesData?.map((item, key) => {
                          return (
                            <div
                              key={key}
                              className="d-flex align-items-center justify-content-between mb-15 fs-14 text-gray-900"
                            >
                              <div className="d-flex align-items-center">
                                {/* <span>
                        <ComponentImage className={``} src={item.flag} alt={item.flag} />
                      </span> */}
                                <span>
                                  <span
                                    className={`me-1 fi fi-${item[
                                      BI_COUNTRIES_FIELD_KEY.COUNTRY_CODE
                                    ]?.toLowerCase()}`}
                                  ></span>
                                  {item.country}
                                </span>
                              </div>
                              <div>{item.views}</div>
                            </div>
                          );
                        })}
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </>
              ) : (
                <ComponentNoData
                  icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                  title={t('txt_no_data')}
                  width="w-50"
                />
              )}
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withDashboardViewModel(Countries)));
