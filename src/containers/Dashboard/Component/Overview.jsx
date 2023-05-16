import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import AreaChartComponent from 'components/AreaChartComponent';

const OverviewComponent = observer(
  class OverviewComponent extends Component {
    constructor(props) {
      super(props);
      const { listViewModel } = props;
      this.listViewModel = listViewModel ? listViewModel : null;
      this.state = { loading: false };
    }

    render() {
      const { t, status, lines, lineColors, areaColors } = this.props;
      return (
        <div className="position-relative h-100">
          <AreaChartComponent
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={this?.listViewModel?.visitorData?.toAreaChart()}
            colors={['#1AB394']}
            lineType="monotone"
            areaColors={areaColors}
            lineColors={lineColors}
            lines={lines}
            isDot
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Visitors', value: 'visitors' }}
            options={[{ label: 'Visitors', value: 'visitors' }]}
            loading={status}
            tooltipComponent={{
              header: t('txt_in_total'),
              value: lines?.length === 1 && lines[0] + ':',
            }}
            status={status}
            filterData={this?.listViewModel?.visitorData?.getFilterName()}
            isSelection={false}
          />
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(OverviewComponent));
