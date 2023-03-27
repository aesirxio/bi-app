/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react';
import { env } from 'env';

import '../index.scss';
import { Collapse, Button } from 'react-bootstrap';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
const dataMenuSetup = [
  // {
  //   text: 'txt_menu_region',
  //   link: '/region-country',
  //   icons: '/assets/images/region-country.svg',
  //   icons_color: '/assets/images/region-country.svg',
  // },
  // {
  //   text: 'txt_menu_setting',
  //   link: '/setting',
  //   icons: '/assets/images/setting.svg',
  //   icons_color: '/assets/images/setting.svg',
  // },
];
const SbarLeftIntegration = observer(() => {
  const [isOpenCollapse, setIsOpenCollapse] = useState('default');
  const [dataStreamActive, setDataStreamActive] = useState(
    env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain
  );
  const biStore = useBiViewModel();
  const { t } = useTranslation('common');
  const handleOpen = (clickedIndex, parentIndex) => {
    if (isOpenCollapse === clickedIndex.toString()) {
      if (parentIndex) {
        setIsOpenCollapse(parentIndex.toString());
      } else {
        setIsOpenCollapse(null);
      }
    } else {
      if (isOpenCollapse?.includes(clickedIndex.toString())) {
        setIsOpenCollapse(null);
      } else {
        setIsOpenCollapse(clickedIndex.toString());
      }
    }
  };
  const checkActiveMenu = () => {
    // if (window.location.pathname === '/') {
    //   document.getElementById('wr_list_menu').classList.remove('wr_list_menu');
    // } else {
    //   document.getElementById('wr_list_menu').classList.add('wr_list_menu');
    // }
  };

  const handleCheckActive = () => {
    checkActiveMenu();
  };

  const handleChangeLink = (e, link) => {
    e.preventDefault();

    if (link) {
      biStore.biListViewModel.setIntegrationLink(link);
    }
  };

  const dataMenu = [
    {
      text: 'txt_menu_dashboard',
      link: `/${dataStreamActive}`,
      icons: env.PUBLIC_URL + '/assets/images/dashboard.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/dashboard.svg',
      page: 'dashboard',
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
          page: 'audience-overview',
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
          page: 'behavior-utm-tracking',
        },
        {
          text: 'txt_menu_events',
          link: `/${dataStreamActive}/behavior/events`,
          page: 'behavior-events',
        },
      ],
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
      if (biStore.biListViewModel.activeDomain) {
        biStore.biListViewModel.setActiveDomain(biStore.biListViewModel.activeDomain);
        setDataStreamActive(`${biStore.biListViewModel.activeDomain}`);
      }
    };

    fetchData();
  }, [biStore.biListViewModel.activeDomain, dataStreamActive]);

  return (
    <aside
      className={`sidebar w-248  mt-0 position-relative bg-dark mh-100 h-100 d-flex flex-column z-index-100 justify-content-between`}
    >
      <nav className="main-menu py-24 mt-0">
        <p className="menu_title text-dark-blue fs-14 mb-0 text-uppercase">{t('txt_main_menu')}</p>
        <ul id="wr_list_menu" className="list-unstyled mb-0 pt-md-1">
          {dataMenu.map((menuList, menuListkey) => {
            return (
              <li
                key={menuListkey}
                className={`item_menu ${menuList.className ? menuList.className : ''} `}
              >
                {!menuList.submenu ? (
                  <>
                    {menuList.link && (
                      <a
                        href="#"
                        onClick={(e) => handleChangeLink(e, menuList.page)}
                        // exact={true}
                        // to={menuList.link}
                        className={`d-block px-24 py-16 link_menu text-white text-decoration-none ${
                          biStore.biListViewModel.integrationLink === menuList.page ? 'active' : ''
                        }`}
                        // activeClassName={`active`}
                      >
                        <span
                          className="icon d-inline-block align-text-bottom"
                          style={{
                            WebkitMaskImage: `url(${menuList.icons_color})`,
                            WebkitMaskRepeat: 'no-repeat',
                            backgroundColor: '#fff',
                          }}
                        ></span>
                        <span className="ms-16 text d-inline-block">{t(menuList.text)}</span>
                      </a>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      variant=""
                      onClick={() => handleOpen(menuListkey)}
                      className={`d-flex align-items-center justify-content-center rounded-0 link_menu text-decoration-none text-break w-100 px-24 py-16 shadow-none text-white ${
                        isOpenCollapse === menuListkey.toString() ||
                        isOpenCollapse?.includes(menuListkey + '-')
                          ? 'active'
                          : ''
                      }`}
                      aria-controls="wr_list_submenu"
                      aria-expanded={
                        isOpenCollapse === menuListkey.toString() ||
                        isOpenCollapse?.includes(menuListkey + '-')
                      }
                    >
                      <span
                        className="icon d-inline-block align-text-bottom"
                        style={{
                          WebkitMaskImage: `url(${menuList.icons_color})`,
                          WebkitMaskRepeat: 'no-repeat',
                          backgroundColor: '#fff',
                        }}
                      ></span>
                      <span className="ms-16 text d-inline-block">{t(menuList.text)}</span>
                      <span
                        className="icon arrow d-inline-block align-text-bottom ms-auto"
                        style={{
                          WebkitMaskImage: `url(${env.PUBLIC_URL}/assets/images/arrow-right.svg)`,
                          WebkitMaskRepeat: 'no-repeat',
                          backgroundColor: '#fff',
                        }}
                      ></span>
                    </Button>
                    <Collapse
                      in={
                        isOpenCollapse === menuListkey.toString() ||
                        isOpenCollapse?.includes(menuListkey + '-')
                      }
                    >
                      <ul id="wr_list_submenu" className="list-unstyled">
                        {menuList.submenu.map((value, menuListSubkey) => {
                          return (
                            <li
                              key={menuListSubkey}
                              className={`item_menu`}
                              onClick={handleCheckActive}
                            >
                              {value.link && (
                                <a
                                  href="#"
                                  onClick={(e) => handleChangeLink(e, value.page)}
                                  // exact={true}
                                  // to={value.link}
                                  className={`d-block px-24 py-16 link_menu text-white text-decoration-none ${
                                    biStore.biListViewModel.integrationLink === value.page
                                      ? 'active'
                                      : ''
                                  }`}
                                  // activeClassName={`active`}
                                >
                                  <span className="text d-inline-block">{t(value.text)}</span>
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </Collapse>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <nav className="border-dark-blue py-2 mt-0 mb-auto">
        {/* <p className="menu_title text-dark-blue fs-14 mb-0 text-uppercase">{t('txt_set_up')}</p> */}
        <ul id="wr_list_menu" className="list-unstyled mb-0 pt-md-1">
          {dataMenuSetup.map((value, key) => {
            return (
              <li key={key} className={`item_menu ${value.className ? value.className : ''}`}>
                <a
                  href="#"
                  // exact={true}
                  // to={value.link}
                  className={`d-block px-24 py-16 link_menu text-white text-decoration-none ${
                    biStore.biListViewModel.integrationLink === value.page ? 'active' : ''
                  }`}
                  // activeClassName={`active`}
                >
                  <span
                    className="icon d-inline-block align-text-bottom"
                    style={{
                      WebkitMaskImage: `url(${value.icons_color})`,
                      WebkitMaskRepeat: 'no-repeat',
                      backgroundColor: '#fff',
                    }}
                  ></span>
                  <span className="ms-16 text d-inline-block">{t(value.text)}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
});

export default SbarLeftIntegration;
