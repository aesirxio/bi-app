/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

class VisitorModel {
  data = {};
  constructor(entity) {
    if (entity) {
      this.data = entity;
    }
  }

  toRaw = () => {
    return this.data;
  };

  toAreaChart = () => {
    let transformResponse = this.data.length
      ? {
          visitors: this.data.map((item) => {
            return { name: item.date, line: item.visits };
          }),
        }
      : [];
    return transformResponse;
  };

  getFilterName = () => {
    const transform = this.toAreaChart();
    return Object.keys(transform).map((item) => ({ value: item, label: item }));
  };
}

export default VisitorModel;
