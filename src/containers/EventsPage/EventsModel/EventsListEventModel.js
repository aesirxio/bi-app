/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class EventsListModel {
  data = null;
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
    const filter = Object.keys(transform).map((item) => ({ value: item, label: item }));
    filter?.unshift({ value: 'all', label: 'All' });
    return filter;
  };

  getListLine = () => {
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => item);
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

    const dateRange = enumerateDaysBetweenDates(
      this.globalViewModel.dateFilter.date_start,
      this.globalViewModel.dateFilter.date_end
    );
    const date = {
      all: dateRange.map((date) => {
        return {
          name: date,
          ...Object.keys(transform)
            .map((item) => {
              const filterDate = transform[item]?.filter(
                (_item) =>
                  moment(_item[BI_VISITOR_FIELD_KEY.START_DATE]).format('YYYY-MM-DD') === date
              ).length;
              return { [item]: filterDate ?? 0 };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: dateRange.map((date) => {
              const filterDate = transform[item].filter(
                (_item) =>
                  moment(_item[BI_VISITOR_FIELD_KEY.START_DATE]).format('YYYY-MM-DD') === date
              ).length;
              return {
                name: date,
                [item]: filterDate ?? 0,
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
              const filterMonthDate = transform[item].filter(
                (_item) => moment(_item[BI_VISITOR_FIELD_KEY.START_DATE]).month() === index
              ).length;
              return { [item]: filterMonthDate ?? 0 };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: twelveMonth.map((month, index) => {
              const filterMonthDate = transform[item].filter(
                (_item) => moment(_item[BI_VISITOR_FIELD_KEY.START_DATE]).month() === index
              ).length;
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
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => ({
      name: item,
      number: transform[item].length,
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
                          `flow/${row.original?.[BI_VISITOR_FIELD_KEY.FLOW_ID]}`
                        )
                      }
                      className={`px-3`}
                    >
                      <span>{cell?.value}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={`/${this.globalViewModel.activeDomain}/flow/${
                        row.original?.[BI_VISITOR_FIELD_KEY.FLOW_ID]
                      }`}
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
}

export default EventsListModel;
