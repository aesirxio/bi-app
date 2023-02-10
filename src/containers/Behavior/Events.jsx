import React, { useEffect } from 'react';
import AreaChartComponent from 'components/AreaChartComponent';
import BarChartComponent from 'components/BarChartComponent';
import DateRangePicker from 'components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import BehaviorTable from './Component/BehaviorTable';
import { useBehaviorViewModel } from './BehaviorViewModels/BehaviorViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const Events = observer(() => {
  const { t } = useTranslation('common');
  const { getVisitor, data } = useBehaviorViewModel().getBehaviorEventsViewModel();
  // const dataAreaChart = [
  //   {
  //     name: 'Jan',
  //     line1: 0,
  //   },
  //   {
  //     name: 'Feb',
  //     line1: 0,
  //   },
  //   {
  //     name: 'Mar',
  //     line1: 0,
  //   },
  //   {
  //     name: 'Apr',
  //     line1: 395,
  //   },
  //   {
  //     name: 'May',
  //     line1: 380,
  //   },
  //   {
  //     name: 'Jun',
  //     line1: 204,
  //   },
  //   {
  //     name: 'Jul',
  //     line1: 420,
  //   },
  //   {
  //     name: 'Aug',
  //     line1: 680,
  //   },
  //   {
  //     name: 'Sep',
  //     line1: 670,
  //   },
  //   {
  //     name: 'Oct',
  //     line1: 568,
  //   },
  //   {
  //     name: 'Nov',
  //     line1: 940,
  //   },
  //   {
  //     name: 'Dec',
  //     line1: 360,
  //   },
  // ];
  const { activeDomain } = useBiViewModel().getBiListViewModel();
  useEffect(() => {
    const a = async () => {
      await getVisitor({
        'filter[domain]': activeDomain,
      });
    };
    a();
    return () => {};
  }, []);
  return (
    <div className="py-4 px-3 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_behavior')}</h2>
        </div>
        <div className="position-relative">
          <DateRangePicker />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          {data && (
            <AreaChartComponent
              chartTitle={t('txt_menu_overview')}
              height={390}
              data={data.toAreaChart() ?? []}
              colors={['#1AB394']}
              areaColors={['#1AB394']}
              lineColors={['#1AB394']}
              lines={['number']}
              filterData={data.getFilterName()}
              tooltipComponent={{
                header: t('txt_number'),
                value: `txt_count`,
              }}
            />
          )}
        </div>
        <div className="col-lg-6 col-12">
          {data && (
            <BarChartComponent
              chartTitle={'Event count'}
              height={390}
              bars={['number']}
              barColors={['#2C94EA']}
              data={data.toBarChart()}
              margin={{ left: 40 }}
              isFilterButtons={true}
              filterButtons={true}
            />
          )}
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-12 ">{data && <BehaviorTable data={data.toEventTable()} />}</div>
      </div>
    </div>
  );
});

export default Events;
