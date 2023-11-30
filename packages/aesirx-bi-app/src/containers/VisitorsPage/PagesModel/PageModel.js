/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_PAGES_FIELD_KEY, BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';

class PageModel {
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

  toPagesTableTopDashboard = () => {
    const headerTable = ['txt_page', 'txt_page_views', 'txt_time_on_page'];
    const accessor = [
      BI_PAGES_FIELD_KEY.URL,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
      BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION,
    ];
    const largestValue = Math.max(
      ...this.data.map((o) => o[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS])
    );
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          Cell: ({ cell, column, row }) => {
            const urlParams = column.id === BI_PAGES_FIELD_KEY.URL && new URL(cell?.value);
            return column.id === BI_PAGES_FIELD_KEY.URL ? (
              <a
                href={`${cell?.value}`}
                target="_blank"
                rel="noreferrer"
                className={'d-block position-relative px-20 py-sm table-link text-gray-900'}
              >
                <div
                  className="position-absolute top-0 start-0 h-100 z-0 table-link-bg"
                  style={{
                    width: `${((row.cells[1]?.value / largestValue) * 100)?.toString()}%`,
                  }}
                ></div>
                <div className="position-relative z-1 text-ellipsis line-clamp-1 pe-20">
                  <div className="position-relative table-link-text">
                    {urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search}
                  </div>
                </div>
              </a>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'text-end'}>
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

  toPagesTableTop = () => {
    const headerTable = [
      'txt_page',
      'txt_page_views',
      'txt_unique_page_views',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_time_on_page',
    ];
    const accessor = [
      BI_PAGES_FIELD_KEY.URL,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
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
            const urlParams = column.id === BI_PAGES_FIELD_KEY.URL && new URL(cell?.value);
            return column.id === BI_PAGES_FIELD_KEY.URL ? (
              <div className={'px-15'}>
                {urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search}
              </div>
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
      const data = this.data
        ?.map((item) => {
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
        })
        ?.sort(
          (a, b) =>
            b[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS] -
            a[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]
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

export default PageModel;
