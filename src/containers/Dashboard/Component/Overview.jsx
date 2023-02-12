import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AreaChartComponent from 'components/AreaChartComponent';
import { withDashboardViewModel } from 'containers/Dashboard/DashboardViewModels/DashboardViewModelContextProvider';
import { BiViewModelContext } from 'store/BiStore/BiViewModelContextProvider';

const OverviewComponent = observer(
  class OverviewComponent extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.state = { loading: false };
      this.visitorListViewModel = this.viewModel ? this.viewModel.getVisitorListViewModel() : null;
    }
    componentDidMount = async () => {
      await this.visitorListViewModel?.getVisitors({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };

    componentDidUpdate = async (prevProps) => {
      if (prevProps.location !== this.props.location) {
        await this.visitorListViewModel.getVisitors({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };

    render() {
      const { t } = this.props;
      return (
        <div className="position-relative h-100">
          {this?.visitorListViewModel?.data && (
            <AreaChartComponent
              chartTitle={t('txt_menu_overview')}
              height={390}
              data={this?.visitorListViewModel?.data.toAreaChart()}
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
              loading={this.visitorListViewModel.status}
              tooltipComponent={{
                header: t('txt_in_total'),
                value: `visits:`,
              }}
              filterData={this?.visitorListViewModel?.data.getFilterName()}
            />
          )}
        </div>
      );
    }
  }
);
export default withTranslation('common')(withRouter(withDashboardViewModel(OverviewComponent)));
