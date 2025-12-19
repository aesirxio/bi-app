/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_FLOW_LIST_FIELD_KEY, env } from 'aesirx-lib';
import moment from 'moment';
import { Link, NavLink } from 'react-router-dom';
import { enumerateDaysBetweenDates } from 'aesirx-lib';
import ComponentSVG from 'components/ComponentSVG';
import { Image } from 'react-bootstrap';
import { Tooltip } from 'react-tooltip';
import { timeAgo } from 'utils';

class RealTimeModel {
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
  toRealTimeTable = (integration, utm_currency = '') => {
    const headerTable = [
      'ID',
      'Last activity',
      'Current/last page',
      'Source',
      'Device',
      'Browser',
      'Country',
      'Session metric value',
    ];
    const accessor = [
      BI_FLOW_LIST_FIELD_KEY.FLOW_UUID,
      BI_FLOW_LIST_FIELD_KEY.END,
      BI_FLOW_LIST_FIELD_KEY.URL,
      'utm_campaign_label',
      BI_FLOW_LIST_FIELD_KEY.DEVICE,
      BI_FLOW_LIST_FIELD_KEY.BROWSER_NAME,
      BI_FLOW_LIST_FIELD_KEY.GEO,
      BI_FLOW_LIST_FIELD_KEY.EVENTS,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_FLOW_LIST_FIELD_KEY.URL
              ? 350
              : key === BI_FLOW_LIST_FIELD_KEY.EVENTS || key === 'utm_campaign_label'
              ? 150
              : key === BI_FLOW_LIST_FIELD_KEY.END
              ? 120
              : 80,
          allowSort: true,
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
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.FLOW_UUID) {
              return (
                <Link
                  to={`/flow/${cell?.value}`}
                  className={'d-block px-3 text-secondary'}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100px',
                  }}
                >
                  {cell?.value}
                </Link>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.END) {
              return <div className={'px-3'}>{cell?.value ? timeAgo(cell?.value) : ''}</div>;
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.DEVICE) {
              return <div className={'px-3 text-capitalize'}>{cell?.value}</div>;
            } else if (column.id === 'utm_campaign_label') {
              const referer = row?.original?.events[0]?.referer ?? '';
              const utm_campaign_label = row?.original?.events[0]?.utm_campaign_label ?? '';
              const domain = referer ? new URL(referer).hostname : '';
              let refererHostname = 'Direct';
              switch (domain) {
                case '':
                  refererHostname = 'Direct';
                  break;
                case 'google.com':
                  refererHostname = 'Google';
                  break;
                case 'facebook.com':
                  refererHostname = 'Facebook';
                  break;
                case 'linkedin.com':
                  refererHostname = 'Linkedin';
                  break;
                case 'yandex.ru':
                  refererHostname = 'Yandex';
                  break;
                case 'duckduckgo.com':
                  refererHostname = 'Duckduckgo';
                  break;
                case 'reddit.com':
                  refererHostname = 'Reddit';
                  break;
                case 'twitter.com':
                  refererHostname = 'Twitter';
                  break;
                case 'github.com':
                  refererHostname = 'Github';
                  break;
              }
              const source = utm_campaign_label ? utm_campaign_label : refererHostname;
              return <div className={'px-3 text-capitalize'}>{source}</div>;
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.EVENTS) {
              const total_utm_value =
                cell?.value?.reduce((sum, item) => {
                  return sum + (item.utm_value || 0);
                }, 0) ?? 0;
              const total_tag_value =
                cell?.value?.reduce((sum, item) => {
                  return sum + (item.tag_metric_value || 0);
                }, 0) ?? 0;
              return (
                <div className={'px-3 text-capitalize'}>
                  {total_utm_value + total_tag_value} {utm_currency ? utm_currency : ''}
                </div>
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

  getFilterName = () => {
    return [{ label: 'Action', value: 'action' }];
  };
}

export default RealTimeModel;
