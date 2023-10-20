import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useWoocommerceViewModel } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import TopTabs from './Component/TopTabs';

const Woocommerce = observer(() => {
  const { t } = useTranslation();
  const {
    woocommerceList: {
      getVisitor,
      getWoocommerce,
      dataWoocommerce,
      status,
      // statusTable,
      handleFilterDateRange,
      // handleFilterTable,
      getAttribute,
    },
    woocommerceList,
  } = useWoocommerceViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      getVisitor({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'analytics_woocommerce',
        'filter_not[event_name]': 'visit',
      });
      getWoocommerce({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'analytics_woocommerce',
        'filter_not[event_name]': 'visit',
      });
      Promise.all([
        getAttribute(
          {
            'filter[domain]': activeDomain,
            page_size: 5,
            'filter[attribute_name]': 'wooocommerce_product_name',
          },
          {},
          'cart'
        ),
        getAttribute(
          {
            'filter[domain]': activeDomain,
            page_size: 5,
            'filter[attribute_name]': 'wooocommerce_search',
          },
          {},
          'search'
        ),
        getAttribute(
          {
            'filter[domain]': activeDomain,
            page_size: 5,
            'filter[attribute_name]': 'product-0-name',
          },
          {},
          'checkout'
        ),
      ]);
    };
    execute();
    return () => {};
  }, [activeDomain]);
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">{t('txt_menu_woocommerce')}</h2>
          <p className="mb-0">{t('txt_analytic_details')}</p>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          <StackedBarChartComponent
            loading={status}
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={dataWoocommerce?.toAreaChart() ?? []}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={dataWoocommerce?.getListLine()}
            filterData={dataWoocommerce?.getFilterName()}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
          />
        </div>
        <div className="col-lg-6 col-12">
          <BarChartComponent
            loading={status}
            chartTitle={'Event count'}
            height={390}
            bars={['number']}
            barColors={['#2C94EA']}
            data={dataWoocommerce?.toBarChart()}
            margin={{ left: 40 }}
            filterButtons={[]}
          />
        </div>
      </div>
      {woocommerceList && <TopTabs listViewModel={woocommerceList} />}
      {/* <div className="row gx-24 mb-24">
        <div className="col-12 ">
          {data?.list && (
            <BehaviorTable
              data={data?.list?.toEventTable(props.integration)}
              pagination={data.pagination}
              handleFilterTable={handleFilterTable}
              statusTable={statusTable}
              isPaginationAPI={true}
              {...props}
            />
          )}
        </div>
      </div> */}
    </div>
  );
});

export default Woocommerce;
