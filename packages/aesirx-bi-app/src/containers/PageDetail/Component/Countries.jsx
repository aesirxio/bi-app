import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withPageDetailViewModel } from '../PageDetailViewModels/PageDetailViewModelContextProvider';
import GeoChart from '../../../components/GeoChart';
import { Col, Row, Tab } from 'react-bootstrap';
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
      this.pageDetailListViewModel = this.viewModel
        ? this.viewModel.getPageDetailListViewModel()
        : null;
    }

    render() {
      const { t } = this.props;
      const { status } = this.pageDetailListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100">
          {status === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {this.pageDetailListViewModel?.countriesData?.length ? (
                <>
                  <Tab.Container id="countries-tab" defaultActiveKey="map">
                    <div className="d-flex justify-content-between align-items-center mb-24">
                      <h4 className="me-24 mb-0 fw-semibold fs-5">{t('txt_Country')}</h4>
                    </div>
                    <Row>
                      <Col lg="7">
                        <GeoChart
                          data={this.pageDetailListViewModel?.countriesData}
                          continent={'world'}
                        />
                      </Col>
                      <Col lg="5">
                        <div className="d-flex align-items-center justify-content-between text-gray-900 fw-medium pb-1 mb-15 border-bottom">
                          <div>{t('txt_Country')}</div>
                          <div>{t('txt_views')}</div>
                        </div>
                        {this.pageDetailListViewModel?.countriesData?.map((item, key) => {
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
                      </Col>
                    </Row>
                  </Tab.Container>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-24">
                    <h4 className="me-24 mb-0 fw-semibold">{t('txt_locations')}</h4>
                  </div>
                  <ComponentNoData
                    icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                    title={t('txt_no_data')}
                    width="w-50"
                  />
                </>
              )}
            </>
          )}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withPageDetailViewModel(Countries)));
