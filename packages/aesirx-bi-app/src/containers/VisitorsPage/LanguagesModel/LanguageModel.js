/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_LANGUAGES_FIELD_KEY, BI_SUMMARY_FIELD_KEY, Helper } from 'aesirx-lib';
import moment from 'moment';

class LanguageModel {
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

  toLanguagesTableTop = () => {
    const headerTable = [
      'txt_language',
      'txt_views',
      'txt_page_views',
      'txt_unique_page_views',
      'txt_bounce_rate',
      'txt_page_session',
      'txt_time_on_page',
    ];
    const accessor = [
      BI_LANGUAGES_FIELD_KEY.LANG,
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
          allowSort: true,
          width:
            key === BI_LANGUAGES_FIELD_KEY.LANG
              ? 250
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS ||
                key === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION
              ? 220
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS
              ? 140
              : 170,
          Cell: ({ cell, column }) =>
            column.id === BI_LANGUAGES_FIELD_KEY.LANG ? (
              <div className={'px-15'}>{cell?.value === '' ? 'Unknown' : cell?.value}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.BOUNCE_RATE ? (
              <div className={'px-3 text-end'}>{cell?.value + '%' ?? null}</div>
            ) : column.id === BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION ? (
              <div className={'px-3 text-end'}>
                {cell?.value ? moment.utc(cell?.value * 1000).format('HH:mm:ss') : '00:00:00'}
              </div>
            ) : (
              <div className={'px-15 text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
            ),
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

export default LanguageModel;
