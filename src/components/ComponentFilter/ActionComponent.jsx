import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';

function ActionComponent({ ...props }) {
  const { t } = props;

  return (
    <Dropdown className="border-end">
      <Dropdown.Toggle variant="white" className={`text-blue-0 px-24`}>
        <span className="fs-14 fw-semibold me-1">{t('choose_an_action')}</span>
        <i className="text-green">
          <FontAwesomeIcon icon={faChevronDown} />
        </i>
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100 border-0 shadow">
        <Dropdown.Item>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default withTranslation('common')(ActionComponent);
