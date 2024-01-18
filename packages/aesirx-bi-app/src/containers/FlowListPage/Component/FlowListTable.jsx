import { BI_SUMMARY_FIELD_KEY } from 'aesirx-lib';
import Table from '../../../components/Table';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { PAGE_STATUS, RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from 'components/ComponentNoData';
const FlowListTable = (props) => {
  const {
    data,
    t,
    isPagination = true,
    simplePagination = false,
    pagination,
    selectPage,
    selectPageSize,
    status,
    limit,
    isPaginationAPI = isPagination ? true : false,
    sortAPI,
    handleSort,
    sortBy,
  } = props;
  const columnsTable = React.useMemo(
    () =>
      data?.header.map((item, index) => {
        let tooltip = '';
        switch (item?.accessor) {
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS:
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS:
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS:
            break;
          case BI_SUMMARY_FIELD_KEY.BOUNCE_RATE:
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION:
            break;
          case BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION:
            break;
          default:
            tooltip = '';
        }
        return {
          ...item,
          className: `px-3 py-16 fs-sm fw-semibold border-bottom ${
            index + 1 === data?.header.length ? 'rounded-top-end-3' : ''
          } ${index === 0 ? 'rounded-top-start-3' : ''}`,
          width: item.width ? item.width : index === 0 ? 'auto' : 170,
          allowSort: item?.allowSort || false,
          Header: (
            <span className="align-middle">
              {t(item.Header)}
              {tooltip && (
                <>
                  <FontAwesomeIcon
                    data-tooltip-id="tooltipTable"
                    data-tooltip-content={t(tooltip)}
                    className="mx-sm fs-12 mb-1"
                    icon={faCircleInfo}
                  />
                  <Tooltip id="tooltipTable" />
                </>
              )}
            </span>
          ),
        };
      }),
    [data?.header]
  );
  const dataTable = React.useMemo(() => data?.data, [data?.data]);
  return (
    <div className="h-100 position-relative">
      {status === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
      ) : data ? (
        <Table
          classNameTable={'mb-0'}
          columns={columnsTable}
          data={dataTable}
          canSort={true}
          pagination={isPagination}
          paginationClass={'fs-14 border-top mt-2'}
          isPaginationAPI={isPaginationAPI}
          paginationResponse={pagination}
          selectPage={selectPage}
          selectPageSize={selectPageSize}
          simplePagination={simplePagination}
          limit={limit}
          sortAPI={sortAPI}
          sortAPIHandle={handleSort}
          sortBy={sortBy}
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
    </div>
  );
};
export default withTranslation()(FlowListTable);
