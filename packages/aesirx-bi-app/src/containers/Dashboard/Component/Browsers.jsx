import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withDashboardViewModel } from '../DashboardViewModels/DashboardViewModelContextProvider';
import { Nav, Tab } from 'react-bootstrap';
import PAGE_STATUS from '../../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { env } from 'aesirx-lib';
import { BiViewModelContext } from '../../../store/BiStore/BiViewModelContextProvider';
import TopTable from 'containers/VisitorsPage/Component/TopTable';

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

    handleSortDevices = async (column) => {
      this.dashboardListViewModel.getDevices(
        {
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.dashboardListViewModel?.sortByDevices['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSortBrowsers = async (column) => {
      this.dashboardListViewModel.getBrowsers(
        {
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.dashboardListViewModel?.sortByBrowsers['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    render() {
      const { t } = this.props;
      const { status } = this.dashboardListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100 d-flex flex-column">
          {status === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {this.dashboardListViewModel?.browsersData?.list?.data?.length ? (
                <>
                  <Tab.Container id="countries-tab" defaultActiveKey="browser">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="me-24 mb-0 fw-semibold fs-5">{t('txt_devices')}</h4>
                      <Nav variant="pills" className="nav-custom">
                        <Nav.Item>
                          <Nav.Link eventKey="browser" className="ps-0">
                            {t('txt_browser')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="types" className="ps-0">
                            {t('txt_types')}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <Tab.Content className="h-100">
                      <Tab.Pane eventKey="browser" className="h-100">
                        <div className="browser-table d-flex flex-column h-100">
                          <TopTable
                            data={this.dashboardListViewModel?.browsersData?.list}
                            pagination={this.dashboardListViewModel?.browsersData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.dashboardListViewModel.handleFilterBrowsers({
                                page: value,
                              });
                            }}
                            selectPageSize={async (value) => {
                              await this.dashboardListViewModel.handleFilterBrowsers({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.dashboardListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortBrowsers}
                            sortBy={this.dashboardListViewModel?.sortByBrowsers}
                            tdClass={'py-1'}
                            {...this.props}
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="types" className="h-100">
                        <div className="browser-table d-flex flex-column h-100">
                          <TopTable
                            data={this.dashboardListViewModel?.devicesTableData?.list}
                            pagination={this.dashboardListViewModel?.devicesTableData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.dashboardListViewModel.handleFilterPages({ page: value });
                            }}
                            selectPageSize={async (value) => {
                              await this.dashboardListViewModel.handleFilterPages({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.dashboardListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortDevices}
                            sortBy={this.dashboardListViewModel?.sortByDevices}
                            tdClass={'py-1'}
                            {...this.props}
                          />
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="me-24 mb-0 fw-semibold">{t('txt_devices')}</h4>
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
export default withTranslation()(withRouter(withDashboardViewModel(Browsers)));
