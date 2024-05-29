import React, { useCallback, useEffect } from 'react';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useWoocommerceViewModel } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { env } from 'aesirx-lib';
import BehaviorTable from 'components/BehaviorTable';
import ComponentNoData from 'components/ComponentNoData';

const WoocommerceProduct = observer(() => {
  const { t } = useTranslation();
  const {
    woocommerceList: {
      productData,
      productDataChart,
      statusProduct,
      statusProductChart,
      handleFilterDateRange,
      initializeProduct,
      handleFilterTableWoocommerceProduct,
    },
  } = useWoocommerceViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      await initializeProduct({
        'filter[domain]': activeDomain,
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-3 mt-3">{t('txt_menu_products')}</h2>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <div className="mb-24 ChartWrapper bg-white rounded-3 d-flex align-items-center">
        <div className="position-relative w-100 h-100">
          <BarChartComponent
            height={500}
            data={productDataChart?.list}
            colors={['#1AB394']}
            layout="horizontal"
            barColors={['#0066FF']}
            bars={['Products']}
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Visitors', value: 'visitors' }}
            options={[{ label: 'Visitors', value: 'visitors' }]}
            loading={statusProductChart}
            tooltipComponent={{
              header: t('txt_in_total'),
              value: '',
            }}
            status={statusProductChart}
            filterData={[{ label: 'Visitors', value: 'visitors' }]}
            isSelection={false}
            isLegend={true}
            filterButtons={['days', 'months', 'weeks']}
          />
        </div>
      </div>
      <div className="bg-white position-relative ChartWrapper rounded-3">
        {productData?.list ? (
          <BehaviorTable
            data={productData?.list}
            statusTable={statusProduct}
            isPaginationAPI={true}
            pagination={productData?.pagination}
            isTranslate={true}
            handleFilterTable={handleFilterTableWoocommerceProduct}
          />
        ) : (
          <div className="position-absolute top-50 start-50 translate-middle">
            <ComponentNoData
              icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
              title={t('txt_no_data')}
              width="w-50"
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default WoocommerceProduct;
