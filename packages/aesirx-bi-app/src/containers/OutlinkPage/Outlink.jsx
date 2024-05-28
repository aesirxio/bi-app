import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import { withRouter } from 'react-router-dom';
import { withOutlinkViewModel } from './OutlinkViewModels/OutlinkViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import queryString from 'query-string';
import OutlinkTable from './Component/OutlinkTable';

const OutlinkPage = observer(
  class OutlinkPage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.outlinkListViewModel = this.viewModel ? this.viewModel.getOutlinkListViewModel() : null;
      this.params = queryString.parse(props.location.search);
    }
    componentDidMount = () => {
      this.outlinkListViewModel.initialize(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        { ...(this.params?.pagination && { page: this.params?.pagination }) }
      );
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.outlinkListViewModel.initialize(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
          },
          {},
          { ...(this.params?.pagination && { page: this.params?.pagination }) }
        );
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.outlinkListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSort = async (column) => {
      this.outlinkListViewModel.getOutlink(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.outlinkListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSearch = async (search) => {
      this.outlinkListViewModel.getPages(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {},
        { 'filter[url]': search }
      );
    };

    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_outlinks')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <OutlinkTable
            listViewModel={this.outlinkListViewModel}
            handleSort={this.handleSort}
            handleSearch={this.handleSearch}
            {...this.props}
          />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withOutlinkViewModel(OutlinkPage)));
