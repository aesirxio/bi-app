import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Table from '../../../components/Table';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { env } from 'aesirx-lib';
import PAGE_STATUS from '../../../constants/PageStatus';

const TopTableComponent = (props) => {
  const { data, isPagination = true, status, t } = props;
  const columnsTable = React.useMemo(
    () =>
      data?.header?.map((item, index) => {
        return {
          ...item,
          className: `py-16 fs-sm fw-semibold border-bottom border-gray-800 align-middle ${
            index !== 0 ? 'px-15 rounded-top-end-3 text-end' : 'pe-15'
          } ${index === 0 ? 'rounded-top-start-3' : ''}`,
          width: item.width ? item.width : index === 0 ? 'auto' : 170,
          Header: <span className="align-middle">{t(item.Header)}</span>,
        };
      }),
    [data?.header]
  );
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
          pagination={isPagination}
          paginationClass={'fs-14 px-4'}
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
export default withTranslation()(withRouter(TopTableComponent));
