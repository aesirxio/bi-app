import React, { useEffect } from 'react';
import AreaChartComponent from 'components/AreaChartComponent';
import BarChartComponent from 'components/BarChartComponent';
import DateRangePicker from 'components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import BehaviorTable from './Component/BehaviorTable';
import { useBehaviorViewModel } from './BehaviorViewModels/BehaviorViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const UTMTrackingPage = observer(() => {
  const { t } = useTranslation('common');
  const behaviorViewModel = useBehaviorViewModel().getBehaviorEventsViewModel();
  const { activeDomain } = useBiViewModel().getBiListViewModel();
  const { getVisitor, data } = behaviorViewModel;

  useEffect(() => {
    const a = async () => {
      await getVisitor({
        'filter[domain]': activeDomain,
        page_size: 0,
      });
    };
    a();
    return () => {};
  }, [activeDomain]);
  return (
    <div className="py-4 px-3 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_menu_utm_tracking')}</h2>
        </div>
        <div className="position-relative">
          <DateRangePicker viewModelArr={[behaviorViewModel]} />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          {data && (
            <AreaChartComponent
              chartTitle={t('txt_menu_overview')}
              height={390}
              data={data.toAreaChartUTM() ?? []}
              colors={['#1AB394']}
              areaColors={['#1AB394']}
              lineColors={['#1AB394']}
              lines={['number']}
              filterData={data.getFilterNameUTM()}
              tooltipComponent={{
                header: t('txt_number'),
                value: ``,
              }}
            />
          )}
        </div>
        <div className="col-lg-6 col-12">
          {data && (
            <BarChartComponent
              chartTitle={t('txt_menu_utm_tracking') + ' count'}
              height={390}
              bars={['number']}
              barColors={['#2C94EA']}
              data={data.toBarChartUTM()}
              margin={{ left: 40 }}
              isFilterButtons={true}
              filterButtons={true}
            />
          )}
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-12 ">{data && <BehaviorTable data={data.toEventTableUTM()} />}</div>
      </div>
    </div>
  );
});

export default UTMTrackingPage;
