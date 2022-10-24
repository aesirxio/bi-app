import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import AreaChart from 'components/AreaChartComponent';
import { withVisitorViewModel } from 'store/VisitorStore/VisitorViewModelContextProvider';
import { observer } from 'mobx-react';

const OverviewComponent = observer(
  class OverviewComponent extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.state = { loading: false };
      this.visitorListViewModel = this.viewModel ? this.viewModel.visitorListViewModel : null;
    }
    componentDidMount() {
      let fetchData = async () => {
        await this.visitorListViewModel.getVisitor();
      };
      fetchData();
    }
    render() {
      const { t } = this.props;
      let dataOverview = this.visitorListViewModel
        ? this.visitorListViewModel?.data?.map((item) => {
            return { name: item.date, line: item.visits };
          })
        : [];

      return (
        <div className="position-relative">
          <AreaChart
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={dataOverview}
            colors={['#1AB394']}
            lineType="monotone"
            areaColors={['#3BB346', 'pink']}
            lineColors={['#0FC6C2', 'red']}
            lines={['line']}
            isDot
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Sessions', value: 'session' }}
            options={[
              { label: 'Sessions', value: 'session' },
              { label: 'Localhost', value: 'localhost' },
            ]}
          />
        </div>
      );
    }
  }
);
export default withTranslation('common')(withVisitorViewModel(OverviewComponent));
