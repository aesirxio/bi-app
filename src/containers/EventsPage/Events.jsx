import React, { useCallback, useEffect } from 'react';
import AreaChartComponent from 'components/AreaChartComponent';
import BarChartComponent from 'components/BarChartComponent';
import DateRangePicker from 'components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useEventsViewModel } from './EventsViewModels/EventsViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import BehaviorTable from 'components/BehaviorTable';

const Events = observer((props) => {
  const { t } = useTranslation();
  const {
    eventsList: { getVisitor, data, status, handleFilterDateRange },
  } = useEventsViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);

  useEffect(() => {
    const execute = async () => {
      await getVisitor({
        'filter[domain]': activeDomain,
        page_size: 5,
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);

  return (
    <div className="py-4 px-3 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_menu_events')}</h2>
          <p className="mb-0 text-color">{t('txt_analytic_details')}</p>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          <AreaChartComponent
            loading={status}
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={data?.toAreaChart() ?? []}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={data?.getListLine()}
            filterData={data?.getFilterName()}
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
            data={data?.toBarChart()}
            margin={{ left: 40 }}
            isFilterButtons={false}
          />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-12 ">
          {data && <BehaviorTable data={data.toEventTable(props.integration)} />}
        </div>
      </div>
    </div>
  );
});

export default Events;
