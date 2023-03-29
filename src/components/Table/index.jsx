/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { withTranslation } from 'react-i18next';
import ComponentNoData from '../ComponentNoData';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { env } from 'env';
const Table = ({
  columns,
  data,
  pagination,
  store,
  setLoading,
  onSelect,
  dataList,
  classNameTable,
  canSort,
  sortAPI,
  ...props
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    pageOptions,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    nextPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      onSelect,
      initialState: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    useSortBy,
    usePagination
  );

  // const handlePagination = async (pageIndex) => {
  //   setLoading(true);
  //   await store.goToPage(pageIndex);
  //   setLoading(false);
  // };
  const { t } = props;
  return (
    <>
      <div className="bg-white fs-14 shadow-sm text-color rounded-3 position-relative">
        {rows.length ? (
          <table {...getTableProps()} className={`w-100 ${classNameTable}`}>
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
                      let sortParams = column.sortParams ?? column.id;
                      let columnInside = '';
                      if (column.rowSpan && canSort && !sortAPI) {
                        columnInside = column.columns[0];
                      }
                      return (
                        <th
                          key={index}
                          {...(!sortAPI && {
                            ...column.getHeaderProps(
                              canSort && !column.rowSpan
                                ? column.getSortByToggleProps()
                                : columnInside && columnInside.getSortByToggleProps()
                            ),
                          })}
                          className={`${column.className} ${
                            sortAPI && sortParams !== 'number' && sortParams !== 'selection'
                              ? 'cursor-pointer'
                              : ''
                          }`}
                          {...(sortAPI &&
                            sortParams !== 'number' &&
                            sortParams !== 'selection' && {
                              onClick: async () => {
                                setLoading(true);
                                if (store.sortBy.id === sortParams && store.sortBy.desc) {
                                  store.sortBy = { desc: true };
                                } else if (store.sortBy.id !== sortParams) {
                                  store.sortBy = { id: sortParams, desc: false };
                                } else {
                                  store.sortBy = { id: sortParams, desc: !store.sortBy.desc };
                                }
                                await store.getItems();
                                setLoading(false);
                              },
                            })}
                          rowSpan={`${column.rowSpan ?? 1}`}
                        >
                          {column.render('Header')}
                          {canSort && (
                            <span className="position-relative">
                              {sortAPI ? (
                                store?.sortBy?.id === sortParams &&
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                  store?.sortBy?.desc ? (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-down ms-sm"
                                      icon={faSortDown}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-up ms-sm mb-nsm"
                                      icon={faSortUp}
                                    />
                                  )
                                ) : (
                                  ''
                                )
                              ) : !column.rowSpan ? (
                                column.isSorted &&
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                  column.isSortedDesc ? (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-down ms-sm"
                                      icon={faSortDown}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-up ms-sm mb-nsm"
                                      icon={faSortUp}
                                    />
                                  )
                                ) : (
                                  ''
                                )
                              ) : columnInside.isSorted &&
                                // Column have rowSpan
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                columnInside.isSortedDesc ? (
                                  <FontAwesomeIcon
                                    className="sort-icon sort-icon-down ms-sm"
                                    icon={faSortDown}
                                  />
                                ) : (
                                  <FontAwesomeIcon
                                    className="sort-icon sort-icon-up ms-sm mb-nsm"
                                    icon={faSortUp}
                                  />
                                )
                              ) : (
                                ''
                              )}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length > 0 &&
                page.map((row) => {
                  prepareRow(row);
                  let newRowCells = '';

                  dataList
                    ? (newRowCells = row.cells.filter(
                        (item) => !dataList.some((other) => item.column.id === other)
                      ))
                    : (newRowCells = row.cells);

                  return (
                    <tr key={row.getRowProps().key} {...row.getRowProps()}>
                      {newRowCells.map((cell, index) => {
                        return (
                          <td
                            key={index}
                            {...cell.getCellProps({ style: { width: cell.column.width } })}
                            className="py-2 wb-all"
                          >
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
          <div className="">
            <ComponentNoData
              icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
              title={t('txt_no_data')}
              width="w-50"
            />
          </div>
        ) : null}
      </div>
      {pagination && pageOptions.length ? (
        <div className="mt-3 pb-3 text-center pagination d-flex justify-content-end align-items-center">
          <button
            className="border-1 bg-white text-body btn p-0 w-40px h-40px"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>{' '}
          <button
            className="border-1 bg-white text-body btn p-0 w-40px h-40px"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>{' '}
          <button
            className="border-1 bg-white text-body btn p-0 w-40px h-40px"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>{' '}
          <button
            className="border-1 bg-white text-body btn p-0 w-40px h-40px"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <p className="d-flex m-0 align-items-center h-40px">
            | Go to page:{' '}
            <input
              type="number"
              className="form-control h-40px py-0"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </p>{' '}
          <select
            className="ms-1 form-select w-150px bg-white h-40px py-0"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </>
  );
};

export default withTranslation('common')(Table);
