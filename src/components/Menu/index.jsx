/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react-lite';
import { env } from 'aesirx-lib';
import { Menu as AesirXMenu } from 'aesirx-uikit';
import { getMenu } from 'routes/menu';

const Menu = observer((props) => {
  const [dataStreamActive, setDataStreamActive] = useState(
    env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain
  );

  const biStore = useBiViewModel();
  const dataMenu = getMenu(dataStreamActive);

  const handleChangeLink = (e, link) => {
    e.preventDefault();

    if (link) {
      biStore.biListViewModel.setIntegrationLink(link);
    }
  };

  useEffect(() => {
    let fetchData = async () => {
      if (props.match.params.domain) {
        biStore.biListViewModel.setActiveDomain(props.match.params.domain);
        setDataStreamActive(`${props.match.params.domain}`);
      }
    };

    fetchData();
  }, [biStore.biListViewModel, dataStreamActive, props.match.params.domain]);

  return <AesirXMenu dataMenu={dataMenu} handleChangeLink={handleChangeLink} />;
});

export default withRouter(Menu);
