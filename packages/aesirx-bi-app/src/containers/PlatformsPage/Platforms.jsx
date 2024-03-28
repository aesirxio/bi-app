import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { BiViewModelContext } from 'store/BiStore/BiViewModelContextProvider';
import { withPlatformsViewModel } from './PlatformsViewModel/PlatformsViewModelContextProvider';
import Browers from './Component/Browers';
import DateRangePicker from 'components/DateRangePicker';
import Isps from './Component/Isps';
import Divices from './Component/Divices';
import { observer } from 'mobx-react';
const Platform = observer(
  class Platform extends Component {
    static contextType = BiViewModelContext;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.viewModel.platformsListViewModel = this.viewModel
        ? this.viewModel.getPlatformsListViewModel()
        : null;
    }

    componentDidMount = () => {
      this.viewModel.platformsListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };

    componentDidUpdate = () => {
      this.viewModel.platformsListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.viewModel.platformsListViewModel.handleFilterDateRange(
        startDate ?? endDate,
        endDate ?? startDate
      );
    };

    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative">
              <h2 className="fw-bold mb-8px">{t('txt_menu_platforms')}</h2>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <div className="row justify-content-center align-items-center g-2 mb-2">
            <div className="col">
              <div className="bg-white p-3 rounded">
                <Browers />
              </div>
            </div>
            <div className="col">
              <div className="bg-white p-3 rounded">
                <Isps />
              </div>
            </div>
          </div>

          <div className="row justify-content-center align-items-center g-2">
            <div className="col">
              <div className="bg-white p-3 rounded">
                <Divices />
              </div>
            </div>
            <div className="col"></div>
          </div>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withPlatformsViewModel(Platform)));
