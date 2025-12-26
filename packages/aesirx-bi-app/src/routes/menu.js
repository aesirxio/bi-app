import { env } from 'aesirx-lib';

const mainMenu = [
  {
    text: 'txt_menu_dashboard',
    link: `/`,
    icons: env.PUBLIC_URL + '/assets/images/dashboard.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/dashboard.svg',
    page: 'dashboard',
  },
  {
    text: 'txt_menu_acquisition',
    link: `/acquisition`,
    icons: env.PUBLIC_URL + '/assets/images/acquisition.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/acquisition.svg',
    page: 'acquisition',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_acquisition',
        link: `/acquisition`,
        page: 'acquisition',
      },
      {
        text: 'txt_menu_search_engines',
        mini_text: 'txt_menu_search_engines',
        link: `/acquisition/search-engines`,
        page: 'acquisition-search-engines',
      },
      {
        text: 'txt_menu_campaigns',
        mini_text: 'txt_menu_campaigns',
        link: `/acquisition/campaigns`,
        page: 'acquisition-campaigns',
      },
    ],
  },
  {
    text: 'txt_menu_behavior',
    link: `/behavior`,
    icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
    page: 'behavior',
    submenu: [
      {
        text: 'txt_menu_pages',
        mini_text: 'txt_menu_pages',
        link: `/behavior`,
        page: 'behavior',
      },
      {
        text: 'txt_menu_outlinks',
        mini_text: 'txt_menu_outlinks',
        link: `/behavior/outlinks`,
        page: 'behavior-outlinks',
      },
      {
        text: 'txt_menu_events',
        mini_text: 'txt_menu_events',
        link: `/behavior/events`,
        page: 'behavior-events',
      },
      {
        text: 'Tag Value Mapping',
        mini_text: 'Tag Value Mapping',
        link: `/tag-events`,
        page: 'tag-events',
      },
    ],
  },
  {
    text: 'txt_menu_utm_tracking',
    link: `/utm-tracking`,
    icons: env.PUBLIC_URL + '/assets/images/utm-tracking.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/utm-tracking.svg',
    page: 'utm-tracking',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_utm_tracking',
        link: `/utm-tracking`,
        page: 'utm-tracking',
      },
      {
        text: 'txt_menu_generator',
        mini_text: 'txt_menu_generator',
        link: `/utm-links/add`,
        page: 'utm-links-add',
      },
      {
        text: 'UTM Value Mapping',
        mini_text: 'UTM Value Mapping',
        link: `/utm-links`,
        page: 'utm-links',
      },
    ],
  },
  {
    text: 'txt_menu_visitors',
    link: `/visitors`,
    icons: env.PUBLIC_URL + '/assets/images/visitors.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/visitors.svg',
    page: 'visitors',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_visitors',
        link: `/visitors`,
        page: 'visitors',
      },
      {
        text: 'txt_menu_locations',
        mini_text: 'txt_menu_locations',
        link: `/visitors/locations`,
        page: 'visitors-locations',
      },
      {
        text: 'txt_menu_platforms',
        mini_text: 'txt_menu_platforms',
        link: `/visitors/platforms`,
        page: 'visitors-platforms',
      },
      {
        text: 'Real-Time',
        mini_text: 'Real-Time',
        link: `/visitors/realtime`,
        page: 'visitors-realtime',
      },
    ],
  },
  {
    text: 'txt_menu_user_experience',
    link: `/flow-list`,
    page: 'flow-list',
    icons: env.PUBLIC_URL + '/assets/images/ux.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/ux.svg',
  },

  {
    ...(env.REACT_APP_WOOCOMMERCE_MENU === 'true'
      ? {
          text: 'txt_menu_woocommerce',
          link: `/woocommerce`,
          page: 'woocommerce',
          icons: env.PUBLIC_URL + '/assets/images/woocommerce.svg',
          icons_color: env.PUBLIC_URL + '/assets/images/woocommerce.svg',
          submenu: [
            {
              text: 'txt_menu_overview',
              mini_text: 'txt_menu_woocommerce',
              link: `/woocommerce`,
              page: 'woocommerce',
            },
            {
              text: 'txt_menu_products',
              mini_text: 'txt_menu_products',
              link: `/woocommerce/product`,
              page: 'woocommerce-product',
            },
          ],
        }
      : {}),
  },
];

