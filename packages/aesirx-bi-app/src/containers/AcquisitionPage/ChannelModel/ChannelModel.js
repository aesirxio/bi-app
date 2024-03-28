/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_CHANNEL_FIELD_KEY, BI_PAGES_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

class ChannelModel {
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

  toPieChart = () => {
    const channelData = this.data.map((item) => {
      return {
        name: item[BI_CHANNEL_FIELD_KEY.CHANNEL],
        value: item[BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS],
      };
    });
    return channelData;
  };

  toChannelTableTop = (integration) => {
    const headerTable = [
      'txt_source',
      'txt_visitors',
      'txt_unique_visitors',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_acg_session_duration',
    ];
    const accessor = [
      BI_CHANNEL_FIELD_KEY.CHANNEL,
      BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
      BI_SUMMARY_FIELD_KEY.BOUNCE_RATE,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION,
      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          width:
            key === BI_PAGES_FIELD_KEY.URL
              ? 300
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          tooltip:
            key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS ? 'txt_bounce_rate' : '',
          Cell: ({ cell, column }) => {
            return column.id === BI_CHANNEL_FIELD_KEY.CHANNEL ? (
              <>
                {integration ? (
                  <a
                    href="#"
                    onClick={(e) =>
                      this.handleChangeLink(e, `acquisition/detail?url=${cell?.value}}`)
                    }
                    className={'px-15 d-block text-secondary-50 text-capitalize'}
                  >
                    <span>{cell?.value}</span>
                  </a>
                ) : (
                  <NavLink
                    to={`/acquisition/detail?url=${cell?.value}`}
                    className={'px-15 d-block text-secondary-50 text-capitalize'}
                  >
                    {cell?.value}
                  </NavLink>
                )}
              </>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3 text-end'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-15 text-end'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value ?? null}</div>
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
}

export default ChannelModel;
