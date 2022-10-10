import React from 'react';
import { useState } from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import SelectComponent from 'components/Select';
import { withTranslation } from 'react-i18next';

const AreaChartController = ({ chartTitle, ...props }) => {
  const [view, setView] = useState('months');
  const { t } = props;
  return (
    <div className="d-flex justify-content-between mb-24">
      <div className="d-flex align-items-center">
        <h5 className="me-24 mb-0 text-blue-0">{chartTitle}</h5>
        <SelectComponent
          defaultValue={{ label: 'Session', value: 'session' }}
          options={[
            { label: 'Session', value: 'session' },
            { label: 'Localhost', value: 'localhost' },
          ]}
          className={`fs-sm`}
          isBorder={true}
          plColor={'#808495'}
        />
      </div>
      <ButtonGroup>
        <Button
          onClick={() => setView('hours')}
          className={`${view == 'hours' && 'text-white'} py-1 px-15 fs-12 lh-sm`}
          variant={view == 'hours' ? 'secondary' : 'outline-secondary'}
        >
          {t('txt_hours')}
        </Button>
        <Button
          onClick={() => setView('days')}
          className={`${view == 'days' && 'text-white'} py-1 px-15 fs-12 lh-sm`}
          variant={view == 'days' ? 'secondary' : 'outline-secondary'}
        >
          {t('txt_days')}
        </Button>
        <Button
          onClick={() => setView('weeks')}
          className={`${view == 'weeks' && 'text-white'} py-1 px-15 fs-12 lh-sm`}
          variant={view == 'weeks' ? 'secondary' : 'outline-secondary'}
        >
          {t('txt_weeks')}
        </Button>
        <Button
          onClick={() => setView('months')}
          className={`${view == 'months' && 'text-white'} py-1 px-15 fs-12 lh-sm`}
          variant={view == 'months' ? 'secondary' : 'outline-secondary'}
        >
          {t('txt_months')}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default withTranslation('common')(AreaChartController);
