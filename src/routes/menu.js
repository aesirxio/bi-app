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
          link: `/${dataStreamActive}/audience/overview`,
          page: 'audience-overview',
        },
      ],
    },
    {
      text: 'txt_menu_behavior',
      link: `/${dataStreamActive}/behavior`,
      icons: env.PUBLIC_URL + '/assets/images/behavior.svg',
      icons_color: env.PUBLIC_URL + '/assets/images/behavior.svg',
      submenu: [
        {
          text: 'txt_menu_utm_tracking',
          link: `/${dataStreamActive}/behavior/utm-tracking`,
          page: 'behavior-utm-tracking',
        },
        {
          text: 'txt_menu_events',
          link: `/${dataStreamActive}/behavior/events`,
          page: 'behavior-events',
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
