/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import { BI_WOOCOMMERCE_PRODUCT_FIELD_KEY } from 'aesirx-lib';
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };

  toWoocoomerceProductTopTable = () => {
    const headerTable = ['txt_product_name', 'txt_quantity', 'txt_product_revenue'];
    const accessor = [
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.QUANTITY,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT_REVENUE,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT ? (
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };

  toWoocoomerceProductTable = () => {
    const headerTable = [
      'txt_product_name',
      'txt_quantity',
      'txt_items_sold',
      'txt_product_revenue',
      'txt_avg_price',
      'txt_avg_quantity',
    ];
    const accessor = [
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.QUANTITY,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.ITEMS_SOLD,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT_REVENUE,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.AVG_PRICE,
      BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.AVG_QUANTITY,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: 170,
          Cell: ({ cell, column }) =>
            column.id === BI_WOOCOMMERCE_PRODUCT_FIELD_KEY.PRODUCT ? (
              <div className={'px-15'}>{cell?.value}</div>
            ) : (
              <div className={'px-15'}>{cell?.value}</div>
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
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
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
