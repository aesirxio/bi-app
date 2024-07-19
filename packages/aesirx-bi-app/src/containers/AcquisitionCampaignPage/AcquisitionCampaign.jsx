import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import BehaviorTable from '../../components/BehaviorTable';
import { useAcquisitionCampaignViewModel } from './AcquisitionCampaignViewModels/AcquisitionCampaignViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';

const AcquisitionCampaignPage = observer((props) => {
  const { t } = useTranslation();
  const {
    acquisitionCampaignEvents: {
      data,
      statusAttribute,
      handleFilterDateRange,
      handleFilterTable,
      getAttributeDate,
      getAttributeTable,
      getAttributeList,
      dataAttribute,
      statusTable,
      sortBy,
    },
  } = useAcquisitionCampaignViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      await getAttributeDate({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
        'filter[acquisition]': true,
      });
      await getAttributeTable({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
        'filter[acquisition]': true,
      });
      await getAttributeList({
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
        'filter[acquisition]': true,
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);
  const handleSort = async (column) => {
    await getAttributeTable(
      {
        'filter[domain]': activeDomain,
        'filter[attribute_name]': 'utm_source',
      },
      {},
      {
        'sort[]': column?.id,
        'sort_direction[]': sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
      }
    );
  };
  return (
    <div className="py-4 px-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-3 mt-3">{t('txt_campaign_overview')}</h2>
        </div>
        <div className="position-relative havePrintButton">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>

      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          <StackedBarChartComponent
            loading={statusAttribute}
            height={390}
            data={dataAttribute?.toAreaChartAcquisitionCampaign()}
            colors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            areaColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lineColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lines={dataAttribute?.getListLineAcquisitionCampaign()}
            filterData={dataAttribute?.getFilterNameAcquisitionCampaign()}
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
            chartTitle={t('txt_campaign') + ' count'}
            height={390}
            bars={['number']}
            barColors={['#2C94EA']}
            data={dataAttribute?.toBarChartAcquisitionCampaign()}
            margin={{ left: 40 }}
            filterButtons={[]}
            loading={statusAttribute}
            isSelection={false}
          />
        </div>
      </div>

      <div className="row gx-24 mb-24">
        <div className="col-12">
          {data?.list && (
            <BehaviorTable
              data={data?.list?.toEventTableAcquisitionCampaign()}
              statusTable={statusTable}
              isPaginationAPI={true}
              pagination={data.pagination}
              handleFilterTable={handleFilterTable}
              handleSort={handleSort}
              sortBy={sortBy}
              isTranslate={true}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default AcquisitionCampaignPage;
