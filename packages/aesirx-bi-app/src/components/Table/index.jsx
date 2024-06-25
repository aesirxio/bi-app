/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { useExpanded, usePagination, useSortBy, useTable } from 'react-table';
import { withTranslation } from 'react-i18next';
import ComponentNoData from '../ComponentNoData';
import './index.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { env } from 'aesirx-lib';
import { AesirXSelect } from 'aesirx-uikit';
import ComponentSVG from 'components/ComponentSVG';
import { SubRows } from './RowSubComponent';
import PAGE_STATUS from 'constants/PageStatus';

const Table = ({
  columns,
  data,
  pagination,
  onSelect,
  dataList,
  classNameTable,
  canSort,
  sortAPI,
  sortAPIHandle,
  sortBy,
  limit,
  paginationClass,
  isPaginationAPI,
  paginationResponse,
  selectPage,
  selectPageSize,
  simplePagination = false,
  status,
  hasSubRow,
  idKey,
  tdClass,
  ...props
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    visibleColumns,
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
        pageSize: (isPaginationAPI ? paginationResponse?.page_size : limit) ?? 5,
        pageIndex: 0,
      },
    },
    useSortBy,
    useExpanded,
    usePagination
  );
  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns, subRow, idKey }) => (
      <SubRows
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
        loading={status === PAGE_STATUS.LOADING}
        data={subRow}
        idKey={idKey}
      />
    ),
    [status]
  );

  const handlePagination = async (pageIndex) => {
    await selectPage(pageIndex);
  };
  const handlePageSize = async (pageSize) => {
    await selectPageSize(pageSize);
  };

  const { t } = props;
  let totalPage = isPaginationAPI
    ? [...Array(paginationResponse?.total_pages)]
    : [...Array(pageOptions.length)];
  return (
    <>
      <div className="bg-white fs-14 rounded-3 position-relative text-gray-900 px-24">
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
                let props = {
                  role: headerGroup.getHeaderGroupProps()?.role,
                };
                return (
                  <tr key={index} {...props}>
                    {newHeaderGroup.map((column, index) => {
                      let sortParams = column.sortParams ?? column.id;
                      let columnInside = '';
                      if (column.rowSpan && canSort && !sortAPI) {
                        columnInside = column.columns[0];
                      }
                      return (
                        <th
                          key={index}
                          {...(!sortAPI &&
                            column?.allowSort && {
                              ...column.getHeaderProps(
                                canSort && !column.rowSpan
                                  ? column.getSortByToggleProps()
                                  : columnInside && columnInside.getSortByToggleProps()
                              ),
                            })}
                          className={`${column.className} ${
                            sortAPI &&
                            column?.allowSort &&
                            sortParams !== 'number' &&
                            sortParams !== 'selection'
                              ? 'cursor-pointer'
                              : ''
                          }`}
                          {...(sortAPI &&
                            column?.allowSort &&
                            sortParams !== 'number' &&
                            sortParams !== 'selection' && {
                              onClick: async () => {
                                sortAPIHandle(column);
                              },
                            })}
                          rowSpan={`${column.rowSpan ?? 1}`}
                        >
                          {column.render('Header')}
                          {canSort && column?.allowSort && (
                            <span className="position-relative align-middle">
                              {sortAPI ? (
                                sortBy &&
                                sortBy['sort[]'] === sortParams &&
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                  sortBy['sort_direction[]'] === 'desc' ? (
                                    <ComponentSVG
                                      url={env.PUBLIC_URL + '/assets/images/sort_down.svg'}
                                      color="#5F5E70"
                                    />
                                  ) : (
                                    <span
                                      style={{
                                        transform: 'rotate(180deg)',
                                        display: 'inline-block',
                                      }}
                                    >
                                      <ComponentSVG
                                        url={env.PUBLIC_URL + '/assets/images/sort_down.svg'}
                                        color="#5F5E70"
                                        height={'16px'}
                                      />
                                    </span>
                                  )
                                ) : (
                                  // <ComponentSVG
                                  //   url={env.PUBLIC_URL + '/assets/images/sort.svg'}
                                  //   color="#5F5E70"
                                  // />
                                  <></>
                                )
                              ) : !column.rowSpan ? (
                                column.isSorted &&
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                  column.isSortedDesc ? (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-down ms-sm mt-n3"
                                      icon={faSortDown}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      className="sort-icon sort-icon-up ms-sm mb-nsm"
                                      icon={faSortUp}
                                    />
                                  )
                                ) : (
                                  <></>
                                  // <ComponentSVG
                                  //   url={env.PUBLIC_URL + '/assets/images/sort.svg'}
                                  //   color="#5F5E70"
                                  // />
                                )
                              ) : columnInside.isSorted &&
                                // Column have rowSpan
                                sortParams !== 'number' &&
                                sortParams !== 'selection' ? (
                                columnInside.isSortedDesc ? (
                                  <FontAwesomeIcon
                                    className="sort-icon sort-icon-down ms-sm mt-n3"
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
                  const rowProps = row.getRowProps();
                  let newRowCells = '';

                  dataList
                    ? (newRowCells = row.cells.filter(
                        (item) => !dataList.some((other) => item.column.id === other)
                      ))
                    : (newRowCells = row.cells);
                  const subRow = row.cells.find((item) => item?.column?.id === idKey)?.value ?? [];
                  let props = { role: rowProps?.role };
                  return (
                    <React.Fragment key={row.getRowProps().key}>
                      <tr key={row.getRowProps().key} {...props}>
                        {newRowCells.map((cell, index) => {
                          let props = {
                            role: cell.getCellProps({ style: { width: cell.column.width } })?.role,
                            style: cell.getCellProps({ style: { width: cell.column.width } })
                              ?.style,
                          };
                          return (
                            <td
                              key={index}
                              {...props}
                              className={`wb-all ${tdClass ? tdClass : 'py-2 align-middle'}`}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                      {hasSubRow === false
                        ? null
                        : row.isExpanded &&
                          renderRowSubComponent({ row, rowProps, visibleColumns, subRow, idKey })}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        ) : null}

        {rows.length === 0 ? (
          <div className="ChartWrapper d-flex align-items-center justify-content-center">
            <ComponentNoData
              icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
              title={t('txt_no_data')}
              width="w-50"
            />
          </div>
        ) : null}
      </div>
      {pagination && pageOptions.length ? (
        <div className="mt-auto mb-0">
          <div className={`d-flex align-items-center justify-content-between ${paginationClass}`}>
            {!simplePagination ? (
              <div className="d-flex align-items-center">
                <span className="text-gray-600 me-16">Showing</span>
                <div className="bg-white">
                  <AesirXSelect
                    isClearable={false}
                    isSearchable={false}
                    isBorder={false}
                    isShadow={false}
                    menuPlacement={'top'}
                    options={[
                      { label: 5, value: 5 },
                      { label: 10, value: 10 },
                      { label: 20, value: 20 },
                      { label: 30, value: 30 },
                      { label: 40, value: 40 },
                      { label: 50, value: 50 },
                    ]}
                    getOptionLabel={(options) => (
                      <div className="showing-option d-flex align-items-center">
                        <span>{options.label} items</span>
                      </div>
                    )}
                    className="shadow-none select-bg-white"
                    onChange={(data) => {
                      isPaginationAPI
                        ? handlePageSize(Number(data.value))
                        : setPageSize(Number(data.value));
                    }}
                    defaultValue={{
                      label: isPaginationAPI ? paginationResponse?.page_size : pageSize,
                      value: isPaginationAPI ? paginationResponse?.page_size : pageSize,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-900 fw-light">
                {paginationResponse?.page === 1
                  ? 1
                  : paginationResponse?.page_size * (paginationResponse?.page - 1)}
                -
                {paginationResponse?.total_elements <= paginationResponse?.page_size
                  ? paginationResponse?.total_elements
                  : paginationResponse?.page_size * paginationResponse?.page}{' '}
                to {paginationResponse?.total_elements}
              </div>
            )}
            <div className="mt-2 pb-2 text-center pagination d-flex justify-content-end align-items-center">
              <button
                className={`${
                  !simplePagination ? 'border-1 border-gray-800' : 'border-0'
                } bg-white text-body btn p-0 w-40px h-40px rounded-0 rounded-top-start rounded-bottom-start`}
                onClick={() =>
                  isPaginationAPI ? handlePagination(paginationResponse?.page - 1) : previousPage()
                }
                disabled={isPaginationAPI ? paginationResponse?.page === 1 : !canPreviousPage}
              >
                <ComponentSVG
                  url={env.PUBLIC_URL + '/assets/images/chevron_left.svg'}
                  color={
                    isPaginationAPI
                      ? paginationResponse?.page === 1
                        ? '#5F5E70'
                        : '#1ab394'
                      : !canPreviousPage
                      ? '#5F5E70'
                      : '#1ab394'
                  }
                />
              </button>{' '}
              {!simplePagination && (
                <>
                  <button
                    onClick={() => (isPaginationAPI ? handlePagination(1) : gotoPage(0))}
                    className={`border-1 border-gray-800 rounded-0 btn p-0 w-40px h-40px ${
                      (isPaginationAPI ? paginationResponse?.page === 1 : pageIndex + 1 === 1)
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-body'
                    }`}
                    style={{
                      width: '38px',
                      height: '38px',
                    }}
                  >
                    {1}
                  </button>
                  {(isPaginationAPI ? paginationResponse?.page > 3 : pageIndex > 3) && (
                    <button
                      className={`border-1 border-gray-800 rounded-0 btn p-0 w-40px h-40px bg-white text-body`}
                      style={{
                        width: '38px',
                        height: '38px',
                      }}
                    >
                      ...
                    </button>
                  )}
                  {totalPage.map((x, index) => {
                    let activePage = isPaginationAPI
                      ? paginationResponse?.page === index + 1
                      : pageIndex + 1 === index + 1;
                    let conditionShowNumber = isPaginationAPI
                      ? index !== 0 &&
                        index !== paginationResponse?.total_pages - 1 &&
                        index < paginationResponse?.page - 1 + 3 &&
                        index > paginationResponse?.page - 1 - 3
                      : index !== 0 &&
                        index !== pageOptions.length - 1 &&
                        index < pageIndex + 3 &&
                        index > pageIndex - 3;
                    return (
                      conditionShowNumber && (
                        <button
                          onClick={() =>
                            isPaginationAPI ? handlePagination(index + 1) : gotoPage(index)
                          }
                          key={index}
                          className={`border-1 border-gray-800 rounded-0 btn p-0 w-40px h-40px ${
                            activePage ? 'bg-gray-900 text-white' : 'bg-white text-body'
                          }`}
                          style={{
                            width: '38px',
                            height: '38px',
                          }}
                        >
                          {index + 1}
                        </button>
                      )
                    );
                  })}
                  {(isPaginationAPI
                    ? paginationResponse?.page < paginationResponse?.total_pages - 3
                    : pageIndex < pageOptions.length - 4) && (
                    <button
                      className={`border-1 border-gray-800 rounded-0 btn p-0 w-40px h-40px bg-white text-body`}
                      style={{
                        width: '38px',
                        height: '38px',
                      }}
                    >
                      ...
                    </button>
                  )}
                  {(isPaginationAPI
                    ? paginationResponse?.total_pages > 1
                    : pageOptions.length > 1) && (
                    <button
                      onClick={() =>
                        isPaginationAPI
                          ? handlePagination(paginationResponse?.total_pages)
                          : gotoPage(pageCount - 1)
                      }
                      className={`border-1 border-gray-800 rounded-0 btn p-0 w-40px h-40px ${
                        (
                          isPaginationAPI
                            ? paginationResponse?.page === paginationResponse?.total_pages
                            : pageIndex + 1 === pageOptions.length
                        )
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-body'
                      }`}
                      style={{
                        width: '38px',
                        height: '38px',
                      }}
                    >
                      {isPaginationAPI ? paginationResponse?.total_pages : pageOptions.length}
                    </button>
                  )}
                </>
              )}
              <button
                className={` ${
                  !simplePagination ? 'border-1 border-gray-800' : 'border-0'
                } bg-white text-body btn p-0 w-40px h-40px rounded-0 rounded-top-end rounded-bottom-end`}
                onClick={() =>
                  isPaginationAPI ? handlePagination(paginationResponse?.page + 1) : nextPage()
                }
                disabled={
                  isPaginationAPI
                    ? paginationResponse?.page === paginationResponse?.total_pages
                    : !canNextPage
                }
              >
                <ComponentSVG
                  url={env.PUBLIC_URL + '/assets/images/chevron_right.svg'}
                  color={
                    isPaginationAPI
                      ? paginationResponse?.page === paginationResponse?.total_pages
                        ? '#5F5E70'
                        : '#1ab394'
                      : !canNextPage
                      ? '#5F5E70'
                      : '#1ab394'
                  }
                />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default withTranslation()(Table);
