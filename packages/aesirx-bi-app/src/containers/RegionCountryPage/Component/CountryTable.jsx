import { BI_SUMMARY_FIELD_KEY, env } from 'aesirx-lib';
import Table from '../../../components/Table';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import ComponentSVG from 'components/ComponentSVG';
const CountryTable = (props) => {
  const { data, t } = props;
  const columnsTable = React.useMemo(
    () =>
      data?.header.map((item, index) => {
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
          className: `px-3 py-16 fs-sm fw-semibold bg-gray-700 ${
            index + 1 === data?.header.length ? 'rounded-top-end-3' : ''
          } ${index === 0 ? 'rounded-top-start-3' : ''}`,
          width: item.width ? item.width : index === 0 ? 'auto' : 170,
          allowSort: item?.allowSort || false,
          Header: (
            <span
              className="align-middle position-relative"
              data-tooltip-id="tooltipTable"
              data-tooltip-content={t(tooltip)}
              data-tooltip-place={`${index === data?.header?.length - 1 ? 'top-end' : 'top'}`}
            >
              {t(item.Header)}
              {tooltip && (
                <>
                  <div
                    className="mx-sm fs-12 mb-1"
                    style={{ position: 'absolute', right: '-5px', top: '-12px' }}
                  >
                    <ComponentSVG
                      url={env.PUBLIC_URL + '/assets/images/info.svg'}
                      width={'12px'}
                      height={'12px'}
                      color={'#5F5E70'}
                    />
                  </div>
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
