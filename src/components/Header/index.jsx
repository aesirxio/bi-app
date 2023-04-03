/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons/faQuestionCircle';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';

import './index.scss';

import DropdownAvatar from '../DropdownAvatar';

import ComponentHambuger from '../ComponentHambuger';
import ComponentImage from '../ComponentImage';
// import Search from 'components/Search';
import SwitchThemes from 'components/SwitchThemes/index';
import Select from 'components/Select/index';
import 'moment/locale/vi';
import 'moment/locale/es';
import 'moment/locale/hr';
import 'moment/locale/uk';
import 'moment/locale/de';
import 'moment/locale/th';
import moment from 'moment';
import { env } from 'env';
import { Collapse, Button } from 'react-bootstrap';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const DataStream = observer(() => {
  const [isOpenCollapse, setIsOpenCollapse] = useState('default');

  const { path } = useRouteMatch();
  const { t } = useTranslation('common');
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

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMini: props?.integration ? true : false,
    };
  }

  componentDidMount() {
    if (this.state.isMini) {
      document.querySelector('#biapp').classList.add('mini_left');
    }
  }

  handleCollap = () => {
    const { isMini } = this.state;
    document.querySelector('#biapp').classList.toggle('mini_left');
    this.setState({
      isMini: !isMini,
    });
  };

  handleMenuLeft = () => {
    document.querySelector('#biapp').classList.toggle('show_menu_left');
  };

  render() {
    const { t, integration = false, noavatar = false, i18n } = this.props;
    let { isMini } = this.state;

    const listLanguages = Object.keys(i18n.options.resources).map(function (key) {
      return {
        value: key,
        label: i18n.options.resources[key].title,
        icon: i18n.options.resources[key].icon,
      };
    });
    const currentLanguage = listLanguages.filter((lang) => {
      if (lang.value == i18n.language) {
        return lang;
      }
    });

    moment.locale(i18n.language);
    return (
      <div
        id="all_header"
        className={`wrapper_header d-flex position-fixed w-100 ${
          integration ? 'top-30px' : 'top-0'
        } left-0 right-0 pr-3 align-items-center shadow-sm z-index-100 bg-white`}
      >
        <ComponentHambuger handleAction={this.handleMenuLeft} />
        <div className="wrapper_header_logo d-xl-flex d-none bg-dark w-248 h-80 align-items-center">
          <a
            href={window.location.href}
            className={`header_logo d-block ${isMini ? 'mx-auto' : 'mx-3'}`}
          >
            <ComponentImage
              className={`logo_white ${isMini ? 'pe-0' : 'pe-3 pe-lg-6'}`}
              src={`${
                isMini
                  ? env.PUBLIC_URL + '/assets/images/logo/logo-white-mini.svg'
                  : env.PUBLIC_URL + '/assets/images/logo/logo-white.svg'
              }`}
              alt="R Digital"
            />
          </a>
        </div>
        <div className="content_header h-80 border-start-1 border-gray-300 flex-1 d-flex align-items-center ps-2 ps-lg-4 position-relative w-50 w-lg-100">
          <span
            className="
              item_collap
              d-flex
              position-absolute
              text-green
              bg-blue-1
              rounded-circle
              align-items-center
              justify-content-center
              fs-12
              cursor-pointer
            "
            onClick={this.handleCollap}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </span>
          <div className="d-flex justify-content-end flex-1 align-items-center">
            <DataStream />

            {/* <Search /> */}
            <div className="ms-auto d-flex align-items-center">
              <Select
                isClearable={false}
                isSearchable={false}
                isBorder={false}
                isShadow={false}
                options={listLanguages}
                getOptionLabel={(options) => (
                  <div className="language-option d-flex align-items-center">
                    <img
                      className="me-1 rounded-2"
                      width={20}
                      height={20}
                      src={options.icon}
                      alt={options.label}
                    />
                    <span>{options.label}</span>
                  </div>
                )}
                className="shadow-none select-bg-white"
                onChange={(data) => {
                  i18n.changeLanguage(data.value);
                }}
                defaultValue={currentLanguage}
              />
            </div>
            <div className="switch-theme-button col-auto py-2 px-3">
              <SwitchThemes />
            </div>
            <div className="d-flex align-items-center">
              <div className="wr_help_center ps-3 pe-3 d-none">
                <span className="item_help d-flex align-items-center text-blue-0 cursor-pointer">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  <span className="text white-spacing-nowrap ps-2">{t('txt_help_center')}</span>
                </span>
              </div>

              {!noavatar && (
                <div className="ps-3 pe-3">
                  <DropdownAvatar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('common')(Header);
