import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useWoocommerceViewModel } from './WoocommerceViewModels/WoocommerceViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import TopTabs from './Component/TopTabs';
import { Col, Row } from 'react-bootstrap';
import TopTable from 'containers/AudiencePage/Component/TopTable';

const Woocommerce = observer(() => {
  const { t } = useTranslation();
  const {
    woocommerceList: { dataWoocommerce, status, handleFilterDateRange, initialize },
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
      <Row className="my-24 pb-24">
        <Col lg={4} className="mb-24">
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
        <Col lg={4} className="mb-24">
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
        <Col lg={4} className="mb-24">
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
      </Row>
    </div>
  );
});

export default Woocommerce;
