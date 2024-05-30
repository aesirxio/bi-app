/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_FLOW_LIST_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';

class FlowListModel {
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
  handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      this.globalViewModel.setIntegrationLink(link);
    }
  };
  toFlowListTable = (integration) => {
    const headerTable = [
      'txt_time_utc',
      'txt_locale',
      'txt_sop_id',
      'txt_duration',
      'txt_event',
      'txt_conversion',
      'txt_action',
      'txt_url',
      '',
      // 'txt_tier',
      // 'txt_session',
      // 'txt_referrer',
    ];
    const accessor = [
      BI_FLOW_LIST_FIELD_KEY.START,
      BI_FLOW_LIST_FIELD_KEY.GEO,
      BI_FLOW_LIST_FIELD_KEY.SOP_ID,
      BI_FLOW_LIST_FIELD_KEY.DURATION,
      BI_FLOW_LIST_FIELD_KEY.EVENT,
      BI_FLOW_LIST_FIELD_KEY.CONVERSION,
      BI_FLOW_LIST_FIELD_KEY.ACTION,
      BI_FLOW_LIST_FIELD_KEY.URL,
      BI_FLOW_LIST_FIELD_KEY.UUID,
      // BI_FLOW_LIST_FIELD_KEY.TIER,
      // BI_FLOW_LIST_FIELD_KEY.SESSION,
      // BI_FLOW_LIST_FIELD_KEY.REFERRER,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_FLOW_LIST_FIELD_KEY.START
              ? 220
              : key === BI_FLOW_LIST_FIELD_KEY.SOP_ID
              ? 100
              : key === BI_FLOW_LIST_FIELD_KEY.EVENT ||
                key === BI_FLOW_LIST_FIELD_KEY.DURATION ||
                key === BI_FLOW_LIST_FIELD_KEY.CONVERSION ||
                key === BI_FLOW_LIST_FIELD_KEY.ACTION ||
                key === BI_FLOW_LIST_FIELD_KEY.GEO
              ? 10
              : key === BI_FLOW_LIST_FIELD_KEY.URL
              ? 230
              : key === BI_FLOW_LIST_FIELD_KEY.UUID
              ? 80
              : 100,
          allowSort: true,
          sortParams: key === BI_FLOW_LIST_FIELD_KEY.GEO ? 'geo.country.name' : key,
          Cell: ({ cell, column, row }) => {
            if (column.id === BI_FLOW_LIST_FIELD_KEY.GEO) {
              return (
                <div className={'px-3'}>
                  {cell?.value === '' ? (
                    <></>
                  ) : (
                    <span
                      className={`me-1 fi fi-${this.data
                        .find(
                          (o) =>
                            o[BI_FLOW_LIST_FIELD_KEY.GEO]?.country?.code ===
                            row?.values[BI_FLOW_LIST_FIELD_KEY.GEO]?.country?.code
                        )
                        ?.[BI_FLOW_LIST_FIELD_KEY.GEO]?.country?.code?.toLowerCase()}`}
                    ></span>
                  )}
                  <span className="text-nowrap">{cell?.value === '' ? 'Unknown' : ''}</span>
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.UUID) {
              return (
                <>
                  {integration ? (
                    <a
                      href="#"
                      onClick={(e) => this.handleChangeLink(e, `flow&id=${cell?.value}`)}
                      className={'btn btn-light px-3 py-1 fs-sm'}
                    >
                      <span> View Detail</span>
                    </a>
                  ) : (
                    <NavLink
                      to={`/flow/${cell?.value}`}
                      className={'btn btn-light px-3 py-1 fs-sm'}
                    >
                      View Detail
                    </NavLink>
                  )}
                </>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.URL && cell?.value) {
              const urlParams = new URL(cell?.value);
              let displayUrl = urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search;
              return (
                <a
                  href={cell?.value}
                  target="_blank"
                  rel="noreferrer"
                  className={'px-3 d-inline-block text-secondary-50'}
                >
                  {displayUrl?.length > 53 ? displayUrl?.slice(0, 53) + '...' : displayUrl}
                </a>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.START) {
              return (
                <div className={'px-3 d-flex align-items-center'}>
                  {row.original[BI_FLOW_LIST_FIELD_KEY.DEVICE] === 'bot' ? (
                    <div
                      className="text-success py-1 px-2 me-2 rounded-1 fw-semibold"
                      style={{ backgroundColor: '#1AB39426' }}
                    >
                      Bot
                    </div>
                  ) : (
                    <></>
                  )}
                  {moment(cell?.value)?.utc()?.format('DD-MM-YYYY HH:mm:ss')}
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.DURATION) {
              return (
                <div className={'px-3'}>{moment.utc(cell?.value * 1000).format('mm:ss') ?? 0}</div>
              );
            } else {
              return <div className={'px-3'}>{cell?.value}</div>;
            }
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

  toAreaChart = () => {
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
        name: date && moment(date, 'YYYY-MM-DD').format('DD'),
        event: filterDate?.[BI_FLOW_LIST_FIELD_KEY.EVENT] ?? 0,
        conversion: filterDate?.[BI_FLOW_LIST_FIELD_KEY.CONVERSION] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.EVENT],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.CONVERSION],
          0
        );
      }

      return {
        name: month,
        event: totalVisitorCount,
        conversion: totalPageViewCount,
      };
    });

    const weekData = {};

    dateRange.forEach((date) => {
      const startOfWeek = moment(date).startOf('isoWeek');
      const endOfWeek = moment(date).endOf('isoWeek');
      const weekName = `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;

      if (!weekData[weekName]) {
        weekData[weekName] = {
          event: 0,
          conversion: 0,
        };
      }

      const filterWeekDate = this.data.filter((item) =>
        moment(item?.date).isBetween(startOfWeek, endOfWeek, null, '[]')
      );

      if (filterWeekDate) {
        const totalVisitorCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.EVENT],
          0
        );
        const totalPageViewCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.CONVERSION],
          0
        );

        weekData[weekName].event += totalVisitorCount;
        weekData[weekName].conversion += totalPageViewCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      event: weekData[weekName].event,
      conversion: weekData[weekName].conversion,
    }));

    return [{ action: month }, { action: date }, { action: week }];
  };

  getFilterName = () => {
    return [{ label: 'Action', value: 'action' }];
  };
}

export default FlowListModel;
