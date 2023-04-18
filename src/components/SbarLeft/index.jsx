/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { withTranslation } from 'react-i18next';

import Menu from '../Menu';

import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';
import { SbarLeft as AesirXSbarLeft } from 'aesirx-uikit';

const SbarLeft = observer(
  class SbarLeft extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <AesirXSbarLeft>
          <Menu />
        </AesirXSbarLeft>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(SbarLeft));
