import ComponentNoData from 'components/ComponentNoData';
import HeaderFilterComponent from 'components/HeaderFilterComponent';
import PAGE_STATUS from 'constants/PageStatus';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  // Brush,
} from 'recharts';
import { RingLoaderComponent } from 'aesirx-uikit';
import CHART_TYPE from 'constants/ChartType';
import { env } from 'aesirx-lib';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const AreaChartComponent = ({
  data = [],
  height,
  lineType,
  areaColors,
  lineColors,
  chartTitle,
  lines,
  isDot,
  hiddenGrid,
  XAxisOptions,
  YAxisOptions,
  loading,
  tooltipComponent,
  filterData = [],
  isLegend,
  isSelection = true,
}) => {
  const [currentSelection, setCurrentSelection] = useState(filterData[0]);
  const [currentData, setCurrentData] = useState(data[0]);
  const [view, setView] = useState(CHART_TYPE.DAY);
  const { t } = useTranslation();

  useEffect(() => {
    const [month, date] = data;

    if (view === CHART_TYPE.MONTH) {
      setCurrentData(month);
    }

    if (view === CHART_TYPE.DAY) {
      setCurrentData(date);
    }

    return () => {};
  }, [view, data]);

  useEffect(() => {
    setCurrentSelection(filterData[0]);
    return () => {};
  }, [filterData]);

  const customizedTooltip = useMemo(
    () =>
      ({ payload }) => {
        return (
          <div className="areachart-tooltip p-15 text-white bg-blue-5 ">
            <p className="text-uppercase fw-semibold fs-12 mb-sm">{tooltipComponent.header}</p>
            {payload &&
              payload.map((item, index) => {
                return (
                  <p key={index} className="mb-0 fw-bold">
                    {payload.length > 1 && `${item.name}: `}
                    {tooltipComponent.value} {item.value}
                  </p>
                );
              })}
          </div>
        );
      },
    [tooltipComponent]
  );

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="ms-3 mt-2 d-flex align-items-center">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="me-24 fs-14 d-flex align-items-center">
            <div
              className="rounded-2 me-8px d-flex align-items-center justify-content-center"
              style={{ backgroundColor: entry?.color, width: 16, height: 16 }}
            >
              <FontAwesomeIcon className="text-white" icon={faCheck} style={{ fontSize: 10 }} />
            </div>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="bg-white rounded-3 p-24 shadow-sm h-100 ChartWrapper position-relative">
      <HeaderFilterComponent
        currentSelection={currentSelection}
        onSelectionChange={setCurrentSelection}
        selectionData={filterData}
        chartTitle={chartTitle}
        isSelection={isSelection}
        isFilterButtons={true}
        view={view}
        setView={setView}
      />
      {loading === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
      ) : currentSelection ? (
        <ResponsiveContainer width="100%" height={height ?? 500}>
          <AreaChart data={currentData?.[currentSelection.value]}>
            {lines && (
              <defs>
                {lines.map((item, index) => {
                  return (
                    <linearGradient key={index} id={`${item}_${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={areaColors[index]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={areaColors[index]} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
            )}
            <CartesianGrid
              strokeDasharray="7 7"
              vertical={hiddenGrid?.vertical ?? true}
              horizontal={hiddenGrid?.horizontal ?? true}
            />
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
              style={{
                fontSize: '14px',
              }}
            />
            <Tooltip content={customizedTooltip} />
            {lines &&
              lines.map((item, index) => {
                return (
                  <Area
                    key={index}
                    dot={isDot && { strokeWidth: 4 }}
                    activeDot={{ strokeWidth: 2, r: 7 }}
                    type={lineType ?? 'temperature'}
                    dataKey={item}
                    stroke={lineColors[index]}
                    fillOpacity={1}
                    fill={`url(#${item}_${index})`}
                    strokeWidth={2}
                  />
                );
              })}
            {/* <Brush startIndex={0} endIndex={11} dataKey="name" height={30} stroke="#8884d8" /> */}
            {isLegend && <Legend content={renderLegend} />}
          </AreaChart>
        </ResponsiveContainer>
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
  );
};
export default AreaChartComponent;
