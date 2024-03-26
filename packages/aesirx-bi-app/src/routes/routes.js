/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';
import { LoginPage, ProfilePage } from 'aesirx-uikit';
const DashboardPage = lazy(() => import('../containers/Dashboard'));
const PageDetail = lazy(() => import('../containers/PageDetail'));
const AcquisitionPage = lazy(() => import('../containers/AcquisitionPage'));
const AcquisitionDetail = lazy(() => import('../containers/AcquisitionDetail'));
const SearchEnginePage = lazy(() => import('../containers/SearchEnginePage'));
const AcquisitionCampaignPage = lazy(() => import('../containers/AcquisitionCampaignPage'));
const VisitorsPage = lazy(() => import('../containers/VisitorsPage'));
const RevenuePage = lazy(() => import('../containers/RevenuePage'));
const UTMTrackingPage = lazy(() => import('../containers/UTMTrackingPage'));
const EventsPage = lazy(() => import('../containers/EventsPage'));
const EventsDetailPage = lazy(() => import('../containers/EventsDetailPage'));
const WoocommercePage = lazy(() => import('../containers/WoocommercePage'));
const ConsentsPage = lazy(() => import('../containers/ConsentsPage'));

const RegionCountryPage = lazy(() => import('../containers/RegionCountryPage'));
const FlowListPage = lazy(() => import('../containers/FlowListPage'));
const FlowPage = lazy(() => import('../containers/FlowDetailPage'));
const PlatformsPage = lazy(() => import('../containers/PlatformsPage'));

const authRoutes = [
  {
    path: '/login',
    exact: true,
    main: () => <LoginPage text="BI" />,
  },
];

const mainRoutes = [
  {
    path: ['/'],
    exact: true,
    page: ['dashboard'],
    main: () => <DashboardPage />,
  },
  {
    path: ['/visitors', '/behavior'],
    exact: true,
    page: ['visitors', 'behavior'],
    main: () => <VisitorsPage />,
  },
  {
    path: ['/acquisition'],
    exact: true,
    page: ['acquisition'],
    main: () => <AcquisitionPage />,
  },
  {
    path: ['/acquisition/detail'],
    exact: true,
    page: ['acquisition-detail'],
    main: () => <AcquisitionDetail />,
  },
  {
    path: ['/acquisition/search-engines'],
    exact: true,
    page: ['acquisition-search-engines'],
    main: () => <SearchEnginePage />,
  },
  {
    path: ['/acquisition/campaigns'],
    exact: true,
    page: ['acquisition-campaigns'],
    main: () => <AcquisitionCampaignPage />,
  },
  {
    path: ['/behavior/detail'],
    exact: true,
    page: ['behavior/detail'],
    main: () => <PageDetail />,
  },
  { path: '/revenue', exact: true, main: () => <RevenuePage /> },
  {
    path: ['/utm-tracking', '/utm-tracking/generator'],
    page: ['utm-tracking', 'utm-tracking-generator'],
    exact: true,
    main: () => <UTMTrackingPage />,
  },
  {
    path: ['/behavior/events', '/behavior/events-generator'],
    page: ['behavior-events', 'behavior-events-generator'],
    exact: true,
    main: () => <EventsPage />,
  },
  {
    path: ['/behavior/events/:eventName'],
    exact: true,
    page: ['behavior/events/:eventName'],
    main: () => <EventsDetailPage />,
  },
  {
    path: ['/woocommerce', '/woocommerce/product'],
    page: ['woocommerce', 'woocommerce-product'],
    exact: true,
    main: () => <WoocommercePage />,
  },
  {
    path: ['/flow/:uuid'],
    exact: true,
    page: ['flow/:uuid'],
    main: () => <FlowPage />,
  },
  {
    path: '/visitors/locations',
    page: 'visitors-locations',
    exact: true,
    main: () => <RegionCountryPage />,
  },
  {
    path: '/visitors/flow',
    page: 'visitors-flow',
    exact: true,
    main: () => <FlowListPage />,
  },
  {
    path: ['/consents'],
    page: ['consents'],
    exact: true,
    main: () => <ConsentsPage />,
  },
  {
    path: '/visitors/platforms',
    page: 'platforms',
    exact: true,
    main: () => <PlatformsPage />,
  },
];

const settingRoutes = [
  {
    path: '/profile',
    exact: false,
    main: () => <ProfilePage />,
  },
];

const integrationRoutes = () =>
  mainRoutes.map((item) => {
    if (Array.isArray(item.path)) {
      item.path = item.path.map((path) => '/bi' + path);
    } else {
      item.path = '/bi' + item.path;
    }

    return item;
  });

export { authRoutes, mainRoutes, settingRoutes, integrationRoutes };
