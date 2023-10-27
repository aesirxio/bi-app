/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';

class WoocoomerceTableModel {
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

  toWoocoomerceTableTop = (headerTable) => {
    const accessor = ['value', 'count'];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === 'value' ? (
              <div className={'px-15'}>{cell?.value}</div>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value}</div>
            ),
        };
      });
      const data = this.data?.map((item) => {
        return {
          ...item,
          ...accessor
            .map((i) => {
              return {
                [i]: item[i],
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });

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

  toWoocoomerceTableCheckoutTop = () => {
    const headerTable = ['txt_product_name', 'txt_count', 'txt_total'];
    const accessor = ['value', 'count', 'total'];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === 'value' ? (
              <div className={'px-15'}>{cell?.value}</div>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value}</div>
            ),
        };
      });
      const data = this.data?.map((item) => {
        return {
          ...item,
          ...accessor
            .map((i) => {
              return {
                [i]: item[i],
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });

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

  toViewProductTableTop = () => {
    const headerTable = ['txt_product', 'txt_visitors'];
    const accessor = ['value', 'count'];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === 'value' ? (
              <div className={''}>{cell?.value}</div>
            ) : (
              <div className={'text-end'}>{cell?.value}</div>
            ),
        };
      });
      const data = this.data
        ?.map((item) => {
          return {
            ...item,
            ...accessor
              .map((i) => {
                return {
                  [i]: item[i],
                };
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
          };
        })
        ?.sort((a, b) => b['count'] - a['count']);

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
  toProductSearchTableTop = () => {
    const headerTable = ['txt_keyword', 'txt_clicks'];
    const accessor = ['value', 'count'];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === 'value' ? (
              <div className={''}>{cell?.value}</div>
            ) : (
              <div className={'text-end'}>{cell?.value}</div>
            ),
        };
      });
      const data = this.data
        ?.map((item) => {
          return {
            ...item,
            ...accessor
              .map((i) => {
                return {
                  [i]: item[i],
                };
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
          };
        })
        ?.sort((a, b) => b['count'] - a['count']);

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
  toProductCartTableTop = () => {
    const headerTable = ['txt_product', 'txt_quantity'];
    const accessor = ['value', 'count'];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === 'value' ? (
              <div className={''}>{cell?.value}</div>
            ) : (
              <div className={'text-end'}>{cell?.value}</div>
            ),
        };
      });
      const data = this.data
        ?.map((item) => {
          return {
            ...item,
            ...accessor
              .map((i) => {
                return {
                  [i]: item[i],
                };
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
          };
        })
        ?.sort((a, b) => b['count'] - a['count']);

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

export default WoocoomerceTableModel;
