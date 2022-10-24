import ComponentDatePicker from 'components/ComponentDatePicker';
import ComponentSVG from 'components/ComponentSVG';
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';

const DateRangePicker = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const { t, viewModelArr } = props;
  return (
    <div
      style={{ minHeight: '50px' }}
      ref={datePickerRef}
      className="d-flex align-items-center bg-white rounded-1 shadow-sm pe-16 py-sm"
    >
      <ComponentDatePicker
        isOpen={openDatePicker}
        setIsOpen={setOpenDatePicker}
        datePickerRef={datePickerRef}
        placeholder={t('txt_select_date')}
        viewModelArr={viewModelArr}
      />
      <ComponentSVG url="/assets/images/calendar.svg" color="#00B96D" />
    </div>
  );
};

export default withTranslation('common')(DateRangePicker);
