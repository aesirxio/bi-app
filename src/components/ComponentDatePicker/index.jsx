import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import DatePicker, { registerLocale } from 'react-datepicker';
import './index.scss';
import moment from 'moment';
import { observer } from 'mobx-react';
import vi from 'date-fns/locale/vi';
import de from 'date-fns/locale/de';
import uk from 'date-fns/locale/uk';
import es from 'date-fns/locale/es';
import th from 'date-fns/locale/th';
import hr from 'date-fns/locale/hr';
import { enUS } from 'date-fns/locale';
import { BiViewModelContext, useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
registerLocale('vi', vi);
registerLocale('de', de);
registerLocale('uk', uk);
registerLocale('es', es);
registerLocale('th', th);
registerLocale('hr', hr);
registerLocale('en-US', enUS);

const ComponentDatePicker = observer(({ isOpen, setIsOpen, datePickerRef, isDays, onChange }) => {
  const { t, i18n } = useTranslation('common');
  const {
    biListViewModel: {
      dateFilter: { date_start, date_end },
      setDateFilter,
    },
  } = useBiViewModel(BiViewModelContext);

  const [dateRange, setDateRange] = useState([
    moment(date_start, 'YYYY-MM-DD').toDate(),
    moment(date_end, 'YYYY-MM-DD').toDate(),
  ]);

  const [startDate, endDate] = dateRange;
  const pickerRef = useRef(null);

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutSide);
    return () => window.removeEventListener('mousedown', handleClickOutSide);
  });

  const handleApply = async (e, startDate, endDate) => {
    e.stopPropagation();
    setDateFilter(startDate, endDate);
    // if (typeof onChange === 'function') {
    onChange(startDate, endDate);
    // }
    setIsOpen(false);
  };

  const handleClickOutSide = (event) => {
    let currentRef = datePickerRef ?? pickerRef;
    if (isOpen && !currentRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleOpenDatePicker = (event) => {
    if (isOpen && pickerRef.current && !pickerRef.current.contains(event.target)) {
      setIsOpen(false);
    } else setIsOpen(true);
  };

  const MyContainer = ({ className, children }) => {
    return (
      <div
        ref={pickerRef}
        className="rounded-3 shadow overflow-hidden py-2 px-1 react-datepicker-popper-wrapper"
      >
        <div className={`${className}`}>{children}</div>
        {startDate && (
          <div className="d-flex align-items-center justify-content-end border-top-1 pt-2 px-2 text-color">
            <p className="fs-14 color-blue-0 opacity-75 mb-0">
              {startDate ? moment(startDate).format('LL') : ''} -{' '}
              {endDate ? moment(endDate).format('LL') : ''}
            </p>
            <span
              style={{ cursor: 'pointer' }}
              className="btn btn-success ms-3 fw-bold text-uppercase fs-14 lh-sm rounded-1 py-1"
              onClick={(e) => handleApply(e, startDate, endDate)}
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

  const getDateDiffString = (start, end) => {
    let startDate = start ? moment(start).format('DD MMM, YYYY') : '';
    let endDate = end ? moment(end).format('DD MMM, YYYY') : '';
    let result = '';
    if (start || end) {
      result =
        getDateDiff(start, end) == 1
          ? startDate !== moment().format('DD MMM, YYYY')
            ? startDate
            : t('txt_today')
          : startDate + ` ${endDate ? '-' : ''} ` + endDate;
    }
    return result;
  };
  return (
    <div onClick={handleOpenDatePicker} className="position-relative daterange-picker w-100">
      <DatePicker
        style={{ margin: 0 }}
        dateFormat="dd MMM, yyyy"
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        value={
          !isDays
            ? getDateDiffString(startDate, endDate)
            : getDateDiff(startDate, endDate)
            ? `${getDateDiff(startDate, endDate)} ${t('txt_days')}`
            : ''
        }
        isClearable={false}
        className={`${
          isDays ? 'fs-14 fw-semibold mw-120' : 'ps-16 pe-6'
        } form-control rounded-1 text-body opacity-100 h-100 ${i18n?.language}`}
        showPopperArrow={false}
        monthsShown={2}
        open={isOpen}
        locale={i18n.language}
        calendarContainer={MyContainer}
      />
    </div>
  );
});

export default ComponentDatePicker;
