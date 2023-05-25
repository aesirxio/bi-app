import { env } from 'aesirx-lib';

const getMenu = (dataStreamActive) => {
  const dataMenu = [
    {
      text: 'txt_menu_dashboard',
      link: `/${dataStreamActive}`,
      icons: env.PUBLIC_URL + '/assets/images/dashboard.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/dashboard.svg',
      page: 'dashboard',
    },
    {
      text: 'txt_menu_audience',
      link: `/${dataStreamActive}/audience`,
      icons: env.PUBLIC_URL + '/assets/images/audience.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/audience.svg',
      submenu: [
        {
          text: 'txt_menu_overview',
          mini_text: 'txt_menu_audience',
          link: `/${dataStreamActive}/audience/overview`,
          page: 'audience-overview',
        },
        {
          text: 'txt_menu_behavior',
          link: `/${dataStreamActive}/audience/behavior`,
          page: 'audience-behavior',
        },
      ],
    },
    {
      text: 'txt_menu_utm_tracking',
      link: `/${dataStreamActive}/utm-tracking`,
      icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
      submenu: [
        {
          text: 'txt_menu_overview',
          mini_text: 'txt_menu_utm_tracking',
          link: `/${dataStreamActive}/utm-tracking`,
          page: 'utm-tracking',
        },
        {
          text: 'txt_menu_generator',
          link: `/${dataStreamActive}/utm-tracking/generator`,
          page: 'utm-tracking-generator',
        },
      ],
    },
    {
      text: 'txt_menu_events',
      link: `/${dataStreamActive}/behavior/events`,
      icons: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/calendar-line.svg',
      submenu: [
        {
          text: 'txt_menu_overview',
          mini_text: 'txt_menu_events',
          link: `/${dataStreamActive}/events`,
          page: 'events',
        },
        {
          text: 'txt_menu_generator',
          link: `/${dataStreamActive}/events/generator`,
          page: 'events-generator',
        },
      ],
    },

    {
      text: 'txt_menu_region',
      link: `/${dataStreamActive}/region-country`,
      icons: env.PUBLIC_URL + '/assets/images/region-country.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/region-country.svg',
      page: 'region-country',
    },
  ];

  return dataMenu;
};

export { getMenu };
