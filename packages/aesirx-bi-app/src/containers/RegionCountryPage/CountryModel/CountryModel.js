/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_COUNTRIES_FIELD_KEY, BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import moment from 'moment';

class CountryModel {
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

  toCountries = () => {
    return (
      this?.data?.length &&
      this.data
        .map((item) => {
          return {
            country: item[BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME],
            country_code: item[BI_COUNTRIES_FIELD_KEY.COUNTRY_CODE],
            views: item[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS],
            flag: `/assets/images/flags/flag-${item[
              BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME
            ]?.toLowerCase()}.png`,
          };
        })
        ?.filter((item) => {
          return item[BI_COUNTRIES_FIELD_KEY.COUNTRY_CODE];
        })
        ?.sort((a, b) => b.views - a.views)
    );
  };

  toCountriesTable = () => {
    const headerTable = [
      'txt_Country',
      'txt_views',
      'txt_page_views',
      'txt_unique_page_views',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_time_on_page',
    ];
    const accessor = [
      BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
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
          width:
            key === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME
              ? 270
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          allowSort: key === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME ? false : true,
          Cell: ({ cell, column, row }) => {
            return column.id === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME ? (
              <div className={'px-3'}>
                <span
                  className={`me-1 fi fi-${this.data
                    .find(
                      (o) =>
                        o[BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME] ===
                        row?.values[BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME]
                    )
                    ?.[BI_COUNTRIES_FIELD_KEY.COUNTRY_CODE]?.toLowerCase()}`}
                ></span>
                <span className="text-nowrap">{`${row.index + 1}. ${
                  cell?.value === '' ? 'Unknown' : cell?.value
                }`}</span>
              </div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-3'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : (
              <div className={'px-3'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
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

  toCountriesTableTop = () => {
    const headerTable = [
      'txt_Country',
      'txt_views',
      'txt_page_views',
      'txt_unique_page_views',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_time_on_page',
    ];
    const accessor = [
      BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
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
          width:
            key === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME
              ? 270
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          allowSort: key === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME ? false : true,
          accessor: key,
          Cell: ({ cell, row, column }) => {
            return column.id === BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME ? (
              <div className={'px-15'}>
                <span
                  className={`me-1 fi fi-${this.data
                    .find(
                      (o) =>
                        o[BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME] ===
                        row?.values[BI_COUNTRIES_FIELD_KEY.COUNTRY_NAME]
                    )
                    ?.[BI_COUNTRIES_FIELD_KEY.COUNTRY_CODE]?.toLowerCase()}`}
                ></span>
                <span className="text-nowrap">{cell?.value === '' ? 'Unknown' : cell?.value}</span>
              </div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3 text-end'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-3 text-end'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : (
              <div className={'px-15 text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
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
}

export default CountryModel;
