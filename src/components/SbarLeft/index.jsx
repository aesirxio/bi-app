/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { withTranslation } from 'react-i18next';

import './index.scss';
import Menu from '../Menu';

import Menu2 from 'components/Menu2';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
// import { NavLink } from 'react-router-dom';
const SbarLeft = observer(
  class SbarLeft extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      let { settingPage } = this.props;

      return (
        <aside
          className={`sidebar w-248  mt-0 position-relative bg-dark mh-100 h-100 d-flex flex-column z-index-100 justify-content-between`}
        >
          {!settingPage ? (
            <>
              <Menu />
            </>
          ) : (
            <Menu2 />
          )}
        </aside>
      );
    }
  }
);

export default withTranslation('common')(withBiViewModel(SbarLeft));
