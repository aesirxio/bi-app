/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { BI_VISITOR_FIELD_KEY } from 'aesirx-dma-lib';
import moment from 'moment';

class BehaviorEventModel {
  data = {};
  constructor(entity) {
    if (entity) {
      this.data = entity;
    }
  }

  toRaw = () => {
    return this.data;
  };

  transformResponse = () => {
    let data = {};
    this.data.forEach((item) => {
      const dataFilterEventName = this.data.filter(
        (_item) => _item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === item[BI_VISITOR_FIELD_KEY.EVENT_NAME]
      );
      data = {
        ...data,
        [item[BI_VISITOR_FIELD_KEY.EVENT_NAME]]: dataFilterEventName,
      };
    });
    return data;
  };

  getFilterName = () => {
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => ({ value: item, label: item }));
  };

  toAreaChart = () => {
    const transform = this.transformResponse();
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

    return Object.keys(transform)
      .map((item) => {
        return {
          [item]: twelveMonth.map((month, index) => {
            const filterMonthDate = transform[item].filter(
              (_item) => moment(_item[BI_VISITOR_FIELD_KEY.START_DATE]).month() === index
            ).length;
            if (filterMonthDate) {
              return {
                name: month,
                number: filterMonthDate,
              };
            } else {
              return {
                name: month,
                number: 0,
              };
            }
          }),
        };
      })
      .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {});
  };

  toBarChart = () => {
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => ({
      name: item,
      number: transform[item].length,
    }));
  };

  toEventTable = () => {
    const accessor = [
      BI_VISITOR_FIELD_KEY.EVENT_NAME,
      BI_VISITOR_FIELD_KEY.EVENT_TYPE,
      BI_VISITOR_FIELD_KEY.START_DATE,
    ];
    if (this.data.length) {
      const header = accessor.map((key) => {
        return {
          Header: key.charAt(0).toUpperCase() + key.slice(1),
          accessor: key,
        };
      });

      const data = this.data.map((item) => {
        return accessor
          .map((i) => {
            if (i === BI_VISITOR_FIELD_KEY.START_DATE) {
              return {
                [i]: moment(item[i]).format('DD-MM-YYYY'),
              };
            } else {
              return {
                [i]: item[i],
              };
            }
          })
          .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {});
      });

      console.log(data);
      return {
        header,
        data: data,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };
}

export default BehaviorEventModel;
