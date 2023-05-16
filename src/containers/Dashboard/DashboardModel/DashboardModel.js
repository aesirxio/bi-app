/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import moment from 'moment';
import { BI_VISITORS_FIELD_KEY, enumerateDaysBetweenDates } from 'aesirx-lib';

class DashboardModel {
  data = [];
  globalViewModel = null;
  constructor(entity, globalViewModel) {
    if (entity) {
      this.data = entity ?? [];
      this.globalViewModel = globalViewModel;
    }
  }

  toRaw = () => {
    return this.data;
  };

  toAreaChart = () => {
    const twelveMonth = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dateRange = enumerateDaysBetweenDates(
      this.globalViewModel?.dateFilter?.date_start,
      this.globalViewModel?.dateFilter?.date_end
    );

    const date = dateRange.map((date) => {
      const filterDate = this.data.find(
        (_item) => moment(_item.date).format('YYYY-MM-DD') === date
      );
      return {
        name: date,
        visits: filterDate?.[BI_VISITORS_FIELD_KEY.VISITS] ?? 0,
        page_views: filterDate?.[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.VISITS],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS],
          0
        );
      }

      return {
        name: month,
        visits: totalVisitorCount,
        page_views: totalPageViewCount,
      };
    });
    return [{ visitors: month }, { visitors: date }];
  };

  getFilterName = () => {
    return [{ label: 'Visitors', value: 'visitors' }];
  };
}

export default DashboardModel;
