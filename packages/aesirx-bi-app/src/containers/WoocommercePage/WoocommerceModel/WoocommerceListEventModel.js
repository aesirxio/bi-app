/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import {
  BI_EVENTS_FIELD_KEY,
  BI_VISITOR_FIELD_KEY,
  BI_WOOCOMMERCE_PRODUCT_CHART_FIELD_KEY,
} from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';
import { BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY } from 'aesirx-lib';

class WoocommerceListModel {
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

  transformWoocommerceResponse = () => {
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

  toAddToCartData = () => {
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

  toAreaChart = () => {
    const transform = this.transformWoocommerceResponse();
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
      this.globalViewModel.dateFilter.date_start,
      this.globalViewModel.dateFilter.date_end
    );
    const date = {
      all: dateRange.map((date) => {
        return {
          name: date && moment(date, 'YYYY-MM-DD').format('MM-DD'),
          ...Object.keys(transform)
            .map((item) => {
              const filterDate = transform[item].filter((_item) => {
                return _item[BI_EVENTS_FIELD_KEY.DATE] === date;
              });
              return {
                [item]: filterDate?.length ? filterDate[0][BI_EVENTS_FIELD_KEY.TOTAL_VISITOR] : 0,
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: dateRange.map((date) => {
              const filterDate = transform[item].filter((_item) => {
                return _item[BI_EVENTS_FIELD_KEY.DATE] === date;
              });
              return {
                name: date && moment(date, 'YYYY-MM-DD').format('MM-DD'),
                [item]: filterDate?.length ? filterDate[0][BI_EVENTS_FIELD_KEY.TOTAL_VISITOR] : 0,
              };
            }),
          };
        })
        .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
    };
    const month = {
      all: twelveMonth.map((month, index) => {
        return {
          name: month,
          ...Object.keys(transform)
            .map((item) => {
              const filterMonthDate = this.data
                ?.filter(
                  (_item) => moment(_item[BI_EVENTS_FIELD_KEY.DATE], 'YYYY-MM-DD').month() === index
                )
                ?.reduce((a, b) => parseInt(a) + parseInt(b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR]), 0);
              return { [item]: filterMonthDate ?? 0 };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: twelveMonth.map((month, index) => {
              const filterMonthDate = this.data
                ?.filter(
                  (_item) => moment(_item[BI_EVENTS_FIELD_KEY.DATE], 'YYYY-MM-DD').month() === index
                )
                ?.reduce((a, b) => parseInt(a) + parseInt(b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR]), 0);
              if (filterMonthDate) {
                return {
                  name: month,
                  [item]: filterMonthDate,
                };
              } else {
                return {
                  name: month,
                  [item]: 0,
                };
              }
            }),
          };
        })
        .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
    };

    return [month, date];
  };

  toBarChart = () => {
    const transform = this.transformWoocommerceResponse();
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
  toEventTable = (integration) => {
    const headerTable = ['Name', 'Type', 'URL', 'Referer', 'Date'];
    const accessor = [
      BI_VISITOR_FIELD_KEY.EVENT_NAME,
      BI_VISITOR_FIELD_KEY.EVENT_TYPE,
      BI_VISITOR_FIELD_KEY.URL,
      BI_VISITOR_FIELD_KEY.REFERER,
      BI_VISITOR_FIELD_KEY.START_DATE,
    ];
    if (this.data.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          Cell: ({ cell, column, row }) => {
            if (column.id === BI_VISITOR_FIELD_KEY.EVENT_NAME && cell?.value) {
              return (
                <>
                  {integration ? (
                    <a
                      href="#"
                      onClick={(e) =>
                        this.handleChangeLink(
                          e,
                          `flow/${row.original?.[BI_VISITOR_FIELD_KEY.UUID]}`
                        )
                      }
                      className={`px-3`}
                    >
                      <span>{cell?.value}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={`/flow/${row.original?.[BI_VISITOR_FIELD_KEY.UUID]}`}
                      className={'px-3'}
                    >
                      {cell?.value}
                    </NavLink>
                  )}
                </>
              );
            } else if (
              (column.id === BI_VISITOR_FIELD_KEY.REFERER ||
                column.id === BI_VISITOR_FIELD_KEY.URL) &&
              cell?.value
            ) {
              const urlParams = new URL(cell?.value);
              return (
                <div className={'px-3'}>
                  {urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search}
                </div>
              );
            } else {
              return <div className={'px-3'}>{cell?.value ?? null}</div>;
            }
          },
        };
      });
      const data = this.data.map((item) => {
        return {
          ...item,
          ...accessor
            .map((i) => {
              if (i === BI_VISITOR_FIELD_KEY.START_DATE) {
                return {
                  [i]: moment(item[i]).format('DD-MM-YYYY HH:mm:ss'),
                };
              } else {
                return {
                  [i]: item[i],
                };
              }
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });
      data?.length &&
        data?.sort(
          (a, b) => moment(b.start, 'DD-MM-YYYY HH:mm:ss') - moment(a.start, 'DD-MM-YYYY HH:mm:ss')
        );
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

  toChart = () => {
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
        total_revenue: filterDate?.[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_REVENUE] ?? 0,
        total_purchasers:
          filterDate?.[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_PURCHASERS] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_REVENUE],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_PURCHASERS],
          0
        );
      }

      return {
        name: month,
        total_revenue: totalVisitorCount,
        total_purchasers: totalPageViewCount,
      };
    });

    const weekData = {};

    dateRange.forEach((date) => {
      const startOfWeek = moment(date).startOf('isoWeek');
      const endOfWeek = moment(date).endOf('isoWeek');
      const weekName = `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;

      if (!weekData[weekName]) {
        weekData[weekName] = {
          total_revenue: 0,
          total_purchasers: 0,
        };
      }

      const filterWeekDate = this.data.filter((item) =>
        moment(item?.date).isBetween(startOfWeek, endOfWeek, null, '[]')
      );

      if (filterWeekDate) {
        const totalVisitorCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_REVENUE],
          0
        );
        const totalPageViewCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_WOOCOMMERCE_STATISTIC_CHART_FIELD_KEY.TOTAL_PURCHASERS],
          0
        );

        weekData[weekName].total_revenue += totalVisitorCount;
        weekData[weekName].total_purchasers += totalPageViewCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      total_revenue: weekData[weekName].total_revenue,
      total_purchasers: weekData[weekName].total_purchasers,
    }));

    return [{ visitors: month }, { visitors: date }, { visitors: week }];
  };

  toChartProduct = () => {
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
        Products: filterDate?.[BI_WOOCOMMERCE_PRODUCT_CHART_FIELD_KEY.QUANTITY] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_WOOCOMMERCE_PRODUCT_CHART_FIELD_KEY.QUANTITY],
          0
        );
      }

      return {
        name: month,
        Products: totalVisitorCount,
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
          (acc, item) => acc + item[BI_WOOCOMMERCE_PRODUCT_CHART_FIELD_KEY.QUANTITY],
          0
        );

        weekData[weekName].quantity += totalVisitorCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      Products: weekData[weekName].quantity,
    }));

    return [{ visitors: month }, { visitors: date }, { visitors: week }];
  };
}

export default WoocommerceListModel;
