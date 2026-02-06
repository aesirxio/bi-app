/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_FLOW_LIST_FIELD_KEY, env } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';
import ComponentSVG from 'components/ComponentSVG';
import { Image } from 'react-bootstrap';
import { Tooltip } from 'react-tooltip';

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
  toFlowListTable = (integration, utm_currency = '') => {
    console.log('this.data', this.data);

    const headerTable = [
      'txt_time_utc',
      'txt_locale',
      'txt_sop_id',
      'txt_ux_score',
      'txt_duration',
      'txt_page_views',
      'txt_action',
      'txt_event',
      'txt_conversion',
      'Metric Value',
      'txt_traffic',
      // 'txt_url',
      '',
      '',
      // 'txt_tier',
      // 'txt_session',
      // 'txt_referrer',
    ];
    const accessor = [
      BI_FLOW_LIST_FIELD_KEY.START,
      BI_FLOW_LIST_FIELD_KEY.GEO,
      BI_FLOW_LIST_FIELD_KEY.SOP_ID,
      BI_FLOW_LIST_FIELD_KEY.UX_PERCENT,
      BI_FLOW_LIST_FIELD_KEY.DURATION,
      BI_FLOW_LIST_FIELD_KEY.PAGEVIEW,
      BI_FLOW_LIST_FIELD_KEY.ACTION,
      BI_FLOW_LIST_FIELD_KEY.EVENT,
      BI_FLOW_LIST_FIELD_KEY.CONVERSION,
      BI_FLOW_LIST_FIELD_KEY.EVENTS,
      BI_FLOW_LIST_FIELD_KEY.TRAFFIC,
      // BI_FLOW_LIST_FIELD_KEY.URL,
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
              ? 160
              : key === BI_FLOW_LIST_FIELD_KEY.SOP_ID || key === BI_FLOW_LIST_FIELD_KEY.EVENTS
              ? 100
              : key === BI_FLOW_LIST_FIELD_KEY.EVENT ||
                key === BI_FLOW_LIST_FIELD_KEY.DURATION ||
                key === BI_FLOW_LIST_FIELD_KEY.CONVERSION ||
                key === BI_FLOW_LIST_FIELD_KEY.PAGEVIEW ||
                key === BI_FLOW_LIST_FIELD_KEY.ACTION ||
                key === BI_FLOW_LIST_FIELD_KEY.DEVICE ||
                key === BI_FLOW_LIST_FIELD_KEY.GEO
              ? 10
              : key === BI_FLOW_LIST_FIELD_KEY.UX_PERCENT
              ? 80
              : key === BI_FLOW_LIST_FIELD_KEY.URL
              ? 230
              : key === BI_FLOW_LIST_FIELD_KEY.UUID
              ? 80
              : 100,
          allowSort: true,
          sortParams:
            key === BI_FLOW_LIST_FIELD_KEY.GEO
              ? 'geo.country.name'
              : key === BI_FLOW_LIST_FIELD_KEY.TRAFFIC
              ? 'device'
              : key,
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
                      className={'px-3 py-1 fs-sm d-block text-center'}
                    >
                      <ComponentSVG
                        url={env.PUBLIC_URL + '/assets/images/eye.svg'}
                        color="#222328"
                      />
                    </a>
                  ) : (
                    <NavLink
                      to={`/flow/${cell?.value}`}
                      className={'px-3 py-1 fs-sm d-block text-center'}
                    >
                      <ComponentSVG
                        url={env.PUBLIC_URL + '/assets/images/eye.svg'}
                        color="#222328"
                      />
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
                  {moment(cell?.value)?.utc()?.format('DD-MM-YYYY HH:mm:ss')}
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.DURATION) {
              return (
                <div className={'px-3'}>{moment.utc(cell?.value * 1000).format('mm:ss') ?? 0}</div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.BOUNCE_RATE) {
              return <div className={'px-3'}>{cell?.value}%</div>;
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.UX_PERCENT) {
              const uxPercentDetail = cell?.row?.original?.uxPercentDetail ?? {};
              const total_tag_metric_score = cell?.row?.original?.events?.length
                ? cell?.row?.original?.events?.reduce(
                    (sum, item) => parseInt(sum) + (parseInt(item.tag_engagement_value) || 0),
                    0
                  )
                : 0;
              const total_utm_score = cell?.row?.original?.events?.length
                ? cell?.row?.original?.events?.reduce((sum, item) => {
                    if (item.utm_value_type === item.event_name) {
                      return parseInt(sum) + (parseInt(item.utm_engagement_weight) || 0);
                    }
                    return sum;
                  }, 0)
                : 0;
              return (
                <div className="ux-percent position-relative d-flex align-items-center">
                  <div className="set-size charts-container">
                    <div className="pie-wrapper progress-75 style-2">
                      <div
                        className={`pie ${
                          parseInt(cell?.value) + total_utm_score + total_tag_metric_score <= 50
                            ? 'below-50'
                            : 'above-50'
                        }`}
                      >
                        <div
                          className="left-side half-circle"
                          style={{
                            transform: `rotate(${
                              parseInt(cell?.value) + total_utm_score + total_tag_metric_score > 100
                                ? 360
                                : (parseInt(cell?.value) +
                                    total_utm_score +
                                    total_tag_metric_score) *
                                  3.6
                            }deg)`,
                          }}
                        ></div>
                        <div className="right-side half-circle"></div>
                      </div>
                      <div className="shadow-pie"></div>
                    </div>
                  </div>
                  <div className="ms-2">
                    {parseInt(cell?.value) + total_utm_score + total_tag_metric_score}
                  </div>
                  <div className="position-absolute ux-percent-detail">
                    <p className="d-flex justify-content-between mb-0 text-white">
                      Visit Actions
                      <span className="fw-semibold">
                        {uxPercentDetail[BI_FLOW_LIST_FIELD_KEY.VISIT_ACTIONS] ?? 0}
                      </span>
                    </p>
                    <p className="d-flex justify-content-between mb-0 text-white">
                      Event Actions
                      <span className="fw-semibold">
                        {uxPercentDetail[BI_FLOW_LIST_FIELD_KEY.EVENT_ACTIONS] ?? 0}
                      </span>
                    </p>
                    <p className="d-flex justify-content-between mb-0 text-white">
                      Conversion Actions
                      <span className="fw-semibold">
                        {uxPercentDetail[BI_FLOW_LIST_FIELD_KEY.CONVERSION_ACTIONS] ?? 0}
                      </span>
                    </p>
                    <p className="d-flex justify-content-between mb-0 text-white">
                      UTM engagement score
                      <span className="fw-semibold">{total_utm_score ?? 0}</span>
                    </p>
                    <p className="d-flex justify-content-between mb-0 text-white">
                      Tag value engagement score
                      <span className="fw-semibold">{total_tag_metric_score ?? 0}</span>
                    </p>
                  </div>
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.TRAFFIC) {
              return (
                <div className={'px-3 d-flex align-items-center'}>
                  {cell?.value[BI_FLOW_LIST_FIELD_KEY.DEVICE] === 'bot' ? (
                    <div
                      className="me-sm cursor-pointer"
                      data-tooltip-id="tooltipBotUser"
                      data-tooltip-content={'Bot'}
                    >
                      <Image
                        className={`me-sm object-fit-contain`}
                        style={{ width: 20, height: 20 }}
                        src={env.PUBLIC_URL + '/assets/images/bot_user.svg'}
                        alt={'icons'}
                      />
                      <Tooltip id="tooltipBotUser" />
                    </div>
                  ) : (
                    <></>
                  )}
                  {cell?.value[BI_FLOW_LIST_FIELD_KEY.BAD_USER] ? (
                    <div
                      className="cursor-pointer"
                      data-tooltip-id="tooltipBadUser"
                      data-tooltip-content={'Bad User'}
                    >
                      <Image
                        className={`me-sm object-fit-contain`}
                        style={{ width: 20, height: 20 }}
                        src={env.PUBLIC_URL + '/assets/images/bad_user.svg'}
                        alt={'icons'}
                      />
                      <Tooltip id="tooltipBadUser" />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.EVENTS) {
              const total_tag_metric_value = cell?.value?.length
                ? cell?.value?.reduce((sum, item) => sum + (item.tag_metric_value || 0), 0)
                : 0;
              const total_utm_value = cell?.value?.length
                ? cell?.value?.reduce((sum, item) => {
                    if (item.utm_value_type === item.event_name) {
                      return sum + (item.utm_value || 0);
                    }
                    return sum;
                  }, 0)
                : 0;
              const total_metric_value = total_tag_metric_value + total_utm_value;
              return (
                <div className={'px-3'}>
                  {total_metric_value ? total_metric_value : 0}{' '}
                  {`${utm_currency ? utm_currency : ''}`}
                </div>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.SOP_ID) {
              return <div className={'px-3'}>{cell?.value ? cell?.value : 'Not Available'}</div>;
            } else {
              return <div className={'px-3'}>{cell?.value}</div>;
            }
          },
        };
      });
      const data = this.data?.map((item) => {
        const uxPercentDetail = {
          [BI_FLOW_LIST_FIELD_KEY.VISIT_ACTIONS]: item[BI_FLOW_LIST_FIELD_KEY.VISIT_ACTIONS],
          [BI_FLOW_LIST_FIELD_KEY.EVENT_ACTIONS]: item[BI_FLOW_LIST_FIELD_KEY.EVENT_ACTIONS],
          [BI_FLOW_LIST_FIELD_KEY.CONVERSION_ACTIONS]:
            item[BI_FLOW_LIST_FIELD_KEY.CONVERSION_ACTIONS],
        };
        return {
          uxPercentDetail,
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
          if (!accessor.includes(prop) && prop !== 'uxPercentDetail') {
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
        pageview: filterDate?.[BI_FLOW_LIST_FIELD_KEY.PAGEVIEW] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      let totalConversionCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.EVENT],
          0
        );
        totalConversionCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.CONVERSION],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.PAGEVIEW],
          0
        );
      }

      return {
        name: month,
        event: totalVisitorCount,
        conversion: totalConversionCount,
        pageview: totalPageViewCount,
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
          pageview: 0,
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
        const totalConversionCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.CONVERSION],
          0
        );
        const totalPageViewCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_FLOW_LIST_FIELD_KEY.PAGEVIEW],
          0
        );

        weekData[weekName].event += totalVisitorCount;
        weekData[weekName].conversion += totalConversionCount;
        weekData[weekName].pageview += totalPageViewCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      event: weekData[weekName].event,
      conversion: weekData[weekName].conversion,
      pageview: weekData[weekName].pageview,
    }));

    return [{ action: month }, { action: date }, { action: week }];
  };

  getFilterName = () => {
    return [{ label: 'Action', value: 'action' }];
  };
}

export default FlowListModel;
