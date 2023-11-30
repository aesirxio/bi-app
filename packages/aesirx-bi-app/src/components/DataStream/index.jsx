/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { mainMenu } from 'routes/menu';

const DataStream = observer(({ integration }) => {
  const [isOpenCollapse, setIsOpenCollapse] = useState('default');
  const { t } = useTranslation();
  const biStore = useBiViewModel();

  // const { pathname } = useLocation();

  const handleChangeDataStream = (value) => {
    handleOpen('');
    biStore.biListViewModel.setActiveDomain(value);
  };

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

  return (
    <>
      {integration ? (
        <>
          {mainMenu?.map((menuList) => {
            if (
              biStore?.biListViewModel?.integrationLink === menuList?.link?.replace('/', '') ||
              menuList?.submenu?.find((i) => i?.page === biStore?.biListViewModel?.integrationLink)
            ) {
              return menuList?.submenu?.map((value, menuListSubkey) => {
                return (
                  <div key={menuListSubkey} className={`item_menu intergration`}>
                    {value.link && (
                      <a
                        href="#"
                        onClick={(e) => handleChangeLink(e, value.page)}
                        className={`d-block me-24 py-16 text-decoration-none fw-medium ${
                          biStore.biListViewModel.integrationLink === value.page ? 'active' : ''
                        }`}
                      >
                        <span className="text d-inline-block">{t(value.text)}</span>
                      </a>
                    )}
                  </div>
                );
              });
            }
          })}
        </>
      ) : (
        <>
          <div className="data-stream position-relative item_menu m-0 h-100 z-index-100">
            <Button
              variant=""
              onClick={() => handleOpen('data-stream')}
              className={`d-flex align-items-center justify-content-start rounded-2 link_menu text-decoration-none text-break p-0 px-1 w-100 h-100 shadow-none ${
                isOpenCollapse === 'data-stream' ? 'active' : ''
              }`}
              aria-controls="wr_list_submenu"
              aria-expanded={isOpenCollapse === 'data-stream'}
              style={{ minWidth: '200px' }}
            >
              <p className="overflow-hidden text-start m-0">
                <span className="mb-sm fs-12 text-gray-heading">{t('txt_menu_data_stream')}</span>
                <br />
                <span className="text-body fw-semibold text-white mb-0 fs-5 text-start">
                  {
                    biStore.biListViewModel?.listDomain?.find(
                      (x) => x.domain === biStore.biListViewModel?.activeDomain
                    )?.name
                  }
                </span>
              </p>
              {biStore.biListViewModel?.listDomain.length > 1 && (
                <i className="ps-1 icons text-green">
                  <FontAwesomeIcon icon={faChevronDown} />
                </i>
              )}
            </Button>
            <Collapse className="position-relative" in={isOpenCollapse === 'data-stream'}>
              <ul
                className="px-16 position-absolute bg-white shadow-lg rounded-1 w-100 top-100 start-0 list-unstyled mb-0 overflow-auto"
                style={{ maxHeight: '320px' }}
              >
                {biStore.biListViewModel?.listDomain.map((item, index) => {
                  return (
                    item.domain !== biStore.biListViewModel?.activeDomain && (
                      <li
                        key={index}
                        className={`item_menu cursor-pointer mb-0`}
                        onClick={() => handleChangeDataStream(item.domain)}
                      >
                        <div className={`text-decoration-none border-bottom`}>
                          <div
                            className={`d-block py-2 link_menu text-decoration-none fs-5 fw-semibold `}
                          >
                            {item.name}
                            <div className="fs-12 text-gray-heading fw-normal">{item.domain}</div>
                          </div>
                        </div>
                      </li>
                    )
                  );
                })}
              </ul>
            </Collapse>
          </div>
        </>
      )}
    </>
  );
});

export { DataStream };
