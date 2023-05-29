import Table from 'components/Table';
import React from 'react';
import { withTranslation } from 'react-i18next';
const CountryTable = (props) => {
  const { data, t } = props;
  const columnsTable = React.useMemo(
    () =>
      data?.header.map((item, index) => ({
        ...item,
        className: `px-3 py-16 fs-sm fw-semibold bg-gray-700 ${
          index + 1 === data?.header.length ? 'rounded-top-end-3' : ''
        } ${index === 0 ? 'rounded-top-start-3' : ''}`,
        width: item.width ? item.width : index === 0 ? 'auto' : 150,
        Header: t(item.Header),
      })),
    [data?.header]
  );
  const dataTable = React.useMemo(() => data?.data, [data?.data]);
  return (
    <div className="h-100 position-relative">
      <Table
        classNameTable={'mb-0'}
        columns={columnsTable}
        data={dataTable}
        canSort={true}
        pagination={true}
      />
    </div>
  );
};
export default withTranslation()(CountryTable);
