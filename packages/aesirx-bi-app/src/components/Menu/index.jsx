/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu as AesirXMenu } from 'aesirx-uikit';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { mainMenu } from '../../routes/menu';
import { observer } from 'mobx-react';

const Menu = observer((props) => {
  const biStore = useBiViewModel();
  useEffect(() => {
    let fetchData = async () => {
      biStore.biListViewModel.setActiveDomain(biStore.biListViewModel.activeDomain);
      biStore.biListViewModel.setDateFilter(
        biStore.biListViewModel.dateFilter['date_start'],
        biStore.biListViewModel.dateFilter['date_end']
      );
    };
    fetchData();
  }, [props.location.pathname]);
  return <AesirXMenu dataMenu={mainMenu} />;
});

export default withRouter(Menu);
