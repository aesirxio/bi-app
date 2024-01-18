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
      'txt_time',
      'txt_locale',
      '',
      // 'txt_sop_id',
      // 'txt_tier',
      // 'txt_session',
      // 'txt_url',
      // 'txt_referrer',
    ];
    const accessor = [
      BI_FLOW_LIST_FIELD_KEY.START,
      BI_FLOW_LIST_FIELD_KEY.GEO,
      BI_FLOW_LIST_FIELD_KEY.UUID,
      // BI_FLOW_LIST_FIELD_KEY.SOP_ID,
      // BI_FLOW_LIST_FIELD_KEY.TIER,
      // BI_FLOW_LIST_FIELD_KEY.SESSION,
      // BI_FLOW_LIST_FIELD_KEY.URL,
      // BI_FLOW_LIST_FIELD_KEY.REFERRER,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          width: key === BI_FLOW_LIST_FIELD_KEY.UUID ? 10 : 170,
          allowSort: key === BI_FLOW_LIST_FIELD_KEY.COUNTRY_NAME ? false : true,
          Cell: ({ cell, column, row }) => {
            return column.id === BI_FLOW_LIST_FIELD_KEY.GEO ? (
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
                <span className="text-nowrap">
                  {cell?.value === '' ? 'Unknown' : cell?.value?.country?.name}
                </span>
              </div>
            ) : column.id === BI_FLOW_LIST_FIELD_KEY.UUID ? (
              <>
                <NavLink
                  to={`/flow/${cell?.value}`}
                  className={'btn btn-success px-3 py-1 fw-semibold'}
                >
                  View Detail
                </NavLink>
              </>
            ) : column.id === BI_FLOW_LIST_FIELD_KEY.START ? (
              <div className={'px-3'}>{moment(cell?.value).format('YYYY-MM-DD HH:mm:ss')}</div>
            ) : (
              <div className={'px-3'}>{cell?.value}</div>
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

export default FlowListModel;
