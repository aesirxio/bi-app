/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_SUMMARY_FIELD_KEY, BI_VISITORS_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class AcquisitionCampaignModel {
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

  transformResponseAcquisitionCampaign = () => {
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

  getFilterNameAcquisitionCampaign = () => {
    const transform = this.transformResponseAcquisitionCampaign();
    const filter = Object.keys(transform).map((item) => ({ value: item, label: item }));
    filter?.unshift({ value: 'all', label: 'All' });
    return filter;
  };

  getListLineAcquisitionCampaign = () => {
    const transform = this.transformResponseAcquisitionCampaign();
    return Object.keys(transform).map((item) => item);
  };

  toBarChartAcquisitionCampaign = () => {
    const transform = this.transformResponseAcquisitionCampaign();
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

  toAreaChartAcquisitionCampaign = () => {
    const transform = this.transformResponseAcquisitionCampaign();
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
          name: date && moment(date, 'YYYY-MM-DD').format('DD'),
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
                name: date && moment(date, 'YYYY-MM-DD').format('DD'),
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

  toEventTableAcquisitionCampaign = () => {
    const headerTable = [
      'txt_campaign',
      'txt_page_views',
      'txt_unique_page_views',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_acg_session_duration',
    ];
    const accessor = [
      'value',
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS,
      BI_SUMMARY_FIELD_KEY.BOUNCE_RATE,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION,
      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          Cell: ({ cell, column }) => {
            return column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-15'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : (
              <div className={'px-15'}>{cell?.value ?? null}</div>
            );
          },
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

  toAttributeList = () => {
    const transform = this.transformResponseAcquisitionCampaign();
    const result = Object.keys(transform)?.map((item) => ({ value: item, label: item }));
    return [{ label: 'All Campaign', value: 'all' }, ...result];
  };
}

export default AcquisitionCampaignModel;
