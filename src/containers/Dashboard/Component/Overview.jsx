import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AreaChartComponent from 'components/AreaChartComponent';
import { withDashboardViewModel } from 'containers/Dashboard/DashboardViewModels/DashboardViewModelContextProvider';

const OverviewComponent = observer(
  class OverviewComponent extends Component {
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
        <div className="position-relative h-100">
          <AreaChartComponent
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={this?.dashboardListViewModel?.visitorData?.toAreaChart()}
            colors={['#1AB394']}
            lineType="monotone"
            areaColors={['#3BB346', 'pink']}
            lineColors={['#0FC6C2', 'red']}
            lines={['line']}
            isDot
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Visitors', value: 'visitors' }}
            options={[{ label: 'Visitors', value: 'visitors' }]}
            loading={this.dashboardListViewModel.status}
            tooltipComponent={{
              header: t('txt_in_total'),
              value: `visits:`,
            }}
            status={status}
            filterData={this?.dashboardListViewModel?.visitorData?.getFilterName()}
            isSelection={this.props.isSelection}
          />
        </div>
      );
    }
  }
);
export default withTranslation('common')(withRouter(withDashboardViewModel(OverviewComponent)));
