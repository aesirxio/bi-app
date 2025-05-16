import React, { useCallback, useEffect } from 'react';
import DateRangePicker from '../../components/DateRangePicker';
import { useTranslation } from 'react-i18next';
import { useConsentsAdvanceViewModel } from './ConsentsAdvanceViewModels/ConsentsAdvanceViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import BehaviorTable from 'components/BehaviorTable';
import ComponentNoData from 'components/ComponentNoData';
import { env } from 'aesirx-lib';
import BarChartComponent from 'components/BarChartComponent';
import { Col, Row, Spinner } from 'react-bootstrap';
import PieChartComponent from 'components/PieChartComponent';
import { PAGE_STATUS } from 'aesirx-uikit';
import StackedBarChartComponent from 'components/StackedBarChartComponent';

const ConsentsAdvance = observer(() => {
  const { t } = useTranslation();
  const {
    consentsList: {
      initialize,
      handleFilterDateRange,
      consentsTierData,
      statusTierChart,
      consentsCategoryData,
      consentsCategoryByDateData,
      statusConsentsCategory,
      statusConsentsCategoryByDate,
      consentsListData,
      handleFilterTableConsentsList,
      statusConsentsList,
      sortBy,
      consentsOverrideLanguageData,
      statusConsentsOverrideLanguage,
      getConsentsRegion,
    },
  } = useConsentsAdvanceViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
  }, []);

  const handleSort = async (column) => {
    getConsentsRegion(
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
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-medium mb-3 mt-3">{t('txt_menu_consents_analytics')}</h2>
        </div>
        <div className="position-relative havePrintButton">
          <DateRangePicker onChange={handleDateRangeChange} />
        </div>
      </div>
      <Row className="mb-24">
        <Col lg="6">
          <div className="mb-24 ChartWrapper bg-white rounded-3 d-flex align-items-start w-100 h-100 position-relative shadow-sm">
            <div className="w-100">
              {consentsTierData?.length || statusTierChart === PAGE_STATUS.LOADING ? (
                <PieChartComponent
                  height={450}
                  data={consentsTierData}
                  status={statusTierChart}
                  colors={['#1A2B88', '#4855A0', '#67A4FF', '#ADCEFF', '#A3AACF']}
                  legendPosition="bottom"
                  chartTitle={t('txt_consent_behavior_metrics')}
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
        <Col lg="6">
          <BarChartComponent
            chartTitle={t('txt_consent_status_per_category')}
            height={390}
            bars={['accepted', 'rejected']}
            barColors={['#2C94EA', '#EA2C4D']}
            data={consentsCategoryData?.toBarChart()}
            margin={{ left: 40 }}
            filterButtons={[]}
            loading={statusConsentsCategory}
            isSelection={false}
            isPercentage={true}
            isStacked={true}
            isLegend={true}
          />
        </Col>
      </Row>
      <Row className="mb-24">
        <Col lg="6">
          <StackedBarChartComponent
            loading={statusConsentsCategoryByDate}
            chartTitleClass={'fs-6'}
            chartTitle={
              <span style={{ color: '#2C94EA' }}>{t('txt_accepted_consent_per_category')}</span>
            }
            height={390}
            data={consentsCategoryByDateData?.toAreaChart()}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={consentsCategoryByDateData?.getListLine()}
            filterData={consentsCategoryByDateData?.getFilterName()}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'months']}
          />
        </Col>
        <Col lg="6">
          <StackedBarChartComponent
            loading={statusConsentsCategoryByDate}
            chartTitle={
              <span style={{ color: '#EA2C4D' }}>{t('txt_rejected_consent_per_category')}</span>
            }
            chartTitleClass={'fs-6'}
            height={390}
            data={consentsCategoryByDateData?.toAreaChart(false)}
            colors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            areaColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lineColors={['#1AB394', '#9747FF', '#479CFF', '#024E6D']}
            lines={consentsCategoryByDateData?.getListLine(false)}
            filterData={consentsCategoryByDateData?.getFilterName(false)}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'months']}
          />
        </Col>
      </Row>
      <Row className="mb-24">
        <Col lg="8">
          <div className="bg-white position-relative ChartWrapper rounded-3 shadow-sm">
            <h4 className="mb-0 p-24">{t('txt_region_based_consent_report')}</h4>
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
        </Col>
        <Col lg="4">
          <div className="bg-white position-relative ChartWrapper rounded-3 shadow-sm h-100">
            <h4 className="mb-0 p-24">{t('txt_user_override_report')}</h4>
            <div className="bg-white fs-14 rounded-3 position-relative text-gray-900 px-24">
              <table className="w-100 mb-0">
                <tr>
                  <th className="py-16 fs-sm border-bottom border-gray-800 align-middle pe-3 rounded-top-start-3 text-gray-900 fw-medium">
                    {t('txt_override_action')}
                  </th>
                  <th className="py-16 fs-sm border-bottom border-gray-800 align-middle pe-3 rounded-top-start-3 text-gray-900 fw-medium">
                    {t('txt_users_percentage')}
                  </th>
                </tr>
                <tr>
                  <td className="py-2">{t('txt_manually_changed_region')}</td>
                  <td className="py-2">
                    {statusConsentsOverrideLanguage === PAGE_STATUS.LOADING ? (
                      <Spinner size="sm" variant="success" />
                    ) : (
                      <>
                        {consentsOverrideLanguageData?.data?.user_override
                          ? Math.round(
                              (consentsOverrideLanguageData?.data?.user_override /
                                consentsOverrideLanguageData?.data?.total_consent) *
                                100
                            )
                          : 0}
                        %
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">{t('txt_accepted_default')}</td>
                  <td className="py-2">
                    {statusConsentsOverrideLanguage === PAGE_STATUS.LOADING ? (
                      <Spinner size="sm" variant="success" />
                    ) : (
                      <>
                        {consentsOverrideLanguageData?.data?.not_override
                          ? Math.round(
                              (consentsOverrideLanguageData?.data?.not_override /
                                consentsOverrideLanguageData?.data?.total_consent) *
                                100
                            )
                          : 0}
                        %
                      </>
                    )}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

export default ConsentsAdvance;
