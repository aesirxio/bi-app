/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import {
  BI_EVENTS_FIELD_KEY,
  BI_VISITOR_FIELD_KEY,
  BI_CONSENTS_DATE_FIELD_KEY,
  BI_CONSENTS_TIER_FIELD_KEY,
  BI_EVENTS_TYPE_FIELD_KEY,
} from 'aesirx-lib';
import moment from 'moment';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class ConsentsListModel {
  data = [];
  globalViewModel = null;
  constructor(entity, globalViewModel) {
    if (entity) {
      this.data = entity;
      this.globalViewModel = globalViewModel;
    }
  }

  toRaw = () => {
    return this.data;
  };

  transformResponse = () => {
    let data = {};

    if (this.data?.length > 0) {
      this.data?.forEach((item) => {
        const dataFilterEventName = this.data.filter(
          (_item) =>
            _item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === item[BI_VISITOR_FIELD_KEY.EVENT_NAME]
        );
        data = {
          ...data,
          [item[BI_VISITOR_FIELD_KEY.EVENT_NAME]]: dataFilterEventName,
        };
      });
    }

    return data;
  };

  transformConsentsResponse = () => {
    let data = {};

    if (this.data?.length > 0) {
      this.data?.forEach((item) => {
        const dataFilterEventName = this.data.filter(
          (_item) => _item[BI_EVENTS_FIELD_KEY.EVENT_NAME] === item[BI_EVENTS_FIELD_KEY.EVENT_NAME]
        );
        data = {
          ...data,
          [item[BI_EVENTS_FIELD_KEY.EVENT_NAME]]: dataFilterEventName,
        };
      });
    }

    return data;
  };

  transformAttributeCartResponse = (dataAttr) => {
    if (this.dataAttr?.length > 0) {
      this.dataAddToCart = {
        ...dataAttr,
      };
    }
    return dataAttr;
  };

  getFilterName = () => {
    const transform = this.transformResponse();
    const filter = Object.keys(transform).map((item) => ({ value: item, label: item }));
    filter?.unshift({ value: 'all', label: 'All' });
    return filter;
  };

  getListLine = () => {
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => item);
  };

  toBarChart = () => {
    const transform = this.transformConsentsResponse();
    return Object.keys(transform).map((item) => ({
      name: item,
      number: transform[item]?.reduce(
        (a, b) => parseInt(a) + parseInt(b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR]),
        0
      ),
    }));
  };
  handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      this.globalViewModel.setIntegrationLink(link);
    }
  };
  toChartByTier = () => {
    const tierData = this.data.map((item) => {
      if (item[BI_CONSENTS_TIER_FIELD_KEY.TIER]) {
        let nameConsent = 'Consent';
        switch (item[BI_CONSENTS_TIER_FIELD_KEY.TIER]) {
          case 1:
            nameConsent = 'Consent';
            break;
          case 3:
            nameConsent = 'Decentralized Consent';
            break;
          case 4:
            nameConsent = 'Decentralized Consent + SoP';
            break;
          case 5:
            nameConsent = 'Category-base & Granular Consent';
            break;
          case 6:
            nameConsent = 'Opt-Out Consent';
            break;
        }
        return {
          name: nameConsent,
          value: item[BI_CONSENTS_TIER_FIELD_KEY.TOTAL],
        };
      } else if (item[BI_EVENTS_TYPE_FIELD_KEY.EVENT_TYPE] === 'reject-consent') {
        return {
          name: 'Rejected Consent',
          value: item[BI_EVENTS_TYPE_FIELD_KEY.TOTAL_VISITOR],
        };
      } else {
        return {
          name: 'Revoked Consent',
          value: item[BI_EVENTS_TYPE_FIELD_KEY.TOTAL_VISITOR],
        };
      }
    });
    return tierData;
  };
  toChartByDate = () => {
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
        name: date && moment(date, 'YYYY-MM-DD').format('DD MMM'),
        Total: filterDate?.[BI_CONSENTS_DATE_FIELD_KEY.TOTAL] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_CONSENTS_DATE_FIELD_KEY.TOTAL],
          0
        );
      }

      return {
        name: month,
        Total: totalVisitorCount,
      };
    });

    const weekData = {};

    dateRange.forEach((date) => {
      const startOfWeek = moment(date).startOf('isoWeek');
      const endOfWeek = moment(date).endOf('isoWeek');
      const weekName = `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;

      if (!weekData[weekName]) {
        weekData[weekName] = {
          quantity: 0,
        };
      }

      const filterWeekDate = this.data.filter((item) =>
        moment(item?.date).isBetween(startOfWeek, endOfWeek, null, '[]')
      );

      if (filterWeekDate) {
        const totalVisitorCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_CONSENTS_DATE_FIELD_KEY.TOTAL],
          0
        );

        weekData[weekName].quantity += totalVisitorCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      Total: weekData[weekName].quantity,
    }));
    return [{ visitors: month }, { visitors: date }, { visitors: week }];
  };
}

export default ConsentsListModel;
