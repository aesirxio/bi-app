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
    text: 'txt_menu_audience',
    link: `/audience/overview`,
    icons: env.PUBLIC_URL + '/assets/images/audience.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_audience',
        link: `/audience/overview`,
        page: 'audience-overview',
      },
      {
        text: 'txt_menu_behavior',
        link: `/audience/behavior`,
        page: 'audience-behavior',
      },
    ],
  },
  {
    text: 'txt_menu_utm_tracking',
    link: `/utm-tracking`,
    icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_utm_tracking',
        link: `/utm-tracking`,
        page: 'utm-tracking',
      },
      {
        text: 'txt_menu_generator',
        link: `/utm-tracking/generator`,
        page: 'utm-tracking-generator',
      },
    ],
  },
  {
    text: 'txt_menu_events',
    link: `/events`,
    icons: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
    submenu: [
      {
        text: 'txt_menu_overview',
        mini_text: 'txt_menu_events',
        link: `/events`,
        page: 'events',
      },
      {
        text: 'txt_menu_generator',
        link: `/events/generator`,
        page: 'events-generator',
      },
    ],
  },
  {
    text: 'txt_menu_woocommerce',
    link: `/woocommerce`,
    icons: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
  },

  {
    text: 'txt_menu_region',
    link: `/region-country`,
    icons: env.PUBLIC_URL + '/assets/images/region-country.svg',
    icons_color: env.PUBLIC_URL + '/assets/images/region-country.svg',
    page: 'region-country',
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
      link: `/bi/audience/behavior`,
      page: 'audience-behavior',
    },
  ];
};

export { mainMenu, integrationMenu };
