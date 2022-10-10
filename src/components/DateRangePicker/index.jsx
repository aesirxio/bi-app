import React, { useState } from 'react';

import './index.scss';
import DatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
// import { FORMAT_DATE } from 'constants/FormFieldType';

const DateRangePicker = (props) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { t, i18n } = props;

  return (
    <div className="position-relative daterange-picker">
      <span
        className={`icon arrow d-inline-block align-text-bottom ms-auto bg-success`}
        style={{
          WebkitMaskImage: `url(/assets/images/calendar.svg)`,
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
        }}
      ></span>
      <DatePicker
        dateFormat="dd MMM, yyyy"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        isClearable={true}
        className={`form-control border-0 shadow-sm p-16 pe-8 rounded-1`}
        placeholderText={t('txt_select_date')}
        showPopperArrow={false}
        monthsShown={2}
        locale={i18n.language}
      />
    </div>
  );
};

export default withTranslation('common')(DateRangePicker);
