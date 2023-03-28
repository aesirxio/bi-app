import Table from 'components/Table';
import React from 'react';
import { withTranslation } from 'react-i18next';
const BehaviorTable = ({ data: { header = [], data = [] } }) => {
  const columnsTable = React.useMemo(
    () =>
      header.map((item, index) => ({
        ...item,
        className: `px-3 py-16 fs-sm fw-semibold bg-gray-700 ${
          index + 1 === header.length ? 'rounded-top-end-3' : ''
        } ${index === 0 ? 'rounded-top-start-3' : ''}`,
      })),
    [header]
  );
  const dataTable = React.useMemo(() => data, [data]);
  return (
    <div className="  h-100">
      <Table
        classNameTable={'text-center mb-0'}
        columns={columnsTable}
        data={dataTable}
        canSort={true}
        pagination={true}
      />
    </div>
  );
};
export default withTranslation('common')(BehaviorTable);
