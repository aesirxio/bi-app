import React, { useCallback, useEffect } from 'react';
import StackedBarChartComponent from '../../components/StackedBarChartComponent';
import BarChartComponent from '../../components/BarChartComponent';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import BehaviorTable from '../../components/BehaviorTable';
import { useUTMTrackingViewModel } from './UTMTrackingViewModels/UTMTrackingViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { AesirXSelect } from 'aesirx-uikit';
import { Col, Row } from 'react-bootstrap';

const UTMTrackingPage = observer((props) => {
  const { t } = useTranslation();
  const {
    utmTrackingEvents: {
      getVisitor,
      data,
      statusAttribute,
      handleFilterDateRange,
      handleFilterTable,
      getAttributeDate,
      getAttributeList,
      dataAttribute,
      dataAttributeList,
      statusTable,
      sortBy,
    },
  } = useUTMTrackingViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();
  // TODO: list Filter events
  // const UtmFilter = useMemo(
  //   () => ({
  //     id: 'action',
  //     // className: styles.w_272,
  //     className:
  //       'border-end border-gray-select bg-select-control-background choose-an-action col-auto fs-14 minw-272px',
  //     placeholder: 'UTM Source',
  //     options: attributeData?.length
  //       ? attributeData[0]?.values.map((item) => ({
  //           label: item.value,
  //           value: item.count,
  //         }))
  //       : [],
  //   }),
  //   [attributeData]
  // );

  //Todo: Filter onChanged events
  // const handleFilter = useCallback(async (data) => {
  //   await getVisitor({
  //     'filter[domain]': activeDomain,
  //     page_size: 0,
  //     // 'filter[attribute_name]': 'utm_source',
  //     'filter[attribute_value]': data.label,
  //   });
  // }, []);

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      await getAttributeDate({
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        'filter[attribute_name]': 'utm_source',
      });
      await getVisitor({
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        'filter[attribute_name]': 'utm_source',
      });
      await getAttributeList({
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        'filter[attribute_name]': 'utm_source',
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);
  const onSelectionChange = async (data) => {
    await getVisitor({
      ...activeDomain
        ?.map((value, index) => ({
          [`filter[domain][${index + 1}]`]: value,
        }))
        ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      'filter[attribute_name]': 'utm_source',
      'filter[attribute_value]': data?.value,
    });
  };
  const handleSort = async (column) => {
    await getVisitor(
      {
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
          <h2 className="fw-medium mb-3 mt-3">{t('txt_menu_utm_tracking')}</h2>
        </div>
        <div className="position-relative havePrintButton">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      {/* // Todo: Filter */}
      {/* <div className="bg-white mb-4 shadow-sm rounded-1 d-flex align-items-center justify-content-between border-5 border-gray-select h-48px">
        <div className="wrapper_search_global d-flex h-100">
          <Select
            className={UtmFilter.className}
            isShadow={false}
            isClearable={false}
            isSearchable={false}
            options={UtmFilter.options}
            onChange={handleFilter}
            placeholder={attributeData?.length ? attributeData[0]?.values[0]?.value : 'Select....'}
            isBackGround={true}
            defaultValue={
              attributeData?.length
                ? {
                    label: attributeData[0]?.values[0]?.value,
                    value: attributeData[0]?.values[0]?.count,
                  }
                : ''
            }
            // value={UtmFilter.options.find(
            //   (e) => e.value === listViewModel.dataFilter['filter[type]']
            // )}
          />
        </div>
      </div> */}
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 col-12">
          <StackedBarChartComponent
            loading={statusAttribute}
            chartTitle={t('txt_menu_overview')}
            height={390}
            data={dataAttribute?.toAreaChartUTM()}
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
            lines={dataAttribute?.getListLineUTM()}
            filterData={dataAttribute?.getFilterNameUTM()}
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
            chartTitle={t('txt_menu_utm_tracking') + ' count'}
            height={390}
            bars={['number']}
            barColors={['#2C94EA']}
            data={dataAttribute?.toBarChartUTM()}
            margin={{ left: 40 }}
            filterButtons={[]}
            loading={statusAttribute}
            isSelection={false}
          />
        </div>
      </div>
      {dataAttributeList?.toAttributeList()?.length && (
        <Row className="mb-2">
          <Col lg="2">
            <AesirXSelect
              defaultValue={{ label: 'All Campaign', value: 'all' }}
              options={dataAttributeList?.toAttributeList()}
              className={`fs-sm`}
              isBorder={true}
              onChange={(data) => {
                onSelectionChange(data);
              }}
              plColor={'#808495'}
              isSearchable={false}
            />
          </Col>
        </Row>
      )}
      <div className="row gx-24 mb-24">
        <div className="col-12">
          {data?.list && (
            <BehaviorTable
              data={data?.list?.toEventTableUTM(props.integration)}
              statusTable={statusTable}
              isPaginationAPI={true}
              pagination={data.pagination}
              handleFilterTable={handleFilterTable}
              handleSort={handleSort}
              sortBy={sortBy}
              {...props}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default UTMTrackingPage;
