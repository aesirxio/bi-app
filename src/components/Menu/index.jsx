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

const Menu = observer((props) => {
  const [dataStreamActive, setDataStreamActive] = useState(
    env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain
  );

  const biStore = useBiViewModel();

  const checkActiveMenu = () => {
    if (window.location.pathname === '/') {
      document.getElementById('wr_list_menu').classList.remove('wr_list_menu');
    } else {
      document.getElementById('wr_list_menu').classList.add('wr_list_menu');
    }
  };

  const dataMenu = [
    {
      text: 'txt_menu_dashboard',
      link: `/${dataStreamActive}`,
      icons: env.PUBLIC_URL + '/assets/images/dashboard.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/dashboard.svg',
    },
    {
      text: 'txt_menu_audience',
      link: `/${dataStreamActive}/audience`,
      icons: env.PUBLIC_URL + '/assets/images/audience.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
      submenu: [
        {
          text: 'txt_menu_overview',
          link: `/${dataStreamActive}/audience/overview`,
        },
      ],
    },
    {
      text: 'txt_menu_behavior',
      link: `/${dataStreamActive}/behavior`,
      icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
      submenu: [
        // {
        //   text: 'txt_menu_overview',
        //   link: `${dataStreamActive}/behavior/overview`,
        // },
        // {
        //   text: 'txt_menu_click_anchor',
        //   link: `${dataStreamActive}/behavior/click-anchor`,
        // },
        {
          text: 'txt_menu_utm_tracking',
          link: `/${dataStreamActive}/behavior/utm-tracking`,
        },
        {
          text: 'txt_menu_events',
          link: `/${dataStreamActive}/behavior/events`,
        },
      ],
    },
    {
      text: 'txt_menu_region',
      link: `/${dataStreamActive}/region-country`,
      icons: env.PUBLIC_URL + '/assets/images/region-country.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/region-country.svg',
    },
    // {
    //   text: 'txt_menu_revenue',
    //   link: `${dataStreamActive}/revenue`,
    //   icons: '/assets/images/revenue.svg',
    //   icons_color: '/assets/images/revenue.svg',
    // },
    // {
    //   text: 'txt_menu_subscription',
    //   link: `${dataStreamActive}/subscription`,
    //   icons: '/assets/images/subscription.svg',
    //   icons_color: '/assets/images/subscription.svg',
    // },
    // {
    //   text: 'txt_menu_member_roles',
    //   link: `${dataStreamActive}/member-roles`,
    //   icons: '/assets/images/member-roles.svg',
    //   icons_color: '/assets/images/member-roles.svg',
    // },
    // {
    //   text: 'txt_menu_data_stream',
    //   link: `${dataStreamActive}/data-stream`,
    //   icons: '/assets/images/data-stream.svg',
    //   icons_color: '/assets/images/data-stream.svg',
    // },
  ];

  useEffect(() => {
    checkActiveMenu();
    let fetchData = async () => {
      if (props.match.params.domain) {
        biStore.biListViewModel.setActiveDomain(props.match.params.domain);
        setDataStreamActive(`${props.match.params.domain}`);
      }
    };

    fetchData();
  }, [biStore.biListViewModel, dataStreamActive, props.match.params.domain]);

  return <AesirXMenu dataMenu={dataMenu} />;
});

export default withRouter(Menu);
