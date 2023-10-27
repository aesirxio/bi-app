import React from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import Table from '../../../components/Table';
import { RingLoaderComponent } from 'aesirx-uikit';
import ComponentNoData from '../../../components/ComponentNoData';
import { BI_SUMMARY_FIELD_KEY, env } from 'aesirx-lib';
import PAGE_STATUS from '../../../constants/PageStatus';
import { Tooltip } from 'react-tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';

const TopTableComponent = (props) => {
  const {
    data,
    isPagination = true,
    simplePagination = false,
    pagination,
    selectPage,
    selectPageSize,
    status,
    limit,
    isPaginationAPI = isPagination ? true : false,
    t,
  } = props;
  const columnsTable = React.useMemo(
    () =>
      data?.header?.map((item, index) => {
        let tooltip = '';
        switch (item?.accessor) {
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS:
            tooltip = 'txt_tooltip_visitors';
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS:
            tooltip = 'txt_tooltip_page_views';
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS:
            tooltip = 'txt_tooltip_unique_page_views';
            break;
          case BI_SUMMARY_FIELD_KEY.BOUNCE_RATE:
            tooltip = 'txt_tooltip_bounce_rate';
            break;
          case BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION:
            tooltip = 'txt_tooltip_page_session';
            break;
          case BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION:
            tooltip = 'txt_tooltip_avg_session_duration';
            break;
          default:
            tooltip = '';
        }

        return {
          ...item,
          className: `px-15 py-16 fs-sm fw-semibold border-bottom border-gray-800 align-middle ${
            index !== 0 ? 'rounded-top-end-3 text-end' : ''
          } ${index === 0 ? 'rounded-top-start-3' : ''}`,
          width: item.width ? item.width : index === 0 ? 'auto' : 170,
          Header: (
            <span className="align-middle text-gray-900 fw-medium">
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
    <>
      {status === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
      ) : data ? (
        <Table
          classNameTable={'mb-0 table'}
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
