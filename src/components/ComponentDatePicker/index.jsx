import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from 'react-datepicker';
import './index.scss';
import moment from 'moment';

function ComponentDatepicker({ isOpen, setIsOpen, ...props }) {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const pickerRef = useRef(null);
  useEffect(() => {});
  const { t, i18n } = props;
  // const handleApply = () => {
  //   console.log('test');
  // };
  const handleOpenDatePicker = (event) => {
    if (isOpen && pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsOpen(false);
    } else setIsOpen(true);
  };
  const MyContainer = ({ className, children }) => {
    return (
      <div ref={pickerRef} className="rounded-3 shadow overflow-hidden py-2 px-1 bg-white">
        <div className={`${className}`}>{children}</div>
        {startDate && (
          <div className="d-flex align-items-center justify-content-end border-top-1 pt-2 pb-1 px-2 text-color">
            <p className="fs-14 color-bule-0 opacity-75 mb-0">
              {startDate ? moment(startDate).format('LL') : ''} -{' '}
              {endDate ? moment(endDate).format('LL') : ''}
            </p>
            <span
              style={{ cursor: 'pointer' }}
              className="btn btn-success ms-3"
              onClick={() => setIsOpen(false)}
            >
              {t('txt_apply')}
            </span>
          </div>
        )}
      </div>
    );
  };
  const getDateDiff = (start, end) => {
    if (!start || !end) return 0;
    return moment(end).diff(moment(start), 'days') + 1;
  };

  return (
    <div
      onClick={handleOpenDatePicker}
      className="position-relative daterange-picker wrapper_datepicker"
    >
      <DatePicker
        dateFormat="dd MMM, yyyy"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        value={
          getDateDiff(startDate, endDate)
            ? `${getDateDiff(startDate, endDate)} ${t('txt_days')}`
            : t('txt_date_range')
        }
        isClearable={true}
        className={`form-control border-0 rounded-1 fs-14 h-100 text-color fw-semibold opacity-100 mw-120`}
        showPopperArrow={false}
        monthsShown={2}
        open={isOpen}
        locale={i18n.language}
        calendarContainer={MyContainer}
      />
    </div>
  );
}

export default withTranslation('common')(ComponentDatepicker);
