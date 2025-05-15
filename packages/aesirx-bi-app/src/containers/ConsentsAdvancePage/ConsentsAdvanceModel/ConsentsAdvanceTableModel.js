/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';

class ConsentsTableModel {
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

  toConsentsListTable = () => {
    const headerTable = [
      'txt_timezone_language',
      'txt_users_percentage',
      'txt_opt_in_percenntage',
      'txt_opt_out_percenntage',
      '',
      '',
    ];
    const accessor = [
      'language',
      'total_consent_region',
      'opt_in_consent_region',
      'opt_out_consent_region',
      'timezone',
      'total_consent',
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === 'language' ? 300 : key === 'timezone' || key === 'total_consent' ? 10 : 170,
          allowSort: true,
          Cell: ({ cell, column }) => {
            return column.id === 'language' ? (
              <div className={'pe-15'}>
                {cell?.value +
                  (cell?.row?.original?.timezone ? ', ' + cell?.row?.original?.timezone : '')}
              </div>
            ) : column.id === 'total_consent_region' ? (
              <div className={'px-15'}>
                {cell?.value
                  ? Math.round((cell?.value / cell?.row?.original?.total_consent) * 100)
                  : 0}
                %
              </div>
            ) : column.id === 'opt_in_consent_region' ? (
              <div className={'px-15'}>
                {cell?.value
                  ? Math.round((cell?.value / cell?.row?.original?.total_consent_region) * 100)
                  : 0}
                %
              </div>
            ) : column.id === 'opt_out_consent_region' ? (
              <div className={'px-15'}>
                {cell?.value
                  ? Math.round((cell?.value / cell?.row?.original?.total_consent_region) * 100)
                  : 0}
                %
              </div>
            ) : column.id === 'timezone' ? (
              <div className={'px-15'}></div>
            ) : column.id === 'total_consent' ? (
              <div className={'px-15'}></div>
            ) : (
              <div className={`${index === 0 ? 'pe-15' : 'px-15'}`}>{cell?.value}</div>
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

export default ConsentsTableModel;
