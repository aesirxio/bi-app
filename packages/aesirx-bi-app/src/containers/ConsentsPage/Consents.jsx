import React, { useCallback, useEffect } from 'react';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useConsentsViewModel } from './ConsentsViewModels/ConsentsViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import BehaviorTable from 'components/BehaviorTable';
import ComponentNoData from 'components/ComponentNoData';
import { env } from 'aesirx-lib';
import BarChartComponent from 'components/BarChartComponent';
import { Col, Row } from 'react-bootstrap';
import PieChartComponent from 'components/PieChartComponent';
import { PAGE_STATUS } from 'aesirx-uikit';

const Consents = observer(() => {
  const { t } = useTranslation();
  const {
    consentsList: {
      initialize,
      consentsListData,
      statusConsentsList,
      handleFilterDateRange,
      handleFilterTableConsentsList,
      consentsDateData,
      statusConsentsDate,
      consentsTierData,
      statusTierChart,
      sortBy,
      getConsentsList,
    },
  } = useConsentsViewModel();
  const {
    biListViewModel: { activeDomain, integrationLink },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);
  useEffect(() => {
    const execute = async () => {
      await initialize({
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);

  const handleSort = async (column) => {
    getConsentsList(
      {
        ...activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      },
      {},
      {
        'sort[]': column?.id,
        'sort_direction[]': sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
      }
    );
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-medium mb-3 mt-3">
            {integrationLink !== 'dashboard' ? t('txt_consent_log') : t('txt_menu_consents')}
          </h2>
        </div>
        <div className="position-relative havePrintButton">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <Row className="mb-24">
        <Col lg="8">
          <div className="ChartWrapper bg-white rounded-3 d-flex align-items-center h-100">
            <div className="position-relative w-100 h-100">
              <BarChartComponent
                height={400}
                data={consentsDateData?.list}
                colors={['#1AB394']}
                layout="horizontal"
                barColors={['#0066FF']}
                bars={['Total']}
                hiddenGrid={{ vertical: false }}
                XAxisOptions={{ axisLine: true, padding: { left: 50, right: 50 } }}
                defaultValue={{ label: 'Visitors', value: 'visitors' }}
                options={[{ label: 'Visitors', value: 'visitors' }]}
                loading={statusConsentsDate}
                tooltipComponent={{
                  header: t('txt_in_total'),
                  value: '',
                }}
                status={statusConsentsDate}
                filterData={[{ label: 'Visitors', value: 'visitors' }]}
                isSelection={false}
                isLegend={true}
                filterButtons={['days', 'months', 'weeks']}
              />
            </div>
          </div>
        </Col>
        <Col lg="4">
          <div className="mb-24 ChartWrapper bg-white rounded-3 d-flex align-items-start w-100 h-100 position-relative">
            <div className="w-100">
              {consentsTierData?.length || statusTierChart === PAGE_STATUS.LOADING ? (
                <PieChartComponent
                  height={450}
                  data={consentsTierData}
                  status={statusTierChart}
                  colors={['#1A2B88', '#4855A0', '#67A4FF', '#ADCEFF', '#A3AACF']}
                  legendPosition="bottom"
                  chartTitle={t('txt_manage_track')}
                  showTotal={true}
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
        </Col>
      </Row>

      <div className="bg-white position-relative ChartWrapper rounded-3">
        {consentsListData?.list ? (
          <BehaviorTable
            data={consentsListData?.list}
            statusTable={statusConsentsList}
            isPaginationAPI={true}
            pagination={consentsListData?.pagination}
            isTranslate={true}
            handleFilterTable={handleFilterTableConsentsList}
            handleSort={handleSort}
            sortBy={sortBy}
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

export default Consents;
