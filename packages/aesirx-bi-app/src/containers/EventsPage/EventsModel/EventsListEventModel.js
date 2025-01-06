/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_EVENTS_FIELD_KEY, BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class EventsListModel {
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

  transformEventsResponse = () => {
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
    filter?.unshift({ value: 'all', label: 'All Event' });
    return filter;
  };

  getListLine = () => {
    const transform = this.transformResponse();
    return Object.keys(transform).map((item) => item);
  };

  toAreaChart = () => {
    const transform = this.transformEventsResponse();
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

    const weeklyData = {};
    const date = {
      all: dateRange.map((date) => {
        return {
          name: date && moment(date, 'YYYY-MM-DD').format('DD'),
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
                name: date && moment(date, 'YYYY-MM-DD').format('DD MMM'),
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
                ?.reduce((a, b) => a + b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR], 0);
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
                ?.reduce((a, b) => a + b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR], 0);
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

    dateRange.forEach((date) => {
      const weekStart = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
      const weekEnd = moment(date).endOf('isoWeek').format('YYYY-MM-DD');
      const weekName = `${moment(weekStart).format('DD MMM')} - ${moment(weekEnd).format(
        'DD MMM'
      )}`;
      if (!weeklyData[weekName]) {
        weeklyData[weekName] = {};
        Object.keys(transform).forEach((item) => {
          weeklyData[weekName][item] = 0;
        });
      }

      Object.keys(transform).forEach((item) => {
        const filterDate = transform[item].filter(
          (_item) => _item[BI_EVENTS_FIELD_KEY.DATE] === date
        );
        weeklyData[weekName][item] += filterDate?.length
          ? filterDate[0][BI_EVENTS_FIELD_KEY.TOTAL_VISITOR]
          : 0;
      });
    });

    const formattedWeeklyData = Object.keys(weeklyData).map((weekName) => ({
      name: weekName,
      ...weeklyData[weekName],
    }));

    const week = {
      all: formattedWeeklyData,
    };

    return [month, date, week];
  };

  toBarChart = () => {
    const transform = this.transformEventsResponse();
    const list = Object.keys(transform).map((item) => ({
      name: item,
      number: transform[item]?.reduce((a, b) => a + b[BI_EVENTS_FIELD_KEY.TOTAL_VISITOR], 0),
    }));
    return list;
  };
  handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      this.globalViewModel.setIntegrationLink(link);
    }
  };
  toEventTable = (integration) => {
    const headerTable = ['Name', 'Type', 'URL', 'Referer', 'Date', ''];
    const accessor = [
      BI_VISITOR_FIELD_KEY.EVENT_NAME,
      BI_VISITOR_FIELD_KEY.EVENT_TYPE,
      BI_VISITOR_FIELD_KEY.URL,
      BI_VISITOR_FIELD_KEY.REFERER,
      BI_VISITOR_FIELD_KEY.START_DATE,
      BI_VISITOR_FIELD_KEY.UUID,
    ];
    if (this.data.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_VISITOR_FIELD_KEY.UUID
              ? 10
              : key === BI_VISITOR_FIELD_KEY.EVENT_TYPE
              ? 50
              : 170,
          allowSort: true,
          Cell: ({ cell, column }) => {
            if (column.id === BI_VISITOR_FIELD_KEY.EVENT_NAME && cell?.value) {
              return (
                <>
                  {integration ? (
                    <a
                      href="#"
                      onClick={(e) => this.handleChangeLink(e, `events-detail&id=${cell?.value}`)}
                      className={'pe-3 text-secondary-50'}
                    >
                      <span>{cell?.value ?? null}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={`/events-detail/${cell?.value}`}
                      className={'pe-3 text-secondary-50'}
                    >
                      {cell?.value ?? null}
                    </NavLink>
                  )}
                </>
              );
            } else if (column.id === BI_VISITOR_FIELD_KEY.UUID) {
              return <></>;
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

  toEventTableDetail = (integration) => {
    const headerTable = ['Name', 'Type', 'URL', 'Attributes', 'Date', ''];
    const accessor = [
      BI_VISITOR_FIELD_KEY.EVENT_NAME,
      BI_VISITOR_FIELD_KEY.EVENT_TYPE,
      BI_VISITOR_FIELD_KEY.URL,
      BI_VISITOR_FIELD_KEY.ATTRIBUTES,
      BI_VISITOR_FIELD_KEY.START_DATE,
      BI_VISITOR_FIELD_KEY.UUID,
    ];
    if (this.data.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_VISITOR_FIELD_KEY.UUID
              ? 10
              : key === BI_VISITOR_FIELD_KEY.EVENT_TYPE
              ? 50
              : 170,
          allowSort: true,
          Cell: ({ cell, column }) => {
            if (column.id === BI_VISITOR_FIELD_KEY.EVENT_NAME && cell?.value) {
              return (
                <>
                  {integration ? (
                    <a
                      href="#"
                      onClick={(e) => this.handleChangeLink(e, `events-detail&id=${cell?.value}`)}
                      className={'px-3 text-secondary-50'}
                    >
                      <span>{cell?.value ?? null}</span>
                    </a>
                  ) : (
                    <NavLink
                      to={`/events-detail/${cell?.value}`}
                      className={'px-3 text-secondary-50'}
                    >
                      {cell?.value ?? null}
                    </NavLink>
                  )}
                </>
              );
            } else if (column.id === BI_VISITOR_FIELD_KEY.ATTRIBUTES) {
              return (
                <div>
                  {cell?.value?.map((item, key) => (
                    <div className={'w-100'} key={key}>
                      {item?.name}: {item?.value}
                    </div>
                  ))}
                </div>
              );
            } else if (column.id === BI_VISITOR_FIELD_KEY.UUID) {
              return <></>;
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

  toEventsList = () => {
    const result = this.data?.length
      ? this.data?.map((item) => {
          return {
            value: item?.event_name,
            label: item?.event_name,
          };
        })
      : [];
    const arrayUniqueByKey = [...new Map(result.map((item) => [item['value'], item])).values()];
    return [{ label: 'All Event', value: 'all' }, ...arrayUniqueByKey];
  };
  toConversionList = () => {
    const result = this.data?.length
      ? this.data?.map((item) => {
          return {
            value: item?.event_name,
            label: item?.event_name,
          };
        })
      : [];
    const arrayUniqueByKey = [...new Map(result.map((item) => [item['value'], item])).values()];
    return [{ label: 'All Conversion', value: 'all' }, ...arrayUniqueByKey];
  };
}

export default EventsListModel;
