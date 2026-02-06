/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy, Suspense, useEffect, useState } from 'react';

import { BiStoreProvider, useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { BiViewModel } from '../../store/BiStore/BiViewModel';
import 'scss/app.scss';

import { observer } from 'mobx-react';
import { Spinner, LoginPage } from 'aesirx-uikit';
import { AppProvider } from 'aesirx-uikit';
import { authRoutes, mainRoutes } from '../../routes/routes';
import { DataStream } from '../../components/DataStream';
import { appLanguages } from '../../translations';
import SbarLeftIntegration from './SbarLeftIntegration';
import { env, Storage } from 'aesirx-lib';
import { freemiumMainMenu, proMainMenu } from 'routes/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getLicense } from 'utils';

const DashboardPage = lazy(() => import('../../containers/Dashboard'));
const UTMTrackingPage = lazy(() => import('../../containers/UTMTrackingPage'));
const EventsPage = lazy(() => import('../../containers/EventsPage'));
const VisitorsPage = lazy(() => import('../../containers/VisitorsPage'));
const FlowListPage = lazy(() => import('../../containers/FlowListPage'));
const FlowPage = lazy(() => import('../../containers/FlowDetailPage'));
const RegionCountryPage = lazy(() => import('../../containers/RegionCountryPage'));
const WoocommercePage = lazy(() => import('../../containers/WoocommercePage'));
const AcquisitionPage = lazy(() => import('../../containers/AcquisitionPage'));
const SearchEnginePage = lazy(() => import('../../containers/SearchEnginePage'));
const AcquisitionCampaignPage = lazy(() => import('../../containers/AcquisitionCampaignPage'));
const OutlinkPage = lazy(() => import('../../containers/OutlinkPage'));
const UserFlowPage = lazy(() => import('../../containers/UserFlowPage'));
const PlatformsPage = lazy(() => import('../../containers/PlatformsPage'));
const ConsentsPage = lazy(() => import('../../containers/ConsentsPage'));
const ConsentsTemplatePage = lazy(() => import('../../containers/ConsentsTemplatePage'));
const ConsentsAdvancePage = lazy(() => import('../../containers/ConsentsAdvancePage'));
const EventsDetailPage = lazy(() => import('../../containers/EventsDetailPage'));

const UtmLinkPage = lazy(() => import('../../containers/UTMLinkPage'));
const EditUtmLinkProvider = lazy(() => import('../../containers/UTMLinkPage/edit'));
const TagEventPage = lazy(() => import('../../containers/TagEventPage'));
const EditTagEventProvider = lazy(() => import('../../containers/TagEventPage/edit'));
const RealTimePage = lazy(() => import('../../containers/RealTimePage'));

const biViewModel = new BiViewModel();

const MainLayoutIntegration = (props) => {
  const isAuthenticated = Storage.getItem('auth');
  const [isFreemium, setIsFreemium] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsFreemium(true);
      if (window.env.STORAGE === 'internal' && window.env.LICENSE) {
        if (window.env.LICENSE === 'trial') {
          setIsFreemium(false);
        } else {
          const response = await getLicense(window.env.LICENSE);
          if (
            response?.data?.result?.success &&
            response?.data?.result?.subscription_product === 'product-aesirx-analytics'
          ) {
            setIsFreemium(false);
          }
        }
      }
    };
    init();
  }, []);
  return (
    <BiStoreProvider viewModel={biViewModel}>
      <AppProvider
        appLanguages={appLanguages}
        authRoutes={authRoutes}
        mainRoutes={mainRoutes}
        isLogin={() => true}
        componentHeader={<DataStream integration={true} />}
        integration={true}
        isFreemium={isFreemium}
        leftMenu={<SbarLeftIntegration isFreemium={isFreemium} />}
        rootId="#biapp"
        noavatar={true}
        isColorMode={false}
      >
        <div className="bi-intergration_layout">
          {!isAuthenticated && window.env.STORAGE === 'external' ? (
            <LoginPage text="BI" />
          ) : (
            <App {...props} integration={true} isFreemium={isFreemium} />
          )}
        </div>
      </AppProvider>
    </BiStoreProvider>
  );
};

