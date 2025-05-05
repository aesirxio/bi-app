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
      'txt_datetime',
      'txt_expiration',
      'txt_consent',
      'txt_web3id',
      'txt_wallet',
      // 'txt_consent',
      'txt_uuid',
      'txt_ip',
    ];
    const accessor = [
      BI_CONSENTS_LIST_FIELD_KEY.DATETIME,
      BI_CONSENTS_LIST_FIELD_KEY.EXPIRATION,
      BI_CONSENTS_LIST_FIELD_KEY.TIER,
      BI_CONSENTS_LIST_FIELD_KEY.WEB3ID,
      BI_CONSENTS_LIST_FIELD_KEY.WALLET,
      // BI_CONSENTS_LIST_FIELD_KEY.CONSENT,
      BI_CONSENTS_LIST_FIELD_KEY.UUID,
      BI_CONSENTS_LIST_FIELD_KEY.IP,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_CONSENTS_LIST_FIELD_KEY.TIER
              ? 240
              : key === BI_CONSENTS_LIST_FIELD_KEY.DATETIME ||
                key === BI_CONSENTS_LIST_FIELD_KEY.EXPIRATION
              ? 180
              : key === BI_CONSENTS_LIST_FIELD_KEY.IP
              ? 150
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
              <div className={'pe-15'}>
                {cell?.value && moment(cell?.value).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            ) : column.id === BI_CONSENTS_LIST_FIELD_KEY.EXPIRATION ? (
              <div className={'px-15'}>
                {cell?.value && moment(cell?.value).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            ) : column.id === BI_CONSENTS_LIST_FIELD_KEY.TIER ? (
              <div className={`px-15`}>
                {cell?.value?.toString() === '3'
                  ? 'Decentralized Consent'
                  : cell?.value?.toString() === '4'
                  ? 'Decentralized Consent + SoP'
                  : cell?.value?.toString() === '5'
                  ? 'Category-base & Granular Consent'
                  : cell?.value?.toString() === '6'
                  ? 'Opt-Out Consent'
                  : 'Consent'}
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
