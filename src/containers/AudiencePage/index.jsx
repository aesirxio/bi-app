// import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from 'components/DateRangePicker';
import OverviewComponent from './Component/Overview';
import CardComponent from './Component/Card';
import VisitorStore from 'store/VisitorStore/VisitorStore';
import SummaryStore from 'store/SummaryStore/SummaryStore';
import DashboardStore from 'containers/Dashboard/DashboardStore/DashboardStore';
import BiStore from 'store/BiStore/BiStore';
import DashboardViewModel from 'containers/Dashboard/DashboardViewModels/DashboardViewModel';
import {
  DashboardViewModelContext,
  DashboardViewModelContextProvider,
} from 'containers/Dashboard/DashboardViewModels/DashboardViewModelContextProvider';

const summaryStore = new SummaryStore();

const visitorStore = new VisitorStore();
const dashboardStore = new DashboardStore();
const biStore = new BiStore();

const dashboardViewModel = new DashboardViewModel(
  dashboardStore,
  visitorStore,
  summaryStore,
  biStore
);
const AudiencePage = observer(
  class AudiencePage extends Component {
    constructor(props) {
      super(props);
      this.state = { loading: false };
    }

    render() {
      const { t } = this.props;
      // const listNewUser = [
      //   { email: 'phu.tran@r-digital.tech', status: 'Active' },
      //   { email: 'babila@gmail.com', status: 'Waiting' },
      //   { email: 'babila@gmail.com', status: 'Active' },
      //   { email: 'babila@gmail.com', status: 'Active' },
      //   { email: 'babila@gmail.com', status: 'Waiting' },
      //   { email: 'babila@gmail.com', status: 'Active' },
      //   { email: 'babila@gmail.com', status: 'Active' },
      //   { email: 'babila@gmail.com', status: 'Waiting' },
      // ];
      return (
        <DashboardViewModelContextProvider viewModel={dashboardViewModel}>
          <div className="p-3">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_audience')}</h2>
                <p className="mb-0 text-color">{t('txt_analytic_details')}</p>
              </div>
              <div className="position-relative">
                <DashboardViewModelContext.Consumer>
                  {({ visitorListViewModel, summaryListViewModel }) => {
                    return (
                      <DateRangePicker
                        viewModelArr={[visitorListViewModel, summaryListViewModel]}
                      />
                    );
                  }}
                </DashboardViewModelContext.Consumer>
              </div>
            </div>

            <Row className="mb-24">
              <Col lg={9}>
                <OverviewComponent />
              </Col>
              {/* <Col lg={3}>
                <div className="bg-white h-100 rounded-3 shadow-sm py-3 px-24">
                  <h5 className="mb-24 text-blue-0">{t('txt_new_registered_users')}</h5>
                  {listNewUser &&
                    listNewUser.map((item, index) => {
                      let color = item.status === 'Active' ? '#3EAD8A' : '#F59E0B';
                      let backgroundColor = item.status === 'Active' ? '#D0F4E8' : '#FFEAC8';
                      return (
                        <div
                          key={index}
                          className="d-flex justify-content-between mt-24 text-color"
                        >
                          {item.email}
                          <span
                            style={{ color: color, backgroundColor: backgroundColor }}
                            className="d-block rounded-pill px-1 py-sm fs-12 fw-semibold"
                          >
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </Col> */}
            </Row>
            <Row>
              <Col lg={9}>
                <CardComponent />
              </Col>
              {/* <Col lg={3}>
                <PieChart
                  height={300}
                  chartTitle={t('txt_visitors')}
                  data={[
                    { name: 'Smart', value: 400 },
                    { name: 'Stupid', value: 600 },
                  ]}
                  colors={['#1AB394', '#1A73E8']}
                  legendPosition="bottom"
                />
              </Col> */}
            </Row>
          </div>
        </DashboardViewModelContextProvider>
      );
    }
  }
);
export default withTranslation('common')(AudiencePage);
