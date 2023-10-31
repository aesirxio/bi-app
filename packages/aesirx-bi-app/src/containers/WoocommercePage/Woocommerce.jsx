import React, { useCallback, useEffect } from 'react';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useWoocommerceViewModel } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Col, Row } from 'react-bootstrap';
import TopTable from 'containers/VisitorsPage/Component/TopTable';
import { BI_WOOCOMMERCE_STATISTIC_FIELD_KEY, Helper } from 'aesirx-lib';

const Woocommerce = observer(() => {
  const { t } = useTranslation();
  const {
    woocommerceList: {
      statisticData,
      statisticDataChart,
      productTableTopData,
      statusStatisticChart,
      statusProduct,
      handleFilterDateRange,
      initialize,
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
      await initialize({
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
          <h2 className="fw-bold mb-8px">{t('txt_menu_woocommerce')}</h2>
          <p className="mb-0">{t('txt_analytic_details')}</p>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <Row className="mb-24">
        <Col className="w-50 w-xl-auto">
          <div className="bg-white rounded-3 p-24 h-100">
            <div className="text-gray-900 fw-medium mb-1">{t('txt_total_revenue')}</div>
            <div className="fs-4 fw-medium">
              $
              {Helper.numberWithCommas(
                statisticData?.[BI_WOOCOMMERCE_STATISTIC_FIELD_KEY?.TOTAL_REVENUE]
              )}
            </div>
          </div>
        </Col>
        {/* <Col className="w-50 w-xl-auto">
          <div className="bg-white rounded-3 p-24 h-100">
            <div className="text-gray-900 fw-medium mb-1">{t('txt_checkout_conversion_rate')}</div>
            <div className="fs-4 fw-medium">
              {Helper.numberWithCommas(
                statisticData?.[BI_WOOCOMMERCE_STATISTIC_FIELD_KEY?.CONVERSION_RATE]
              )}
              %
            </div>
          </div>
        </Col> */}
        <Col className="w-50 w-xl-auto">
          <div className="bg-white rounded-3 p-24 h-100">
            <div className="text-gray-900 fw-medium mb-1">{t('txt_avg_order_value')}</div>
            <div className="fs-4 fw-medium">
              $
              {Helper.numberWithCommas(
                statisticData?.[BI_WOOCOMMERCE_STATISTIC_FIELD_KEY?.AVG_ORDER_VALUE]
              )}
            </div>
          </div>
        </Col>
        <Col className="w-50 w-xl-auto">
          <div className="bg-white rounded-3 p-24 h-100">
            <div className="text-gray-900 fw-medium mb-1">{t('txt_total_add_to_carts')}</div>
            <div className="fs-4 fw-medium">
              {Helper.numberWithCommas(
                statisticData?.[BI_WOOCOMMERCE_STATISTIC_FIELD_KEY?.TOTAL_ADD_TO_CARTS]
              )}
            </div>
          </div>
        </Col>
        <Col className="w-50 w-xl-auto">
          <div className="bg-white rounded-3 p-24 h-100">
            <div className="text-gray-900 fw-medium mb-1">{t('txt_transactions')}</div>
            <div className="fs-4 fw-medium">
              {Helper.numberWithCommas(
                statisticData?.[BI_WOOCOMMERCE_STATISTIC_FIELD_KEY?.TRANSACTIONS]
              )}
            </div>
          </div>
        </Col>
      </Row>
      <div className="bg-white rounded-3 ChartWrapper d-flex align-items-center mb-24">
        <div className="position-relative w-100 h-100">
          <BarChartComponent
            height={500}
            data={statisticDataChart?.list}
            colors={['#1AB394']}
            layout="horizontal"
            barColors={['#0066FF', '#96C0FF']}
            bars={['total_revenue', 'total_purchasers']}
            hiddenGrid={{ vertical: false }}
            XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
            defaultValue={{ label: 'Visitors', value: 'visitors' }}
            options={[{ label: 'Visitors', value: 'visitors' }]}
            loading={statusStatisticChart}
            tooltipComponent={{
              header: t('txt_in_total'),
              value: '',
            }}
            status={statusStatisticChart}
            filterData={[{ label: 'Visitors', value: 'visitors' }]}
            isSelection={false}
            isLegend={true}
            filterButtons={['days', 'months', 'weeks']}
            chartTitle={t('txt_statistics')}
          />
        </div>
      </div>
      <Row className="my-24 pb-24">
        <Col lg={6} className="mb-24">
          <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
            <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_search')}</h4>
            <TopTable
              data={woocommerceList?.productSearchTableData?.list}
              pagination={woocommerceList?.productSearchTableData?.pagination}
              isPagination={false}
              simplePagination={true}
              limit={10}
              status={woocommerceList?.statusTopProductSearchTable}
            />
          </div>
        </Col>
        <Col lg={6} className="mb-24">
          <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
            <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_product_add_to_cart')}</h4>
            <TopTable
              data={woocommerceList?.productCartTableData?.list}
              pagination={woocommerceList?.productCartTableData?.pagination}
              isPagination={false}
              simplePagination={true}
              limit={10}
              status={woocommerceList?.statusTopProductCartTable}
            />
          </div>
        </Col>
        <Col lg={6} className="mb-24">
          <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
            <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_products')}</h4>
            <TopTable
              data={productTableTopData?.list}
              pagination={productTableTopData?.pagination}
              isPagination={false}
              simplePagination={true}
              limit={10}
              status={statusProduct}
            />
          </div>
        </Col>
        <Col lg={6} className="mb-24">
          <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
            <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_top_view')}</h4>
            <TopTable
              data={woocommerceList?.productViewTableData?.list}
              pagination={woocommerceList?.productViewTableData?.pagination}
              isPagination={false}
              simplePagination={true}
              limit={10}
              status={woocommerceList?.statusTopProductViewTable}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default Woocommerce;
