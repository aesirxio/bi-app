import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useEventsDetailViewModel } from './EventsDetailViewModels/EventsDetailViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { history } from 'aesirx-uikit';
import queryString from 'query-string';

const Events = observer((props) => {
  const { t } = useTranslation();
  const {
    eventsDetail: { handleFilterDateRange, getEventDetail, dataEvents },
  } = useEventsDetailViewModel();
  const {
    biListViewModel: { activeDomain, dateFilter, dataFilter, integrationLink, setIntegrationLink },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);

  // useEffect(() => {
  //   const execute = async () => {
  //     getVisitor(
  //       {
  //         'filter[domain]': activeDomain,
  //         'filter_not[event_name]': 'visit',
  //       },
  //       {},
  //       { 'sort[]': 'start', 'sort_direction[]': 'desc' }
  //     );
  //     getEvents({
  //       'filter[domain]': activeDomain,
  //       'filter_not[event_name]': 'visit',
  //     });
  //   };
  //   execute();
  //   return () => {};
  // }, [activeDomain]);
  const { eventName } = useParams();
  const params = queryString.parse(props.location.search);
  const eventNameDetail = props.integration
    ? integrationLink?.split('&id=')[1]
      ? integrationLink?.split('&id=')[1]
      : params?.id
    : eventName;
  useEffect(() => {
    const execute = async () => {
      await getEventDetail({
        'filter[domain]': activeDomain,
        'filter[event_name]': eventNameDetail,
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);
  const handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      setIntegrationLink(link);
    }
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative d-flex align-items-center mb-8px">
          <div
            className={`back_icon d-flex align-items-center justify-content-center cursor-pointer me-1`}
            onClick={(e) => {
              if (props.integration) {
                handleChangeLink(e, `behavior-events`);
              } else {
                history.push(
                  `/behavior/events/?date_end=${dateFilter?.date_end}&date_start=${
                    dateFilter?.date_start
                  }&domain=${activeDomain}&pagination=${
                    dataFilter?.pagination ? dataFilter?.pagination : '1'
                  }`
                );
              }
            }}
          >
            <FontAwesomeIcon className={`text-success`} icon={faChevronLeft} />
          </div>
          <h2 className="fw-bold mb-0">{eventNameDetail}</h2>
        </div>
        <div className="position-relative">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-3 col-12">
          <div className="bg-white shadow-sm rounded-3 h-100 d-flex flex-column">
            <div className="p-32px d-flex flex-column">
              <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                <h5 className="fs-6 mb-14px text-gray-900 fw-medium" style={{ fontSize: '16px' }}>
                  {t('txt_event_count')}
                </h5>
                <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                  0
                </div>
              </div>
              <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                <h5 className="fs-6 mb-14px text-gray-900 fw-medium" style={{ fontSize: '16px' }}>
                  {t('txt_total_users')}
                </h5>
                <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                  0
                </div>
              </div>
              <div className="bg-white pb-20 rounded-3  fw-medium d-flex flex-column flex-grow-1 align-items-start justify-content-center">
                <h5 className="fs-6 mb-14px text-gray-900 fw-medium" style={{ fontSize: '16px' }}>
                  {t('txt_event_count_per_user')}
                </h5>
                <div className="fs-24 d-flex align-items-center" style={{ fontSize: '24px' }}>
                  0
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-12">
          <StackedBarChartComponent
            loading={status}
            height={390}
            data={dataEvents?.toAreaChart() ?? []}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            // areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#0066FF', '#1AB394', '#4747EB', '#96C0FF', '#D5EEFF']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={dataEvents?.getListLine()}
            filterData={dataEvents?.getFilterName()}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'weeks', 'months']}
            isSelection={false}
          />
        </div>
      </div>
    </div>
  );
});

export default Events;
