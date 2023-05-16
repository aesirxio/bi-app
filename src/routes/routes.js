/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { lazy } from 'react';

const LoginPage = lazy(() => import('containers/LoginPage'));

const DashboardPage = lazy(() => import('containers/Dashboard'));
const AudiencePage = lazy(() => import('containers/AudiencePage'));
const RevenuePage = lazy(() => import('containers/RevenuePage'));
const UTMTrackingPage = lazy(() => import('containers/UTMTrackingPage'));
const EventsPage = lazy(() => import('containers/EventsPage'));

const SubscriptionPage = lazy(() => import('containers/SubscriptionPage'));
const MemberRolesPage = lazy(() => import('containers/MemberRolesPage'));
const DataStreamPage = lazy(() => import('containers/DataStreamPage'));
const RegionCountryPage = lazy(() => import('containers/RegionCountryPage'));
const SettingPage = lazy(() => import('containers/SettingPage'));
const HelpCenterPage = lazy(() => import('containers/HelpCenterPage'));
const FlowPage = lazy(() => import('containers/FlowDetailPage'));

const authRoutes = [
  {
    path: '/login',
    exact: true,
    main: () => <LoginPage />,
  },
];

const mainRoutes = [
  {
    path: ['/:domain', '/'],
    exact: true,
    page: ['dashboard'],
    main: () => <DashboardPage />,
  },
  {
    path: ['/:domain/audience/overview', '/:domain/audience/behavior'],
    exact: true,
    page: ['audience-overview', 'audience-behavior'],
    main: () => <AudiencePage />,
  },
  { path: '/:domain/revenue', exact: true, main: () => <RevenuePage /> },
  {
    path: ['/:domain/utm-tracking', '/:domain/utm-tracking/generator'],
    page: ['utm-tracking', 'utm-tracking-generator'],
    exact: true,
    main: () => <UTMTrackingPage />,
  },
  {
    path: ['/:domain/events', '/:domain/events/generator'],
    page: ['events', 'events-generator'],
    exact: true,
    main: () => <EventsPage />,
  },
  {
    path: ['/:domain/flow/:uuid'],
    exact: true,
    page: ['flow/:uuid'],
    main: () => <FlowPage />,
  },
  {
    path: '/:domain/subscription',
    exact: true,
    main: () => <SubscriptionPage />,
  },
  {
    path: '/:domain/member-roles',
    exact: true,
    main: () => <MemberRolesPage />,
  },
  {
    path: '/:domain/data-stream',
    exact: true,
    main: () => <DataStreamPage />,
  },
  {
    path: ['/setting', '/setting/configuration'],
    exact: true,
    main: () => <SettingPage />,
  },
  {
    path: '/:domain/region-country',
    exact: true,
    main: () => <RegionCountryPage />,
  },
  {
    path: '/help-center',
    exact: true,
    main: () => <HelpCenterPage />,
  },
];

const settingRoutes = [];

export { authRoutes, mainRoutes, settingRoutes };
