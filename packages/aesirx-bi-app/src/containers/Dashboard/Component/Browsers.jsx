import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withDashboardViewModel } from '../DashboardViewModels/DashboardViewModelContextProvider';
import { Col, Row } from 'react-bootstrap';
import PAGE_STATUS from '../../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { BI_BROWSERS_FIELD_KEY, BI_SUMMARY_FIELD_KEY, env } from 'aesirx-lib';
import { BiViewModelContext } from '../../../store/BiStore/BiViewModelContextProvider';

const Browsers = observer(
  class Browsers extends Component {
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
              <div className="d-flex align-items-center justify-content-between mb-24">
                <h4 className="me-24 mb-0 fw-semibold">{t('txt_browser')}</h4>
              </div>
              {this.dashboardListViewModel?.browsersData?.data?.length ? (
                <Row className="align-items-center">
                  <Col lg={12}>
                    <div className="d-flex align-items-center justify-content-between text-gray fw-semibold pb-1 mb-15 text-uppercase border-bottom">
                      <div>{t('txt_browser')}</div>
                      <div>{t('txt_views')}</div>
                    </div>
                    {this.dashboardListViewModel?.browsersData?.data?.map((item, key) => {
                      return (
                        <div
                          key={key}
                          className="d-flex align-items-center justify-content-between mb-15 fs-14 text-gray-900"
                        >
                          <div className="d-flex align-items-center">
                            <span>{item[BI_BROWSERS_FIELD_KEY.BROWSER_NAME]}</span>
                          </div>
                          <div>{item[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]}</div>
                        </div>
                      );
                    })}
                  </Col>
                </Row>
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
export default withTranslation()(withRouter(withDashboardViewModel(Browsers)));
