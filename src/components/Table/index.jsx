/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { useEffect } from 'react';
import { useExpanded, usePagination, useRowSelect, useTable } from 'react-table';

import styles from './index.module.scss';
import { DAM_ASSETS_FIELD_KEY } from 'aesirx-dma-lib/src/Constant/DamConstant';
import Dropzone from 'components/Dropzone';
import { useTranslation, withTranslation } from 'react-i18next';
import ComponentNoData from '../ComponentNoData';

const Table = ({
  columns,
  data,
  onSelect,
  dataList,
  dataThumb,
  thumbColumnsNumber,
  selection = true,
  isList = true,
  classNameTable,
  onDoubleClick,
  createAssets,
  onRightClickItem,
}) => {
  const { t } = useTranslation('common');

  const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input className="form-check-input p-0" type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  });

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      onSelect,
      initialState: {
        pageSize: -1,
      },
    },
    (hooks) => {
      !selection &&
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            className: 'px-24 py-2 border-bottom-1 text-uppercase',
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div className="wrapper_checkbox">
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
    },
    useExpanded,
    usePagination,
    useRowSelect
  );

  return (
    <>
      {isList ? (
        <div className="bg-white rounded-3 shadow-sm">
          {rows.length ? (
            <table {...getTableProps()} className={`w-100 mb-4 ${classNameTable}`}>
              <thead>
                {headerGroups.map((headerGroup, index) => {
                  let newHeaderGroup = '';

                  dataList
                    ? (newHeaderGroup = headerGroup.headers.filter(
                        (item) => !dataList.some((other) => item.id === other)
                      ))
                    : (newHeaderGroup = headerGroup.headers);

                  return (
                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                      {newHeaderGroup.map((column, index) => {
                        return (
                          <th
                            key={index}
                            {...column.getHeaderProps()}
                            className={`${column.className}`}
                          >
                            {column.render('Header')}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 &&
                  rows.map((row) => {
                    prepareRow(row);
                    let newRowCells = '';

                    dataList
                      ? (newRowCells = row.cells.filter(
                          (item) => !dataList.some((other) => item.column.id === other)
                        ))
                      : (newRowCells = row.cells);

                    return (
                      <tr
                        key={row.getRowProps().key}
                        {...row.getRowProps()}
                        onDoubleClick={
                          row.original[DAM_ASSETS_FIELD_KEY.TYPE]
                            ? () => {}
                            : () => onDoubleClick(row.original.id)
                        }
                        onContextMenu={(e) => {
                          onRightClickItem(e, row.original);
                        }}
                      >
                        {newRowCells.map((cell, index) => {
                          return (
                            <td key={index} {...cell.getCellProps()} className="px-24 py-2">
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          ) : null}

          {rows.length === 0 ? (
            <ComponentNoData
              icons="/assets/images/ic_project.svg"
              title="No Matching Results"
              text="Can not found any project with that keyword. Please try another keyword."
              width="w-50"
              createAssets={createAssets}
            />
          ) : null}
        </div>
      ) : (
        <div {...getTableBodyProps()} className={`row ${rows.length === 0 ? 'col' : ''}`}>
          {rows.map((row, index) => {
            prepareRow(row);
            let newRowCells = row.cells;
            if (dataThumb && dataThumb.length > 0) {
              newRowCells = row.cells.filter(
                (item) => !dataThumb.some((other) => item.column.id === other)
              );
            }

            return (
              newRowCells.length > 0 && (
                <React.Fragment key={Math.random(40, 200)}>
                  {index === 0 ? (
                    <div className="col-12">
                      <p className="fw-bold">{t('txt_folders')}</p>
                    </div>
                  ) : null}
                  <div
                    {...row.getRowProps()}
                    className={`col_thumb cursor-pointer ${styles.col_thumb} col-${
                      !thumbColumnsNumber ? '3' : thumbColumnsNumber
                    } mb-4 zindex-2`}
                    key={Math.random(40, 200)}
                  >
                    <div
                      className={`item_thumb d-flex align-items-center justify-content-center bg-white shadow-sm h-100 rounded-2 overflow-hidden  flex-column`}
                      key={Math.random(40, 200)}
                      onDoubleClick={
                        row.original[DAM_ASSETS_FIELD_KEY.TYPE]
                          ? () => {}
                          : () => onDoubleClick(row.original.id)
                      }
                      onContextMenu={(e) => {
                        onRightClickItem(e, row.original);
                      }}
                    >
                      {newRowCells.map((cell) => {
                        return (
                          <div
                            {...cell.getCellProps()}
                            className={`ct_cell ${styles.ct_cell} d-block`}
                            key={Math.random(40, 200)}
                          >
                            {cell.render('Cell')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              )
            );
          })}

          {rows.length === 0 ? (
            <ComponentNoData
              icons="/assets/images/ic_project.svg"
              title="No Matching Results"
              text="Can not found any project with that keyword. Please try another keyword."
              width="w-50"
              createAssets={createAssets}
            />
          ) : (
            <>
              <div className="position-absolute h-100 w-100 top-0 start-0 zindex-1">
                <Dropzone createAssets={createAssets} noClick={true} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default withTranslation('common')(Table);
