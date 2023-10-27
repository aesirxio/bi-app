import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import BehaviorTable from '../../components/BehaviorTable';
import { useUTMTrackingViewModel } from './UTMTrackingViewModels/UTMTrackingViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';

const UTMTrackingPage = observer((props) => {
  const { t } = useTranslation();
  const {
    utmTrackingEvents: {
      getVisitor,
      data,
      statusAttribute,
      handleFilterDateRange,
      handleFilterTable,
      getAttributeDate,
      dataAttribute,
      statusTable,
    },
  } = useUTMTrackingViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();
  // TODO: list Filter events
  // const UtmFilter = useMemo(
  //   () => ({
  //     id: 'action',
  //     // className: styles.w_272,
  //     className:
  //       'border-end border-gray-select bg-select-control-background choose-an-action col-auto fs-14 minw-272px',
  //     placeholder: 'UTM Source',
  //     options: attributeData?.length
  //       ? attributeData[0]?.values.map((item) => ({
  //           label: item.value,
  //           value: item.count,
  //         }))
  //       : [],
  //   }),
  //   [attributeData]
  // );

  //Todo: Filter onChanged events
  // const handleFilter = useCallback(async (data) => {
  //   await getVisitor({
  //     'filter[domain]': activeDomain,
  //     page_size: 0,
  //     // 'filter[attribute_name]': 'utm_source',
  //     'filter[attribute_value]': data.label,
  //   });
  // }, []);

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      await getAttributeDate({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
      });
      await getVisitor({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);

  return (
    <div className="py-4 px-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">{t('txt_menu_utm_tracking')}</h2>
          <p className="mb-0">{t('txt_analytic_details')}</p>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      {/* // Todo: Filter */}
      {/* <div className="bg-white mb-4 shadow-sm rounded-1 d-flex align-items-center justify-content-between border-5 border-gray-select h-48px">
        <div className="wrapper_search_global d-flex h-100">
          <Select
            className={UtmFilter.className}
            isShadow={false}
            isClearable={false}
            isSearchable={false}
            options={UtmFilter.options}
            onChange={handleFilter}
            placeholder={attributeData?.length ? attributeData[0]?.values[0]?.value : 'Select....'}
            isBackGround={true}
            defaultValue={
              attributeData?.length
                ? {
                    label: attributeData[0]?.values[0]?.value,
                    value: attributeData[0]?.values[0]?.count,
                  }
                : ''
            }
            // value={UtmFilter.options.find(
            //   (e) => e.value === listViewModel.dataFilter['filter[type]']
            // )}
          />
        </div>
      </div> */}
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          <StackedBarChartComponent
            loading={statusAttribute}
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={dataAttribute?.toAreaChartUTM()}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={dataAttribute?.getListLineUTM()}
            filterData={dataAttribute?.getFilterNameUTM()}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'months']}
          />
        </div>
        <div className="col-lg-6 col-12">
          <BarChartComponent
            chartTitle={t('txt_menu_utm_tracking') + ' count'}
            height={390}
            bars={['number']}
            barColors={['#2C94EA']}
            data={dataAttribute?.toBarChartUTM()}
            margin={{ left: 40 }}
            filterButtons={[]}
            loading={statusAttribute}
            isSelection={false}
          />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-12 ">
          {data?.list && (
            <BehaviorTable
              data={data?.list?.toEventTableUTM(props.integration)}
              statusTable={statusTable}
              isPaginationAPI={true}
              pagination={data.pagination}
              handleFilterTable={handleFilterTable}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default UTMTrackingPage;
