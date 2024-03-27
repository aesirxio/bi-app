import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withPageDetailViewModel } from '../PageDetailViewModels/PageDetailViewModelContextProvider';
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
      this.pageDetailListViewModel = this.viewModel
        ? this.viewModel.getPageDetailListViewModel()
        : null;
    }

    handleSortDevices = async (column) => {
      this.pageDetailListViewModel.getDevices(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.pageDetailListViewModel?.sortByDevices['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSortBrowsers = async (column) => {
      this.pageDetailListViewModel.getBrowsers(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.pageDetailListViewModel?.sortByBrowsers['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    render() {
      const { t } = this.props;
      const { status } = this.pageDetailListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100">
          {status === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {this.pageDetailListViewModel?.browsersData?.list?.data?.length ? (
                <>
                  <Tab.Container id="countries-tab" defaultActiveKey="browser">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="me-24 mb-0 fw-semibold fs-5">
                        {`${t('txt_browser')} / ${t('txt_devices')}`}
                      </h4>
                      <Nav variant="pills" className="nav-custom">
                        <Nav.Item>
                          <Nav.Link eventKey="browser" className="ps-0">
                            {t('txt_browser')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="types" className="ps-0">
                            {t('txt_devices')}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                    <Tab.Content className="h-100">
                      <Tab.Pane eventKey="browser">
                        <div className="browser-table">
                          <TopTable
                            data={this.pageDetailListViewModel?.browsersData?.list}
                            pagination={this.pageDetailListViewModel?.browsersData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.pageDetailListViewModel.handleFilterBrowsers({
                                page: value,
                              });
                            }}
                            selectPageSize={async (value) => {
                              await this.pageDetailListViewModel.handleFilterBrowsers({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.pageDetailListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortBrowsers}
                            sortBy={this.pageDetailListViewModel?.sortByBrowsers}
                            {...this.props}
                          />
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="types">
                        <div className="browser-table">
                          <TopTable
                            data={this.pageDetailListViewModel?.devicesTableData?.list}
                            pagination={this.pageDetailListViewModel?.devicesTableData?.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.pageDetailListViewModel.handleFilterPages({ page: value });
                            }}
                            selectPageSize={async (value) => {
                              await this.pageDetailListViewModel.handleFilterPages({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.pageDetailListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortDevices}
                            sortBy={this.pageDetailListViewModel?.sortByDevices}
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
export default withTranslation()(withRouter(withPageDetailViewModel(Browsers)));
