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
    text: 'txt_menu_visitors',
    link: `/visitors`,
    icons: env.PUBLIC_URL + '/assets/images/visitors.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/visitors.svg',
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
        text: 'txt_menu_user_experience',
        mini_text: 'txt_menu_locations',
        link: `/visitors/flow`,
        page: 'visitors-flow',
      },
    ],
  },
  {
    text: 'txt_menu_behavior',
    link: `/behavior`,
    icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
    submenu: [
      {
        text: 'txt_menu_pages',
        mini_text: 'txt_menu_pages',
        link: `/behavior`,
        page: 'behavior',
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
    text: 'txt_menu_consents',
    link: `/consents`,
    icons: env.PUBLIC_URL + '/assets/images/audience.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
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

export { mainMenu, integrationMenu };
