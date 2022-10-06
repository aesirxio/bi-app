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

const HomePage = observer(
  class HomePage extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      const { t } = this.props;

      if (status === PAGE_STATUS.LOADING) {
        return <Spinner />;
      }

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_dashboard')}</h2>
              <p className="mb-0">{t('txt_dashboard_below')}</p>
            </div>
          </div>
          <div className="row gx-24">
            <div className="col-lg-3">
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
            </div>
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_total_revenue')}
                icon={'/assets/images/revenue-icon.svg'}
                iconColor={'#2E71B1'}
                value={'170,780'}
                isIncrease={true}
                percent={'11%'}
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
                value={'170,780'}
                isIncrease={false}
                percent={'11%'}
                textPercent={'form June'}
              ></ComponentCard>
            </div>
            <div className="col-lg-3">
              <ComponentCard
                title={t('txt_conversion_rate')}
                icon={'/assets/images/conversion.svg'}
                iconColor={'#EF3737'}
                value={'170,780'}
                isIncrease={true}
                percent={'11%'}
                textPercent={'form June'}
              ></ComponentCard>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default withTranslation('common')(HomePage);
