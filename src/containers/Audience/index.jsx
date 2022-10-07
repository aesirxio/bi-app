import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import AreaChart from 'components/AreaChartComponent';

class Audience extends Component {
  render() {
    const { t } = this.props;
    return (
      <>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_audience')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
          </div>
          <Row>
            <Col lg={9}>
              <AreaChart
                lines={2}
                height="500px"
                data={[
                  {
                    name: 'Jan',
                    line1: 400,
                  },
                  {
                    name: 'Feb',
                    line1: 530,
                  },
                  {
                    name: 'Mar',
                    line1: 410,
                  },
                  {
                    name: 'Apr',
                    line1: 395,
                  },
                  {
                    name: 'May',
                    line1: 380,
                  },
                  {
                    name: 'Jun',
                    line1: 204,
                  },
                  {
                    name: 'Jul',
                    line1: 420,
                  },
                  {
                    name: 'Aug',
                    line1: 680,
                  },
                  {
                    name: 'Sep',
                    line1: 670,
                  },
                  {
                    name: 'Oct',
                    line1: 568,
                  },
                  {
                    name: 'Nov',
                    line1: 940,
                  },
                  {
                    name: 'Dec',
                    line1: 360,
                  },
                ]}
                colors={['#1AB394']}
                lineType="monotone"
                areaColors={['#3BB346']}
                lineColors={['#0FC6C2']}
              />
            </Col>
            <Col lg={3}>
              <PieChart
                titleChart="Visitors"
                height="288px"
                chartArea={{ top: '10', bottom: '70', width: '100%', height: '75%' }}
                data={[
                  ['Percentage', 'Percent'],
                  ['Returning visitors', 40],
                  ['New visitors', 60],
                ]}
                legendPosition="bottom"
              />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default withTranslation('common')(Audience);
