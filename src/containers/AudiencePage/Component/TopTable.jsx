import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Table from 'components/Table';
import RingLoaderComponent from 'components/Spinner/ringLoader';
import ComponentNoData from 'components/ComponentNoData';
import { env } from 'env';
import PAGE_STATUS from 'constants/PageStatus';
const TopTableComponent = ({ data, status, t }) => {
  const columnsTable = React.useMemo(
    () =>
      data?.header?.map((item, index) => ({
        ...item,
        className: `px-15 py-16 fs-sm fw-semibold border-bottom border-gray-800 ${
          index + 1 === data?.header?.length ? 'rounded-top-end-3 text-end' : ''
        } ${index === 0 ? 'rounded-top-start-3' : ''}`,
        width: 100,
        Header: t(item.Header),
      })),
    [data?.header]
  );
  console.log('columnsTable', columnsTable);
  const dataTable = React.useMemo(() => data?.data, [data?.data]);
  return (
    <>
      {status === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
      ) : data ? (
        <Table
          classNameTable={'mb-0 table table-striped'}
          columns={columnsTable}
          data={dataTable}
          canSort={true}
          pagination={false}
          limit={10}
        />
      ) : (
        <div className="position-relative ChartWrapper bg-white rounded-3 shadow-sm">
          <div className="position-absolute top-50 start-50 translate-middle">
            <ComponentNoData
              icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
              title={t('txt_no_data')}
              width="w-50"
            />
          </div>
        </div>
      )}
    </>
  );
};
export default withTranslation('common')(withRouter(TopTableComponent));
