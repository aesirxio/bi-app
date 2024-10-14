import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withPlatformsViewModel } from '../PlatformsViewModel/PlatformsViewModelContextProvider';
import { Tab } from 'react-bootstrap';
import PAGE_STATUS from '../../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { env } from 'aesirx-lib';
import { BiViewModelContext } from '../../../store/BiStore/BiViewModelContextProvider';
import TopTable from 'containers/VisitorsPage/Component/TopTable';

const Isps = observer(
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

    handleSortIsps = async (column) => {
      this.platformsListViewModel.getIsps(
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
            this.platformsListViewModel?.sortByBrowsers['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    render() {
      const { t } = this.props;
      const { statusTopBrowser, ispsTableData } = this.platformsListViewModel;

      return (
        <div className="position-relative ChartWrapper h-100 d-flex flex-column">
          {statusTopBrowser === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {ispsTableData ? (
                <>
                  <Tab.Container id="countries-tab" defaultActiveKey="browser">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="me-24 mb-0 fw-semibold fs-5">Isps</h4>
                    </div>
                    <Tab.Content className="h-100">
                      <Tab.Pane eventKey="browser" className="h-100">
                        <div className="h-100 d-flex flex-column">
                          <TopTable
                            data={ispsTableData.list}
                            pagination={ispsTableData.pagination}
                            isPagination={true}
                            simplePagination={true}
                            selectPage={async (value) => {
                              await this.platformsListViewModel.handleFilterIsps({
                                page: value,
                              });
                            }}
                            selectPageSize={async (value) => {
                              await this.platformsListViewModel.handleFilterIsps({
                                page: 1,
                                page_size: value,
                              });
                            }}
                            status={this.platformsListViewModel?.statusTopBrowser}
                            sortAPI={true}
                            handleSort={this.handleSortIsps}
                            sortBy={this.platformsListViewModel?.sortByIsps}
                            tableClass={'table'}
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
                    <h4 className="me-24 mb-0 fw-semibold">Isps</h4>
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
export default withTranslation()(withRouter(withPlatformsViewModel(Isps)));