String.prototype.startsWith = function (str) {
  return this.indexOf(str) === 0;
};

const RenderComponent = ({ link, ...props }) => {
  const isFreemium = props?.isFreemium ?? true;

  if (
    isFreemium &&
    ([
      'woocommerce',
      'woocommerce-product',
      'consents',
      'consents-template',
      'consents-advance',
      'flow-list',
      'visitors-realtime',
      'tag-events',
      'tag-events-add',
      'tag-events-link',
      'utm-links',
      'utm-links-add',
      'utm-links-link',
    ].includes(link) ||
      link.startsWith('flow') ||
      link.startsWith('events-detail') ||
      link.startsWith('tag-events-edit') ||
      link.startsWith('utm-links-edit'))
  ) {
    return <DashboardPage {...props} />;
  }

  switch (link) {
    case 'visitors':
      return <VisitorsPage {...props} />;

    case 'visitors-locations':
      return <RegionCountryPage {...props} />;

    case 'visitors-behavior':
      return <VisitorsPage {...props} />;

    case 'visitors-realtime':
      return <RealTimePage {...props} />;

    case 'flow-list':
      return <FlowListPage {...props} />;

    case 'visitors-platforms':
      return <PlatformsPage {...props} />;

    case 'behavior':
      return <VisitorsPage {...props} />;

    case 'behavior-events':
      return <EventsPage {...props} />;

    case 'behavior-outlinks':
      return <OutlinkPage {...props} />;

    case 'behavior-users-flow':
      return <UserFlowPage {...props} />;

    case 'behavior-events-generator':
      return <EventsPage {...props} />;

    case 'tag-events':
      return <TagEventPage {...props} />;

    case 'tag-events-link':
      return <EditTagEventProvider isLink {...props} />;

    case link.startsWith('tag-events-edit') ? link : '':
      return <EditTagEventProvider {...props} />;

    case 'utm-links':
      return <UtmLinkPage {...props} />;

    case 'utm-links-add':
      return <EditUtmLinkProvider {...props} />;

    case 'utm-links-link':
      return <EditUtmLinkProvider isLink {...props} />;

    case link.startsWith('utm-links-edit') ? link : '':
      return <EditUtmLinkProvider {...props} />;

    case 'utm-tracking':
      return <UTMTrackingPage {...props} />;

    case 'acquisition':
      return <AcquisitionPage {...props} />;

    case 'acquisition-search-engines':
      return <SearchEnginePage {...props} />;

    case 'acquisition-campaigns':
      return <AcquisitionCampaignPage {...props} />;

    case 'utm-tracking-generator':
      return <UTMTrackingPage {...props} />;

    case 'woocommerce':
      return <WoocommercePage {...props} />;

    case 'woocommerce-product':
      return <WoocommercePage {...props} />;

    case 'consents':
      return <ConsentsPage {...props} />;

    case 'consents-template':
      return <ConsentsTemplatePage {...props} />;

    case 'consents-advance':
      return <ConsentsAdvancePage {...props} />;

    case link.startsWith('flow') ? link : '':
      return <FlowPage {...props} />;

    case link.startsWith('events-detail') ? link : '':
      return <EventsDetailPage {...props} />;
    default:
      return <DashboardPage {...props} />;
  }
};
const App = observer((props) => {
  const {
    biListViewModel: { integrationLink, activeDomain, setIntegrationLink, setDataStream },
  } = useBiViewModel();
  const { t } = useTranslation();
  const [menuList, setMenuList] = useState(proMainMenu);

  const handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      setIntegrationLink(link);
    }
  };

  useEffect(() => {
    if (props?.isFreemium) {
      setMenuList(freemiumMainMenu);
    } else {
      setMenuList(proMainMenu);
    }
  }, [props?.isFreemium]);

  useEffect(() => {
    setDataStream(activeDomain, true);
  }, []);

  useEffect(() => {
    setDataStream(activeDomain, true);
  }, [integrationLink]);

  return (
    <Suspense fallback={<Spinner />}>
      {menuList ? (
        <div className="menu_intergration d-flex flex-wrap mt-2 mx-4">
          {menuList?.map((menuList, menuListKey) => {
            return (
              <div key={menuListKey} className={`item_menu mb-0 intergration`}>
                {menuList?.link && (
                  <>
                    {menuList?.submenu ? (
                      <NavHoverDropDown>
                        <Dropdown.Toggle
                          className={`d-flex align-items-center me-3 px-4 py-10 mb-1 text-decoration-none fw-medium border rounded-pill bg-white text-primary ${
                            integrationLink === menuList.page ? 'active' : ''
                          }`}
                        >
                          {menuList?.icons_fa ? (
                            <i>
                              <FontAwesomeIcon icon={menuList?.icons_fa} />
                            </i>
                          ) : (
                            <span
                              className="icon d-inline-block align-text-bottom me-2"
                              style={{
                                WebkitMaskImage: `url(${menuList?.icons_color})`,
                                WebkitMaskRepeat: 'no-repeat',
                                backgroundColor: '#222328',
                              }}
                            ></span>
                          )}
                          <span className="text d-inline-block fs-sm">{t(menuList?.text)}</span>
                          <i className="ps-1 icons text-primary mt-n1">
                            <FontAwesomeIcon icon={faChevronDown} />
                          </i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="dropdown-menu border py-0 mt-2">
                          {menuList?.submenu?.map((submenuList, submenuListKey) => {
                            return (
                              <div
                                key={submenuListKey}
                                className={`subitem_menu text px-3 fs-sm cursor-pointer ${
                                  integrationLink === submenuList.page ? 'active' : ''
                                }`}
                                onClick={(e) => handleChangeLink(e, submenuList?.page)}
                              >
                                <div className="w-100 py-2 border-bottom">
                                  {t(submenuList?.text)}
                                </div>
                              </div>
                            );
                          })}
                        </Dropdown.Menu>
                      </NavHoverDropDown>
                    ) : (
                      <a
                        href={`${menuList?.page === 'cmp' ? `${env.REACT_APP_CMP_LINK}` : '#'} `}
                        {...(menuList?.page === 'cmp' ? { target: '_blank' } : {})}
                        onClick={(e) => {
                          if (menuList?.page !== 'cmp') {
                            handleChangeLink(e, menuList?.page);
                          }
                        }}
                        className={`d-flex align-items-center me-3 px-4 py-10 text-decoration-none fw-medium border rounded-pill ${
                          integrationLink === menuList.page ? 'active' : ''
                        } ${menuList?.page === 'cmp' && !env.REACT_APP_CMP_LINK ? 'd-none' : ''}`}
                      >
                        {menuList?.icons_fa ? (
                          <i>
                            <FontAwesomeIcon icon={menuList?.icons_fa} />
                          </i>
                        ) : (
                          <span
                            className="icon d-inline-block align-text-bottom me-2"
                            style={{
                              WebkitMaskImage: `url(${menuList?.icons_color})`,
                              WebkitMaskRepeat: 'no-repeat',
                              backgroundColor: '#222328',
                            }}
                          ></span>
                        )}
                        <span className="text d-inline-block fs-sm">{t(menuList?.text)}</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      <RenderComponent link={integrationLink} activeDomain={activeDomain} {...props} />
    </Suspense>
  );
});

const NavHoverDropDown = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleMouseOver = () => {
    setDropdownOpen(true);
  };
  const handleMouseOut = () => {
    setDropdownOpen(false);
  };
  return (
    <Dropdown
      className="pb-2"
      autoClose="outside"
      show={dropdownOpen}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      {props.children}
    </Dropdown>
  );
};

export default MainLayoutIntegration;
