import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import BarChartComponent from 'components/BarChartComponent';

const OverviewComponent = observer(
  class OverviewComponent extends Component {
    constructor(props) {
      super(props);
      const { listViewModel } = props;
      this.listViewModel = listViewModel ? listViewModel : null;
      this.state = { loading: false };
    }

    render() {
      const { t, status, bars, barColors, data, filterData } = this.props;
      return (
        <div className="position-relative h-100">
          <BarChartComponent
            height={450}
            data={data}
            colors={['#1AB394']}
            layout="horizontal"
            barColors={barColors}
            bars={bars}
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Visitors', value: 'visitors' }}
            options={[{ label: 'Visitors', value: 'visitors' }]}
            loading={status}
            tooltipComponent={{
              header: t('txt_in_total'),
              value: bars?.length === 1 && bars[0] + ':',
            }}
            status={status}
            filterData={filterData}
            isSelection={false}
            isLegend={true}
            filterButtons={['days', 'months', 'weeks']}
          />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(OverviewComponent));
