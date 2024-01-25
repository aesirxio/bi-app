/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import { BI_FLOW_LIST_FIELD_KEY, Helper } from 'aesirx-lib';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

class FlowListModel {
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

  toFlowListTable = () => {
    const headerTable = [
      'txt_time_utc',
      'txt_locale',
      'txt_sop_id',
      'txt_event',
      'txt_conversion',
      'txt_url',
      '',
      // 'txt_tier',
      // 'txt_session',
      // 'txt_referrer',
    ];
    const accessor = [
      BI_FLOW_LIST_FIELD_KEY.START,
      BI_FLOW_LIST_FIELD_KEY.GEO,
      BI_FLOW_LIST_FIELD_KEY.SOP_ID,
      BI_FLOW_LIST_FIELD_KEY.EVENT,
      BI_FLOW_LIST_FIELD_KEY.CONVERSION,
      BI_FLOW_LIST_FIELD_KEY.URL,
      BI_FLOW_LIST_FIELD_KEY.UUID,
      // BI_FLOW_LIST_FIELD_KEY.TIER,
      // BI_FLOW_LIST_FIELD_KEY.SESSION,
      // BI_FLOW_LIST_FIELD_KEY.REFERRER,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width:
            key === BI_FLOW_LIST_FIELD_KEY.START
              ? 100
              : key === BI_FLOW_LIST_FIELD_KEY.SOP_ID
              ? 40
              : key === BI_FLOW_LIST_FIELD_KEY.EVENT ||
                key === BI_FLOW_LIST_FIELD_KEY.CONVERSION ||
                key === BI_FLOW_LIST_FIELD_KEY.GEO
              ? 30
              : key === BI_FLOW_LIST_FIELD_KEY.URL
              ? 230
              : key === BI_FLOW_LIST_FIELD_KEY.UUID
              ? 80
              : 170,
          allowSort:
            key === BI_FLOW_LIST_FIELD_KEY.EVENT ||
            key === BI_FLOW_LIST_FIELD_KEY.CONVERSION ||
            key === BI_FLOW_LIST_FIELD_KEY.URL ||
            key === BI_FLOW_LIST_FIELD_KEY.SOP_ID ||
            key === BI_FLOW_LIST_FIELD_KEY.GEO
              ? false
              : true,
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
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.UUID) {
              return (
                <>
                  <NavLink to={`/flow/${cell?.value}`} className={'btn btn-light px-3 py-1 fs-sm'}>
                    View Detail
                  </NavLink>
                </>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.URL && cell?.value) {
              const urlParams = new URL(cell?.value);
              let displayUrl = urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search;
              return (
                <a
                  href={cell?.value}
                  target="_blank"
                  className={'px-3 d-inline-block text-secondary-50'}
                >
                  {displayUrl?.length > 53 ? displayUrl?.slice(0, 53) + '...' : displayUrl}
                </a>
              );
            } else if (column.id === BI_FLOW_LIST_FIELD_KEY.START) {
              return (
                <div className={'px-3'}>
                  {moment(cell?.value)?.utc()?.format('DD-MM-YYYY HH:mm:ss')}
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

export default FlowListModel;
