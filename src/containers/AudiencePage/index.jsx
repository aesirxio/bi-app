import PieChart from 'components/PieChartComponent';
import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import AreaChart from 'components/AreaChartComponent';
import ComponentCard from 'components/ComponentCard';

class AudiencePage extends Component {
  render() {
    const { t } = this.props;
    const listNewUser = [
      { email: 'phu.tran@r-digital.tech', status: 'Active' },
      { email: 'babila@gmail.com', status: 'Waiting' },
      { email: 'babila@gmail.com', status: 'Active' },
      { email: 'babila@gmail.com', status: 'Active' },
      { email: 'babila@gmail.com', status: 'Waiting' },
      { email: 'babila@gmail.com', status: 'Active' },
      { email: 'babila@gmail.com', status: 'Active' },
      { email: 'babila@gmail.com', status: 'Waiting' },
    ];
    return (
      <>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_audience')}</h2>
              <p className="mb-0 text-color">{t('txt_analytic_details')}</p>
            </div>
          </div>
          <Row className="mb-24">
            <Col lg={9}>
              <AreaChart
                chartTitle={t('txt_menu_overview')}
                height={390}
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
                lines={['line1']}
                isDot
                hiddenGrid={{ vertical: false }}
                XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
                defaultValue={{ label: 'Sessions', value: 'session' }}
                options={[
                  { label: 'Sessions', value: 'session' },
                  { label: 'Localhost', value: 'localhost' },
                ]}
              />
            </Col>
            <Col lg={3}>
              <div className="bg-white h-100 rounded-3 shadow-sm py-3 px-24">
                <h5 className="mb-24 text-blue-0">{t('txt_new_registered_users')}</h5>
                {listNewUser &&
                  listNewUser.map((item, index) => {
                    let color = item.status === 'Active' ? '#3EAD8A' : '#F59E0B';
                    let backgroundColor = item.status === 'Active' ? '#D0F4E8' : '#FFEAC8';
                    return (
                      <div key={index} className="d-flex justify-content-between mt-24 text-color">
                        {item.email}
                        <span
                          style={{ color: color, backgroundColor: backgroundColor }}
                          className="d-block rounded-pill px-1 py-sm fs-12 fw-semibold"
                        >
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={9}>
              <Row className="mb-24">
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_visitors')}
                    icon={'/assets/images/visitor.svg'}
                    iconColor={'#1AB394'}
                    value={'170,780'}
                    isIncrease={true}
                    percent={'11%'}
                    textPercent={'form June'}
                    options={[{ label: 'All Users', value: 'all-user' }]}
                    defaultValue={{ label: 'All Users', value: 'all-user' }}
                  ></ComponentCard>
                </Col>
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_page_views')}
                    icon={'/assets/images/view.svg'}
                    iconColor={'#2E71B1'}
                    value={'1,421,23'}
                    isIncrease={false}
                    percent={'13%'}
                    textPercent={'form June'}
                    options={[{ label: 'All', value: 'all' }]}
                    defaultValue={{ label: 'All', value: 'all' }}
                  ></ComponentCard>
                </Col>
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_sessions')}
                    icon={'/assets/images/sessions.svg'}
                    iconColor={'#FFBE55'}
                    value={'170,780'}
                    isIncrease={true}
                    percent={'17%'}
                    textPercent={'form June'}
                  ></ComponentCard>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_acg_session_duration')}
                    icon={'/assets/images/duration.svg'}
                    iconColor={'#EF3737'}
                    value={'170,780'}
                    isIncrease={false}
                    percent={'11%'}
                    textPercent={'form June'}
                  ></ComponentCard>
                </Col>
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_page_session')}
                    icon={'/assets/images/page.svg'}
                    iconColor={'#FFBE55'}
                    value={'170,780'}
                    isIncrease={false}
                    percent={'11%'}
                    textPercent={'form June'}
                  ></ComponentCard>
                </Col>
                <Col lg={4}>
                  <ComponentCard
                    title={t('txt_bounce_rate')}
                    icon={'/assets/images/rate.svg'}
                    iconColor={'#C8192E'}
                    value={'170,780'}
                    isIncrease={false}
                    percent={'11%'}
                    textPercent={'form June'}
                  ></ComponentCard>
                </Col>
              </Row>
            </Col>
            <Col lg={3}>
              <PieChart
                height={300}
                chartTitle={t('txt_visitors')}
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
export default withTranslation('common')(AudiencePage);
