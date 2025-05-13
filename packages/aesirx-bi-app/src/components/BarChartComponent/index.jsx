import ComponentNoData from '../ComponentNoData';
import HeaderFilterComponent from '../HeaderFilterComponent';
import { RingLoaderComponent } from 'aesirx-uikit';
import PAGE_STATUS from '../../constants/PageStatus';
import { env } from 'aesirx-lib';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Text,
  Legend,
} from 'recharts';
import CHART_TYPE from 'constants/ChartType';
import ComponentSVG from 'components/ComponentSVG';

const BarChartComponent = ({
  data = [],
  height,
  barColors,
  chartTitle,
  bars,
  XAxisOptions,
  YAxisOptions,
  loading,
  filterData = [],
  isSelection = true,
  margin,
  layout,
  isLegend = false,
  filterButtons = [],
  tooltipComponent,
  isPagination = false,
  isPercentage = false,
  isStacked = false,
}) => {
  const { t } = useTranslation();
  const [currentSelection, setCurrentSelection] = useState(filterData[0]);
  const [currentData, setCurrentData] = useState(data[0]);
  const [view, setView] = useState(CHART_TYPE.DAY);

  const [dataPagination, setDataPagination] = useState([]);
  const [paginationPage, setPaginationPage] = useState(0);

  useEffect(() => {
    const [month, date, week] = data;

    if (view === CHART_TYPE.MONTH) {
      setCurrentData(month);
    }

    if (view === CHART_TYPE.WEEK) {
      setCurrentData(week);
    }

    if (view === CHART_TYPE.DAY) {
      setCurrentData(date);
    }

    return () => {};
  }, [view, data]);

  useEffect(() => {
    if (isPagination && data?.length) {
      const topList = data?.sort((a, b) => b.number - a.number)?.slice(0, 10);
      setDataPagination(topList);
    }
  }, [data]);

  useEffect(() => {
    setCurrentSelection(filterData[0]);
    return () => {};
  }, [filterData]);

  const CustomXAxisTick = ({ x, y, payload }) => {
    if (payload && payload.value) {
      return (
        <Text
          fontSize={'10px'}
          width={150}
          x={x}
          y={y}
          textAnchor="end"
          verticalAnchor="middle"
          maxLines={1}
          whitespace="nowrap"
        >
          {payload?.value?.replaceAll('_', ' ')}
        </Text>
      );
    }
    return null;
  };
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="ms-3 mt-2 d-flex align-items-center flex-wrap">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="me-24 fs-14 d-flex align-items-center">
            <div
              className="rounded-circle me-8px d-flex align-items-center justify-content-center"
              style={{ backgroundColor: entry?.color, width: 14, height: 14 }}
            ></div>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };

  const customizedTooltip = useMemo(
    () =>
      ({ payload }) => {
        return (
          <div
            className="areachart-tooltip p-15 text-white rounded-6"
            style={{ backgroundColor: '#132342', width: 'auto' }}
          >
            <p className="fw-semibold fs-14 mb-sm">
              {payload?.length > 0 ? payload[0].payload.name : ''}
            </p>
            {payload &&
              payload.map((item, index) => {
                return (
                  <div key={index} className="mb-0 fs-12 d-flex flex-nowrap">
                    {payload?.length > 1 && <div className="fw-bold">{item.name}: </div>}
                    <div className="ps-sm">
                      <p className="mb-0">
                        <span className="mr-2">{tooltipComponent?.value}</span>
                        <span>{item.value}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        );
      },
    [tooltipComponent]
  );
  const toPercent = (number) => `${number}%`;

  return (
    <div className="bg-white rounded-3 px-24 py-3 shadow-sm position-relative h-100">
      {loading === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
      ) : data ? (
        <>
          <HeaderFilterComponent
            currentSelection={currentSelection}
            onSelectionChange={setCurrentSelection}
            selectionData={filterData}
            chartTitle={chartTitle}
            isSelection={isSelection}
            filterButtons={filterButtons}
            view={view}
            setView={setView}
          />
          <ResponsiveContainer width="100%" height={height ?? 500}>
            <BarChart
              data={
                filterData?.length
                  ? currentData?.[currentSelection.value]
                  : isPagination
                  ? dataPagination
                  : data
              }
              layout={layout ? layout : 'vertical'}
              margin={margin}
            >
              <CartesianGrid strokeDasharray="7 7" vertical={layout ? false : true} />
              {layout ? (
                <>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={XAxisOptions?.axisLine ?? false}
                    padding={XAxisOptions?.padding}
                    style={{
                      fontSize: '14px',
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={YAxisOptions?.axisLine ?? false}
                    padding={YAxisOptions?.padding}
                    allowDecimals={false}
                    style={{
                      fontSize: '14px',
                    }}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
                    {...(isPercentage ? { tickFormatter: toPercent } : {})}
                    axisLine={XAxisOptions?.axisLine ?? false}
                    tickLine={false}
                    style={{
                      fontSize: '12px',
                    }}
                  />
                  <YAxis
                    type="category"
                    axisLine={YAxisOptions?.axisLine ?? false}
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    dataKey="name"
                    style={{
                      fontSize: '12px',
                    }}
                  />
                </>
              )}
              <Tooltip content={customizedTooltip} cursor={{ fill: 'transparent' }} />
              {bars &&
                bars.map((item, index) => {
                  return (
                    <Bar
                      barSize={layout ? 20 : 32}
                      key={index}
                      dataKey={item}
                      fill={barColors[index]}
                      {...(isStacked ? { stackId: 'a' } : {})}
                    />
                  );
                })}
              {isLegend && <Legend content={renderLegend} />}
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <ComponentNoData
            icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
            title={t('txt_no_data')}
            width="w-50"
          />
        </div>
      )}
      {isPagination ? (
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-gray-900 fs-14">
            {paginationPage === 0 ? 1 : 10 * paginationPage + 1}-
            {paginationPage === Math.floor(data?.length / 10)
              ? data?.length
              : 10 * (paginationPage + 1)}{' '}
            to {data?.length}
          </div>
          <div className="mt-2 pb-2 text-center pagination d-flex justify-content-end align-items-center">
            <button
              className={`border-0 bg-white text-body btn p-0 w-40px h-40px rounded-0 rounded-top-start rounded-bottom-start`}
              onClick={() => {
                const topListPagination = data
                  ?.sort((a, b) => b.number - a.number)
                  ?.slice((paginationPage - 1) * 10, 10 * paginationPage);
                setDataPagination(topListPagination);
                setPaginationPage(paginationPage - 1);
              }}
              disabled={paginationPage === 0}
            >
              <ComponentSVG
                url={env.PUBLIC_URL + '/assets/images/chevron_left.svg'}
                color={paginationPage === 0 ? '#5F5E70' : '#1ab394'}
              />
            </button>
            <button
              className={`border-0 bg-white text-body btn p-0 w-40px h-40px rounded-0 rounded-top-end rounded-bottom-end`}
              onClick={() => {
                const topListPagination = data
                  ?.sort((a, b) => b.number - a.number)
                  ?.slice((paginationPage + 1) * 10, 10 * (paginationPage + 2));
                setDataPagination(topListPagination);
                setPaginationPage(paginationPage + 1);
              }}
              disabled={paginationPage === Math.floor(data?.length / 10)}
            >
              <ComponentSVG
                url={env.PUBLIC_URL + '/assets/images/chevron_right.svg'}
                color={paginationPage === Math.floor(data?.length / 10) ? '#5F5E70' : '#1ab394'}
              />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default withTranslation()(BarChartComponent);
