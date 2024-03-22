import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withPlatformsViewModel } from '../PlatformsViewModel/PlatformsViewModelContextProvider';
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
      this.platformsListViewModel = this.viewModel
        ? this.viewModel.getPlatformsListViewModel()
        : null;
    }

    handleSortDevices = async (column) => {
      this.platformsListViewModel.getDevices(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.platformsListViewModel?.sortByDevices['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSortBrowsers = async (column) => {
      this.platformsListViewModel.getBrowsers(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.platformsListViewModel?.sortByBrowsers['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSortIsps = async (column) => {
      this.platformsListViewModel.getIsps(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.platformsListViewModel?.sortByBrowsers['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    render() {
      const { t } = this.props;
      const { statusTopBrowser } = this.platformsListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100">
          {statusTopBrowser === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {this.platformsListViewModel?.browsersData?.list?.data?.length ? (
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
                      <Tab.Pane eventKey="browser">
                        <div className="browser-table">
                          <TopTable
                            data={this.platformsListViewModel?.browsersData?.list}
                            pagination={this.platformsListViewModel?.browsersData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.platformsListViewModel.handleFilterBrowsers({
                                page: value,
                              });
                            }}
                            selectPageSize={async (value) => {
                              await this.platformsListViewModel.handleFilterBrowsers({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.platformsListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortBrowsers}
                            sortBy={this.platformsListViewModel?.sortByBrowsers}
                            {...this.props}
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="types">
                        <div className="browser-table">
                          <TopTable
                            data={this.platformsListViewModel?.devicesTableData?.list}
                            pagination={this.platformsListViewModel?.devicesTableData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.platformsListViewModel.handleFilterPages({ page: value });
                            }}
                            selectPageSize={async (value) => {
                              await this.platformsListViewModel.handleFilterPages({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.platformsListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortDevices}
                            sortBy={this.platformsListViewModel?.sortByDevices}
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
export default withTranslation()(withRouter(withPlatformsViewModel(Browsers)));
