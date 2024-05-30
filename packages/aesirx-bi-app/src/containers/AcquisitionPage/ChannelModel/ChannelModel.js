/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_CHANNEL_FIELD_KEY, BI_PAGES_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

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
      '',
      'txt_source',
      'txt_visitors',
      'txt_unique_visitors',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_acg_session_duration',
    ];
    const accessor = [
      'searchEngine',
      BI_CHANNEL_FIELD_KEY.CHANNEL,
      BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
      BI_SUMMARY_FIELD_KEY.BOUNCE_RATE,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION,
      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION,
    ];
    console.log('this.data', this.data);
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
              : key === 'searchEngine'
              ? 20
              : 170,
          tooltip:
            key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS ? 'txt_bounce_rate' : '',
          Cell: ({ cell, column, row }) => {
            return column.id === BI_CHANNEL_FIELD_KEY.CHANNEL ? (
              <div className="d-flex align-items-center">
                {integration ? (
                  <a
                    href="#"
                    onClick={(e) =>
                      this.handleChangeLink(e, `acquisition/detail?url=${cell?.value}}`)
                    }
                    className={'px-15 d-block text-secondary-50 text-capitalize mt-sm'}
                  >
                    <span>{cell?.value}</span>
                  </a>
                ) : (
                  <NavLink
                    to={`/acquisition/detail?url=${cell?.value}`}
                    className={'px-15 d-block text-secondary-50 text-capitalize mt-sm'}
                  >
                    {cell?.value}
                  </NavLink>
                )}
              </div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3 text-end'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-15 text-end'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : column.id === 'searchEngine' ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className="ms-3"
              >
                {row?.original[BI_CHANNEL_FIELD_KEY.CHANNEL] === 'search' ? (
                  <>
                    {row.isExpanded ? (
                      <i className="ms-2 fs-5 text-success">
                        <FontAwesomeIcon icon={faMinusSquare} />
                      </i>
                    ) : (
                      <i className="ms-2 fs-5 text-success">
                        <FontAwesomeIcon icon={faPlusSquare} />
                      </i>
                    )}
                  </>
                ) : (
                  <div className="ms-4"></div>
                )}
              </span>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value ?? null}</div>
            );
          },
          SubCell: ({ column, value }) => {
            return column.id === BI_CHANNEL_FIELD_KEY.CHANNEL ? (
              <>
                <a
                  href={`//${value}`}
                  target="_blank"
                  rel="noreferrer"
                  className={'px-15 ms-3 d-block text-secondary-50'}
                >
                  <span>{value}</span>
                </a>
              </>
            ) : (
              <div className={'px-15 text-end'}>{value ?? null}</div>
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
