/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu as AesirXMenu } from 'aesirx-uikit';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { getMainMenu } from '../../routes/menu';
import { observer } from 'mobx-react';

const Menu = observer((props) => {
  const biStore = useBiViewModel();
  const [mainMenu, setMainMenu] = useState([]);
  useEffect(() => {
    let fetchData = async () => {
      await biStore.biListViewModel.setDataStream(biStore.biListViewModel.activeDomain);
      biStore.biListViewModel.setActiveDomain(biStore.biListViewModel.activeDomain);
      biStore.biListViewModel.setDateFilter(
        biStore.biListViewModel.dateFilter['date_start'],
        biStore.biListViewModel.dateFilter['date_end']
      );
    };
    fetchData();
  }, [props.location.pathname]);
  useEffect(() => {
    if (biStore?.biListViewModel?.dataStream?.is_user_admin) {
      setMainMenu(getMainMenu(true));
    } else {
      setMainMenu(getMainMenu(false));
    }
  }, [biStore?.biListViewModel?.dataStream?.is_user_admin]);
  return <AesirXMenu dataMenu={mainMenu} />;
});

export default withRouter(Menu);
