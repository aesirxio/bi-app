/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';
import Spinner from '../../components/Spinner';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import PAGE_STATUS from 'constants/PageStatus';
import ComponentCard from 'components/ComponentCard';
import Revenue from './Component/Revenue';
import RegisteredUser from './Component/RegisteredUser';
import ComponentContinent from 'components/ComponentContinent';
// import DateRangePicker from 'components/DateRangePicker';
import AreaChartComponent from 'components/AreaChartComponent';
import DatePickerComponent from './Component/DatePicker';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { BI_DASHBOARD_FIELD_KEY } from 'library/Constant/BiConstant';
import numberWithCommas from 'utils/formatNumber';
const Dashboard = observer(
  class Dashboard extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.biListViewModel : null;
    }

    componentDidMount() {
      this.biListViewModel.getDashboard();
    }

    render() {
      const { t } = this.props;
      if (status === PAGE_STATUS.LOADING) {
        return <Spinner />;
      }

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div className="position-relative">
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_dashboard')}</h2>
              <p className="mb-0">{t('txt_dashboard_below')}</p>
            </div>
            <div className="position-relative">
              <DatePickerComponent></DatePickerComponent>
              {/* <DateRangePicker></DateRangePicker> */}
            </div>
          </div>
          <div className="row gx-24 mb-24">
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_visitors')}
                icon={'/assets/images/visitor.svg'}
                iconColor={'#1AB394'}
                value={numberWithCommas(
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.VISITOR]?.[
                    BI_DASHBOARD_FIELD_KEY.VALUE
                  ]
                )}
                isIncrease={true}
                percent={`${
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.VISITOR]?.[
                    BI_DASHBOARD_FIELD_KEY.PERCENT
                  ]
                }%`}
                textPercent={'form June'}
                options={[{ label: 'All Users', value: 'all-user' }]}
                defaultValue={{ label: 'All Users', value: 'all-user' }}
              ></ComponentCard>
            </div>
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_total_revenue')}
                icon={'/assets/images/revenue-icon.svg'}
                iconColor={'#2E71B1'}
                value={numberWithCommas(
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.TOTAL_REVENUE]?.[
                    BI_DASHBOARD_FIELD_KEY.VALUE
                  ]
                )}
                isIncrease={true}
                percent={`${
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.TOTAL_REVENUE]?.[
                    BI_DASHBOARD_FIELD_KEY.PERCENT
                  ]
                }%`}
                textPercent={'form June'}
                options={[{ label: 'All', value: 'all' }]}
                defaultValue={{ label: 'All', value: 'all' }}
              ></ComponentCard>
            </div>
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_sessions')}
                icon={'/assets/images/sessions.svg'}
                iconColor={'#FFBE55'}
                value={numberWithCommas(
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.SESSIONS]?.[
                    BI_DASHBOARD_FIELD_KEY.VALUE
                  ]
                )}
                isIncrease={false}
                percent={`${
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.SESSIONS]?.[
                    BI_DASHBOARD_FIELD_KEY.PERCENT
                  ]
                }%`}
                textPercent={'form June'}
              ></ComponentCard>
            </div>
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_conversion_rate')}
                icon={'/assets/images/conversion.svg'}
                iconColor={'#EF3737'}
                value={numberWithCommas(
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.CONVERSION_RATE]?.[
                    BI_DASHBOARD_FIELD_KEY.VALUE
                  ]
                )}
                isIncrease={true}
                percent={`${
                  this.biListViewModel.data[BI_DASHBOARD_FIELD_KEY.CONVERSION_RATE]?.[
                    BI_DASHBOARD_FIELD_KEY.PERCENT
                  ]
                }%`}
                textPercent={'form June'}
              ></ComponentCard>
            </div>
          </div>
          <div className="row gx-24 mb-24">
            <div className="col-lg-7">
              <AreaChartComponent
                chartTitle={t('txt_total_revenue')}
                height={390}
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
                areaColors={['#3BB346', 'pink']}
                lineColors={['#0FC6C2', 'red']}
                lines={['line1']}
                isDot
                hiddenGrid={{ vertical: false }}
                XAxisOptions={{ axisLine: true, padding: { left: 20, right: 10 } }}
              />
            </div>
            <div className="col-lg-5">
              <Revenue></Revenue>
            </div>
          </div>
          <div className="row gx-24 mb-24">
            <div className="col-lg-6">
              <RegisteredUser></RegisteredUser>
            </div>
            <div className="col-lg-6">
              <ComponentContinent></ComponentContinent>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default withTranslation('common')(withBiViewModel(Dashboard));
