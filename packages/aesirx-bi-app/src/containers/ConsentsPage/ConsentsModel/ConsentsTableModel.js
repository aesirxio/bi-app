/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import { BI_CONSENTS_LIST_FIELD_KEY } from 'aesirx-lib';
import React from 'react';
import moment from 'moment';

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
      'txt_tier',
      'txt_wallet',
      'txt_web3id',
      // 'txt_consent',
      'txt_datetime',
      'txt_expiration',
      'txt_uuid',
    ];
    const accessor = [
      BI_CONSENTS_LIST_FIELD_KEY.TIER,
      BI_CONSENTS_LIST_FIELD_KEY.WALLET,
      BI_CONSENTS_LIST_FIELD_KEY.WEB3ID,
      // BI_CONSENTS_LIST_FIELD_KEY.CONSENT,
      BI_CONSENTS_LIST_FIELD_KEY.DATETIME,
      BI_CONSENTS_LIST_FIELD_KEY.EXPIRATION,
      BI_CONSENTS_LIST_FIELD_KEY.UUID,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_CONSENTS_LIST_FIELD_KEY.TIER
              ? 50
              : key === BI_CONSENTS_LIST_FIELD_KEY.WEB3ID
              ? 100
              : 170,
          allowSort: true,
          Cell: ({ cell, column }) =>
            column.id === BI_CONSENTS_LIST_FIELD_KEY.WEB3ID ? (
              <div className={'px-15'}>{cell?.value}</div>
            ) : column.id === BI_CONSENTS_LIST_FIELD_KEY.WALLET ? (
              <div className={'px-15'}>{cell?.value?.address}</div>
            ) : column.id === BI_CONSENTS_LIST_FIELD_KEY.DATETIME ? (
              <div className={'px-15'}>
                {cell?.value && moment(cell?.value).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            ) : column.id === BI_CONSENTS_LIST_FIELD_KEY.EXPIRATION ? (
              <div className={'px-15'}>
                {cell?.value && moment(cell?.value).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            ) : (
              <div className={`${index === 0 ? 'pe-15' : 'px-15'}`}>{cell?.value}</div>
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

export default ConsentsTableModel;
