/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

/**
 * Renders the sub rows for a given row in a table.
 * @param row - The parent row.
 * @param rowProps - The props for the parent row.
 * @param visibleColumns - The visible columns in the table.
 * @param data - The data for the sub rows.
 * @param loading - Flag indicating if the data is still loading.
 * @returns The JSX element representing the sub rows.
 */

function SubRows({ row, rowProps, visibleColumns, data, loading }) {
  if (loading) {
    return (
      <tr>
        <td />
        <td colSpan={visibleColumns.length - 1}>Loading...</td>
      </tr>
    );
  }
  return (
    <>
      {data?.length && (
        <>
          {data.map((x, i) => {
            return (
              <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`} className="row_sub_component">
                {row.cells.map((cell, key) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={key}
                      className={`py-2 wb-all align-middle sub-cell-${cell.column.id} `}
                      style={{ backgroundColor: key === 0 ? '#fff' : '#F0F3FB' }}
                    >
                      {cell.render('SubCell', {
                        value: cell.column.accessor(x, i),
                        row: { ...row, original: x },
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      )}
    </>
  );
}

/**
 * Renders the sub rows asynchronously.
 *
 * @param {object} args - The function arguments.
 * @param {object} args.row - The row object.
 * @param {object} args.rowProps - The row props object.
 * @param {array} args.visibleColumns - The array of visible columns.
 * @param {object} args.listViewModel - The list view model object.
 * @param {string} args.idKey - The ID key string.
 *
 * @returns {JSX.Element} - The rendered sub rows.
 */

const SubRowAsync = ({ row, rowProps, visibleColumns, listViewModel, idKey }) => {
  const [loading, setLoading] = React.useState(true);

  const data = React.useRef([]);

  React.useEffect(() => {
    (async function () {
      try {
        if (idKey) {
          data.current = await listViewModel?.getContentByIdExpanded(row.original[idKey]);
        }

        setLoading(false);
      } catch (e) {
        // console.error(e);
      }
    })();
  }, [listViewModel, row, idKey]);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data.current}
      loading={loading}
    />
  );
};

export { SubRows, SubRowAsync };
