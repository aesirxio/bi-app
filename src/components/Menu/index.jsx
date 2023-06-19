/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react-lite';

import { Menu as AesirXMenu } from 'aesirx-uikit';
import { mainMenu } from 'routes/menu';

const Menu = observer(() => {
  const biStore = useBiViewModel();

  const handleChangeLink = (e, link) => {
    e.preventDefault();

    if (link) {
      biStore.biListViewModel.setIntegrationLink(link);
    }
  };

  return <AesirXMenu dataMenu={mainMenu} handleChangeLink={handleChangeLink} />;
});

export default withRouter(Menu);
