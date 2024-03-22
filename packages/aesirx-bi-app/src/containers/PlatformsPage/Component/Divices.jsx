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

const Divices = observer(
  class Divices extends Component {
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

    render() {
      const { t } = this.props;
      const { statusTopBrowser, devicesTableData } = this.platformsListViewModel;
      return (
        <div className="position-relative ChartWrapper h-100">
          {statusTopBrowser === PAGE_STATUS.LOADING ? (
            <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
          ) : (
            <>
              {devicesTableData?.list?.data?.length ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="me-24 mb-0 fw-semibold fs-5">{t('txt_devices')}</h4>
                  </div>
                  <div className="h-100">
                    <div className="browser-table">
                      <TopTable
                        data={devicesTableData?.list}
                        pagination={devicesTableData?.pagination}
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
                        status={statusTopBrowser}
                        sortAPI={true}
                        handleSort={this.handleSortDevices}
                        sortBy={this.platformsListViewModel?.sortByDevices}
                        {...this.props}
                      />
                    </div>
                  </div>
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
export default withTranslation()(withRouter(withPlatformsViewModel(Divices)));
