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
                chartTitle="Overview"
                height={500}
                data={[
                  {
                    name: 'Jan',
                    line1: 400,
                    line2: 700,
                  },
                  {
                    name: 'Feb',
                    line1: 530,
                    line2: 730,
                  },
                  {
                    name: 'Mar',
                    line1: 410,
                    line2: 710,
                  },
                  {
                    name: 'Apr',
                    line1: 395,
                    line2: 795,
                  },
                  {
                    name: 'May',
                    line1: 380,
                    line2: 780,
                  },
                  {
                    name: 'Jun',
                    line1: 204,
                    line2: 704,
                  },
                  {
                    name: 'Jul',
                    line1: 420,
                    line2: 720,
                  },
                  {
                    name: 'Aug',
                    line1: 680,
                    line2: 780,
                  },
                  {
                    name: 'Sep',
                    line1: 670,
                    line2: 770,
                  },
                  {
                    name: 'Oct',
                    line1: 568,
                    line2: 768,
                  },
                  {
                    name: 'Nov',
                    line1: 940,
                    line2: 740,
                  },
                  {
                    name: 'Dec',
                    line1: 360,
                    line2: 760,
                  },
                ]}
                colors={['#1AB394']}
                lineType="monotone"
                areaColors={['#3BB346', 'pink']}
                lineColors={['#0FC6C2', 'red']}
                lines={['line1', 'line2']}
              />
            </Col>
            <Col lg={3}></Col>
          </Row>
          <Row>
            <Col lg={9}></Col>
            <Col lg={3}>
              <PieChart
                height={320}
                chartTitle="Visitors"
                data={[
                  { name: 'Smart', value: 400 },
                  { name: 'Stupid', value: 600 },
                ]}
                colors={['#1AB394', '#1A73E8']}
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
