/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';
import {
  LoginPage,
  ProfilePage,
  DigitalAssetsPage,
  MembersPage,
  EditMemberProvider,
  history,
} from 'aesirx-uikit';
const DashboardPage = lazy(() => import('../containers/Dashboard'));
const VisitorsPage = lazy(() => import('../containers/VisitorsPage'));
const RevenuePage = lazy(() => import('../containers/RevenuePage'));
const UTMTrackingPage = lazy(() => import('../containers/UTMTrackingPage'));
const EventsPage = lazy(() => import('../containers/EventsPage'));
const WoocommercePage = lazy(() => import('../containers/WoocommercePage'));

const RegionCountryPage = lazy(() => import('../containers/RegionCountryPage'));
const FlowPage = lazy(() => import('../containers/FlowDetailPage'));

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
    path: ['/woocommerce'],
    page: ['woocommerce'],
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
