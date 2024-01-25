import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withFlowListViewModel } from './FlowListViewModels/FlowListViewModelContextProvider';
import { observer } from 'mobx-react';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import GeoChart from '../../components/GeoChart';
import { Col, Row } from 'react-bootstrap';
import DateRangePicker from '../../components/DateRangePicker';
import PAGE_STATUS from '../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import FlowListTable from './Component/FlowListTable';
import ComponentNoData from '../../components/ComponentNoData';
import { env } from 'aesirx-lib';
import 'flag-icons/sass/flag-icons.scss';

const FlowList = observer(
  class FlowList extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.flowListListViewModel = this.viewModel
        ? this.viewModel.getFlowListListViewModel()
        : null;
    }

    componentDidUpdate = (prevProps) => {
      if (this.props.location !== prevProps.location && !this.props.integration) {
        this.flowListListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'with[]': 'events',
        });
      }

      if (this.props.activeDomain !== prevProps.activeDomain && this.props.integration) {
        this.flowListListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
          'with[]': 'events',
        });
      }
    };

    componentDidMount = () => {
      this.flowListListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
        'with[]': 'events',
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.flowListListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortFlowList = async (column) => {
      this.flowListListViewModel.getFlowList(
        {
          'filter[domain]': this.props.domain,
          'with[]': 'events',
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.flowListListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };
    render() {
      const { t } = this.props;
      const { status } = this.flowListListViewModel;
      return (
        <>
          <div className="py-4 px-4 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
              <div className="position-relative">
                <h2 className="fw-bold mb-8px">{t('txt_user_experience')}</h2>
                <p className="mb-0">{t('txt_analytic_details')}</p>
              </div>
              <div className="position-relative">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <div className="position-relative ChartWrapper">
              {status === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : this.flowListListViewModel?.countriesTableData?.list ? (
                <FlowListTable
                  data={this.flowListListViewModel?.countriesTableData?.list}
                  pagination={this.flowListListViewModel?.countriesTableData?.pagination}
                  selectPage={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList({ page: value });
                  }}
                  selectPageSize={async (value) => {
                    await this.flowListListViewModel.handleFilterFlowList({
                      page: 1,
                      page_size: value,
                    });
                  }}
                  status={status}
                  sortAPI={true}
                  handleSort={this.handleSortFlowList}
                  sortBy={this.flowListListViewModel?.sortBy}
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
export default withTranslation()(withRouter(withFlowListViewModel(FlowList)));
