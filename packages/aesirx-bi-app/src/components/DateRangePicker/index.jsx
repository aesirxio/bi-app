import ComponentSVG from '../ComponentSVG';
import { env } from 'aesirx-lib';
import React, { useRef, useState } from 'react';
import { BiViewModelContext, useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { AesirXDatePicker } from 'aesirx-uikit';

const DateRangePicker = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const { onChange } = props;

  const {
    biListViewModel: {
      dateFilter: { date_start, date_end },
      setDateFilter,
    },
  } = useBiViewModel(BiViewModelContext);

  return (
    <div
      style={{ minHeight: '48px' }}
      ref={datePickerRef}
      className="d-flex align-items-center bg-white rounded-1 shadow-sm daterange-picker-wrapper"
    >
      <AesirXDatePicker
        isOpen={openDatePicker}
        setIsOpen={setOpenDatePicker}
        datePickerRef={datePickerRef}
        onChange={onChange}
        dateStart={date_start}
        dateEnd={date_end}
        setDateFilter={setDateFilter}
      />
      <div className="calendar-icon position-absolute top-50 translate-middle-y">
        <ComponentSVG url={env.PUBLIC_URL + '/assets/images/calendar.svg'} color="#00B96D" />
      </div>
    </div>
  );
};

export default DateRangePicker;
