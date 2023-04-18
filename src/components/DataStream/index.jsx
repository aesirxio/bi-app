/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React, { useState } from 'react';
import { Collapse, Button } from 'react-bootstrap';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DataStream = observer(() => {
  const [isOpenCollapse, setIsOpenCollapse] = useState('default');

  const { path } = useRouteMatch();
  const { t } = useTranslation();
  const biStore = useBiViewModel();
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

  return (
    <div className="data-stream position-relative item_menu m-0 h-100">
      <Button
        variant=""
        onClick={() => handleOpen('data-stream')}
        className={`d-flex align-items-center justify-content-start rounded-2 link_menu text-decoration-none text-break p-0 px-1 w-100 h-100 shadow-none ${
          isOpenCollapse === 'data-stream' ? 'active' : ''
        }`}
        aria-controls="wr_list_submenu"
        aria-expanded={isOpenCollapse === 'data-stream'}
      >
        <p className="overflow-hidden text-start m-0">
          <span className="text-blue-0 mb-sm fs-sm">{t('txt_menu_data_stream')}</span>
          <br />
          <span className=" fw-bold text-blue-0  text-white mb-0 fs-4 text-start">
            {' '}
            {
              biStore.biListViewModel?.listDomain?.find(
                (x) => x.domain === biStore.biListViewModel?.activeDomain
              )?.name
            }{' '}
            ({biStore.biListViewModel?.activeDomain})
          </span>
        </p>
        <i className="ps-1 icons text-green">
          <FontAwesomeIcon icon={faChevronDown} />
        </i>
      </Button>
      <Collapse className="position-relative" in={isOpenCollapse === 'data-stream'}>
        <ul className="px-16 position-absolute bg-white shadow-lg rounded-1 w-100 top-100 start-0 list-unstyled mb-0 mh-80vh overflow-auto">
          {biStore.biListViewModel?.listDomain.map((item, index) => {
            return (
              item.domain !== biStore.biListViewModel?.activeDomain && (
                <li
                  key={index}
                  className={`item_menu cursor-pointer`}
                  onClick={() => handleChangeDataStream(item.domain)}
                >
                  <NavLink
                    exact={true}
                    to={`${path && path.replace(':domain', item.domain)}`}
                    className={`text-decoration-none`}
                    activeClassName={`active`}
                  >
                    <span
                      className={`d-block py-16 link_menu text-blue-0 text-decoration-none  ${
                        biStore.biListViewModel?.listDomain.length - 1 === index
                          ? ''
                          : 'border-bottom-1 border-gray-800'
                      }`}
                    >
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              )
            );
          })}
        </ul>
      </Collapse>
    </div>
  );
});

export default DataStream;
