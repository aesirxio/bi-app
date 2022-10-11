import SearchComponent from './SearchComponent';
import React from 'react';
import { withTranslation } from 'react-i18next';
import ActionComponent from './ActionComponent';
import './index.scss';

const ComponentFilter = ({ isSearch, isAction, ...props }) => {
  const { t } = props;
  console.log(t);
  return (
    <div className="bg-white shadow-sm d-flex mb-24">
      {isSearch && <SearchComponent />}
      {isAction && <ActionComponent />}
    </div>
  );
};

export default withTranslation('common')(ComponentFilter);