const freemiumMainMenu = [
  {
    text: 'txt_menu_dashboard',
    link: `/`,
    icons: env.PUBLIC_URL + '/assets/images/dashboard.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/dashboard.svg',
    page: 'dashboard',
  },
  {
    text: 'txt_menu_acquisition',
    link: `/acquisition`,
    icons: env.PUBLIC_URL + '/assets/images/acquisition.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/acquisition.svg',
    page: 'acquisition',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_acquisition',
        link: `/acquisition`,
        page: 'acquisition',
      },
      {
        text: 'txt_menu_search_engines',
        mini_text: 'txt_menu_search_engines',
        link: `/acquisition/search-engines`,
        page: 'acquisition-search-engines',
      },
      {
        text: 'txt_menu_campaigns',
        mini_text: 'txt_menu_campaigns',
        link: `/acquisition/campaigns`,
        page: 'acquisition-campaigns',
      },
    ],
  },
  {
    text: 'txt_menu_behavior',
    link: `/behavior`,
    icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
    page: 'behavior',
    submenu: [
      {
        text: 'txt_menu_pages',
        mini_text: 'txt_menu_pages',
        link: `/behavior`,
        page: 'behavior',
      },
      {
        text: 'txt_menu_outlinks',
        mini_text: 'txt_menu_outlinks',
        link: `/behavior/outlinks`,
        page: 'behavior-outlinks',
      },
      {
        text: 'txt_menu_events',
        mini_text: 'txt_menu_events',
        link: `/behavior/events`,
        page: 'behavior-events',
      },
    ],
  },
  {
    text: 'txt_menu_utm_tracking',
    link: `/utm-tracking`,
    icons: env.PUBLIC_URL + '/assets/images/utm-tracking.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/utm-tracking.svg',
    page: 'utm-tracking',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_utm_tracking',
        link: `/utm-tracking`,
        page: 'utm-tracking',
      },
      {
        text: 'txt_menu_generator',
        mini_text: 'txt_menu_generator',
        link: `/utm-tracking/generator`,
        page: 'utm-tracking-generator',
      },
    ],
  },
  {
    text: 'txt_menu_visitors',
    link: `/visitors`,
    icons: env.PUBLIC_URL + '/assets/images/visitors.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/visitors.svg',
    page: 'visitors',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_visitors',
        link: `/visitors`,
        page: 'visitors',
      },
      {
        text: 'txt_menu_platforms',
        mini_text: 'txt_menu_platforms',
        link: `/visitors/platforms`,
        page: 'visitors-platforms',
      },
    ],
  },
  {
    text: 'CMP',
    link: `/cmp`,
    icons: env.PUBLIC_URL + '/assets/images/audience.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
    page: 'cmp',
  },
];

const getMainMenu = (isAdmin = false) => {
  const mainMenuDashboard = [
    ...mainMenu,
    ...(isAdmin
      ? [
          {
            text: 'User Handling',
            mini_text: 'User Handling',
            link: `/user-handling`,
            icons: env.PUBLIC_URL + '/assets/images/visitors.svg',
            icons_color: env.PUBLIC_URL + '/assets/images/visitors.svg',
          },
        ]
      : []),
  ];
  return mainMenuDashboard;
};

const integrationMenu = () => {
  return [
    ...mainMenu.map((item) => {
      item.link = '/bi' + item.link;
      return item;
    }),
    {
      text: 'txt_menu_behavior',
      link: `/bi/behavior`,
      page: 'behavior',
    },
  ];
};

export { mainMenu, freemiumMainMenu, getMainMenu, integrationMenu };
