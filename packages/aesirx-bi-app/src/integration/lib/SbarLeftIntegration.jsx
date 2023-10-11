/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react';
import { env } from 'aesirx-lib';

import { Collapse } from 'react-bootstrap';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { mainMenu } from '../../routes/menu';

const SbarLeftIntegration = observer(() => {
  const [isOpenCollapse, setIsOpenCollapse] = useState('default');
  const [dataStreamActive, setDataStreamActive] = useState(
    env.REACT_APP_DATA_STREAM && JSON.parse(env.REACT_APP_DATA_STREAM)[0].domain
  );
  const biStore = useBiViewModel();
  const { t } = useTranslation();
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

  const handleChangeLink = (e, link) => {
    e.preventDefault();

    if (link) {
      biStore.biListViewModel.setIntegrationLink(link);
    }
  };

  useEffect(() => {
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
          {mainMenu.map((menuList, menuListkey) => {
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
                        onClick={(e) => {
                          setIsOpenCollapse(null);
                          handleChangeLink(e, menuList.page);
                        }}
                        className={`d-block px-24 py-16 link_menu text-white text-decoration-none ${
                          biStore.biListViewModel.integrationLink === menuList.page ? 'active' : ''
                        }`}
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
                    <a
                      href="#"
                      onClick={(e) => {
                        handleOpen(menuListkey);
                        handleChangeLink(e, menuList.submenu[0]?.page);
                      }}
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
                    </a>
                    <Collapse
                      in={
                        isOpenCollapse === menuListkey.toString() ||
                        isOpenCollapse?.includes(menuListkey + '-')
                      }
                    >
                      <ul id="wr_list_submenu" className="list-unstyled">
                        {menuList.submenu.map((value, menuListSubkey) => {
                          return (
                            <li key={menuListSubkey} className={`item_menu`}>
                              {value.link && (
                                <a
                                  href="#"
                                  onClick={(e) => handleChangeLink(e, value.page)}
                                  className={`d-block px-24 py-16 link_menu text-white text-decoration-none ${
                                    biStore.biListViewModel.integrationLink === value.page
                                      ? 'active'
                                      : ''
                                  }`}
                                >
                                  {value?.mini_text ? (
                                    <span className="mini-text-wrapper">
                                      <span className="mini-text">{t(value?.mini_text)}</span>
                                      <span className="text">{t(value.text)}</span>
                                    </span>
                                  ) : (
                                    <span className="text d-inline-block">{t(value.text)}</span>
                                  )}
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
    </aside>
  );
});

export default SbarLeftIntegration;
