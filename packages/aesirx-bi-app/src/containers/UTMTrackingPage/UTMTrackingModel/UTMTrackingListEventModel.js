/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_VISITORS_FIELD_KEY, BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class UTMTrackingEventModel {
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

  handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      this.globalViewModel.setIntegrationLink(link);
    }
  };

  transformResponseUTM = () => {
    let data = {};
    if (this.data?.length > 0) {
      this.data?.forEach((item) => {
        item.values?.forEach((sub_item) => {
          const dataFilterAttributeName = this.data.filter((_item) => {
            return _item?.values.some((e) => {
              return e?.value === sub_item?.value;
            });
          });
          data = {
            ...data,
            [sub_item?.value]: dataFilterAttributeName,
          };
        });
      });
    }

    return data;
  };

  getFilterNameUTM = () => {
    const transform = this.transformResponseUTM();
    const filter = Object.keys(transform).map((item) => ({ value: item, label: item }));
    filter?.unshift({ value: 'all', label: 'All' });
    return filter;
  };

  getListLineUTM = () => {
    const transform = this.transformResponseUTM();
    return Object.keys(transform).map((item) => item);
  };

  toBarChartUTM = () => {
    const transform = this.transformResponseUTM();
    return Object.keys(transform).map((item) => {
      return {
        name: item,
        number: transform[item]
          ?.map((e) => {
            return e?.values?.find((sub_item) => {
              return sub_item?.value === item;
            })?.count;
          })
          ?.reduce((partialSum, a) => parseInt(partialSum) + parseInt(a), 0),
      };
    });
  };

  toAreaChartUTM = () => {
    const transform = this.transformResponseUTM();
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
              const filterDate = transform[item]?.filter(
                (_item) => moment(_item[BI_VISITORS_FIELD_KEY.DATE]).format('YYYY-MM-DD') === date
              );
              return {
                [item]: filterDate?.length
                  ? filterDate[0]?.values?.find((e) => e?.value === item)?.count
                  : 0,
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: dateRange.map((date) => {
              const filterDate = transform[item]?.filter(
                (_item) => moment(_item[BI_VISITORS_FIELD_KEY.DATE]).format('YYYY-MM-DD') === date
              );
              return {
                name: date && moment(date, 'YYYY-MM-DD').format('MM-DD'),
                [item]: filterDate?.length
                  ? filterDate[0]?.values?.find((e) => e?.value === item)?.count
                  : 0,
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
                (_item) => moment(_item[BI_VISITORS_FIELD_KEY.DATE]).month() === index
              );
              return {
                [item]: filterMonthDate?.length
                  ? filterMonthDate[0]?.values?.find((e) => e?.value === item)?.count
                  : 0,
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      }),
      ...Object.keys(transform)
        .map((item) => {
          return {
            [item]: twelveMonth.map((month, index) => {
              const filterMonthDate = transform[item].filter(
                (_item) => moment(_item[BI_VISITORS_FIELD_KEY.DATE]).month() === index
              );
              return {
                name: month,
                [item]: filterMonthDate?.length
                  ? filterMonthDate[0]?.values?.find((e) => e?.value === item)?.count
                  : 0,
              };
            }),
          };
        })
        .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
    };
    return [month, date];
  };

  toEventTableUTM = (integration) => {
    const headerTable = [
      'Campaign ID',
      'Campaign Source',
      'Campaign Medium',
      'Campaign Name',
      'Campaign Term',
      'Campaign Content',
      'URL',
      'Referer',
      'Date',
    ];
    const accessor = [
      BI_VISITOR_FIELD_KEY.FLOW_ID,
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      BI_VISITOR_FIELD_KEY.URL,
      BI_VISITOR_FIELD_KEY.REFERER,
      BI_VISITOR_FIELD_KEY.START_DATE,
    ];
    if (this.data.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          Cell: ({ cell, column }) => {
            if (column.id === BI_VISITOR_FIELD_KEY.FLOW_ID && cell?.value) {
              const findUUID = this.data.find((obj) => {
                return obj?.[BI_VISITOR_FIELD_KEY.FLOW_ID] === cell?.value;
              });
              return (
                <>
                  {integration ? (
                    <a
                      href="#"
                      onClick={(e) => this.handleChangeLink(e, `flow/${cell?.value}`)}
                      className={`px-3`}
                    >
                      <span>
                        {
                          findUUID?.[BI_VISITOR_FIELD_KEY.ATTRIBUTES].find((obj) => {
                            return obj?.name === 'utm_id';
                          })?.value
                        }
                      </span>
                    </a>
                  ) : (
                    <NavLink to={`/flow/${cell?.value}`} className={'px-3'}>
                      {
                        findUUID?.[BI_VISITOR_FIELD_KEY.ATTRIBUTES].find((obj) => {
                          return obj?.name === 'utm_id';
                        })?.value
                      }
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

      const data = this.data
        .map((item) => {
          const utm = item[BI_VISITOR_FIELD_KEY.ATTRIBUTES]
            .map((attr) => {
              if (accessor.includes(attr.name)) {
                return { [attr.name]: attr.value };
              }
            })
            .filter((i) => i)
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {});
          if (Object.keys(utm).length) {
            return accessor
              .map((i) => {
                if (i === BI_VISITOR_FIELD_KEY.START_DATE) {
                  return {
                    [i]: moment(item[i]).format('DD-MM-YYYY HH:mm:ss'),
                  };
                } else {
                  return {
                    [i]: item[i],
                    ...utm,
                  };
                }
              })
              .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {});
          } else {
            return null;
          }
        })
        .filter((i) => i);
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

  toAttributeList = () => {
    const transform = this.transformResponseUTM();
    const result = Object.keys(transform)?.map((item, key) => ({ value: item, label: item }));
    return [{ label: 'All Campaign', value: 'all' }, ...result];
  };
}

export default UTMTrackingEventModel;
