import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useEventsViewModel } from './EventsViewModels/EventsViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import BehaviorTable from '../../components/BehaviorTable';
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

const Events = observer((props) => {
  const { t } = useTranslation();
  const {
    eventsList: {
      getVisitor,
      getEvents,
      data,
      dataEvents,
      status,
      statusTable,
      sortBy,
      handleFilterDateRange,
      handleFilterTable,
    },
  } = useEventsViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();
  console.log('props', props);
  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  const params = queryString.parse(props.location.search);
  useEffect(() => {
    const execute = async () => {
      getVisitor(
        {
          'filter[domain]': activeDomain,
          'filter_not[event_name]': 'visit',
          ...(params?.pagination && { page: params?.pagination }),
        },
        {},
        { 'sort[]': 'start', 'sort_direction[]': 'desc' }
      );
      getEvents({
        'filter[domain]': activeDomain,
        'filter_not[event_name]': 'visit',
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);
  const handleSort = async (column) => {
    getVisitor(
      {
        'filter[domain]': activeDomain,
        'filter_not[event_name]': 'visit',
      },
      {},
      {
        'sort[]': column?.id,
        'sort_direction[]': sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
      }
    );
  };
  const handleSearch = async (search) => {
    getVisitor(
      {
        'filter[domain]': activeDomain,
      },
      {},
      {},
      { 'filter[url]': search }
    );
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">{t('txt_menu_events')}</h2>
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
            data={dataEvents?.toAreaChart() ?? []}
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
            // areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#0066FF', '#1AB394', '#4747EB', '#96C0FF', '#D5EEFF']}
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
            lines={dataEvents?.getListLine()}
            filterData={dataEvents?.getFilterName()}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'weeks', 'months']}
          />
        </div>
        <div className="col-lg-6 col-12">
          <BarChartComponent
            loading={status}
            chartTitle={'Event count'}
            height={390}
            bars={['number']}
            barColors={['#0066FF']}
            data={dataEvents?.toBarChart()}
            margin={{ left: 40 }}
            filterButtons={[]}
            isSelection={false}
          />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-12 ">
          {data?.list && (
            <BehaviorTable
              data={data?.list?.toEventTable(props.integration)}
              pagination={data.pagination}
              handleFilterTable={handleFilterTable}
              statusTable={statusTable}
              isPaginationAPI={true}
              handleSort={handleSort}
              sortBy={sortBy}
              handleSearch={handleSearch}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default withRouter(Events);
