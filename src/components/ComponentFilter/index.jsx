import SearchComponent from './SearchComponent';
import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import ActionComponent from './ActionComponent';
import ComponentDatePicker from 'components/ComponentDatePicker';
import ComponentSVG from 'components/ComponentSVG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

const ComponentFilter = ({ isSearch, isAction, isDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  return (
    <div className="bg-white shadow-sm d-flex mb-24">
      {isSearch && <SearchComponent />}
      {isAction && <ActionComponent />}
      {isDate && (
        <div ref={datePickerRef} className="d-flex align-items-center cursor-pointer px-24">
          <ComponentSVG url="/assets/images/calendar.svg" />
          <ComponentDatePicker
            isOpen={openDatePicker}
            setIsOpen={setOpenDatePicker}
            datePickerRef={datePickerRef}
          />
          <FontAwesomeIcon className="text-success" icon={faChevronDown} />
        </div>
      )}
    </div>
  );
};

export default withTranslation('common')(ComponentFilter);
