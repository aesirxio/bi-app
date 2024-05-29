/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_OUTLINK_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

class OutlinkModel {
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

  toOutlinkTableTop = () => {
    const headerTable = ['', 'txt_search_engines', 'txt_visits'];
    const accessor = [
      BI_OUTLINK_FIELD_KEY.URLS,
      BI_OUTLINK_FIELD_KEY.REFERER,
      BI_SUMMARY_FIELD_KEY.TOTAL_NUMBER_OF_VISITORS,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          width:
            key === BI_OUTLINK_FIELD_KEY.REFERER
              ? 300
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : key === BI_OUTLINK_FIELD_KEY.URLS
              ? 10
              : 170,
          Cell: ({ cell, column, row }) => {
            return column.id === BI_OUTLINK_FIELD_KEY.REFERER ? (
              <>
                <a
                  href={`//${cell?.value}`}
                  target="_blank"
                  rel="noreferrer"
                  className={'px-15 d-block text-secondary-50'}
                >
                  <span>{cell?.value}</span>
                </a>
              </>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3 text-end'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-15 text-end'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : column.id === BI_OUTLINK_FIELD_KEY.URLS ? (
              cell?.value?.length ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: {
                      paddingLeft: `${row.depth * 2}rem`,
                    },
                  })}
                >
                  {row.isExpanded ? (
                    <i className="ms-2 fs-5 text-success">
                      <FontAwesomeIcon icon={faMinusSquare} />
                    </i>
                  ) : (
                    <i className="ms-2 fs-5 text-success">
                      <FontAwesomeIcon icon={faPlusSquare} />
                    </i>
                  )}
                </span>
              ) : null
            ) : (
              <div className={'px-15 text-end'}>{cell?.value ?? null}</div>
            );
          },
          SubCell: ({ column, value }) => {
            return column.id === BI_OUTLINK_FIELD_KEY.REFERER ? (
              <>
                <a
                  href={`//${value}`}
                  target="_blank"
                  rel="noreferrer"
                  className={'px-15 d-block text-secondary-50'}
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
              return i === BI_OUTLINK_FIELD_KEY.URLS
                ? {
                    [i]: item[i]?.map((item) => {
                      return { referer: item?.url, ...item };
                    }),
                  }
                : {
                    [i]: item[i],
                  };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });
      console.log('data', data);
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

export default OutlinkModel;
