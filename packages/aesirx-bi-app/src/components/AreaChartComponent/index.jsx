import ComponentNoData from '../ComponentNoData';
import HeaderFilterComponent from '../HeaderFilterComponent';
import PAGE_STATUS from '../../constants/PageStatus';
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
  BarChart,
  Bar,
  // Brush,
} from 'recharts';
import { RingLoaderComponent } from 'aesirx-uikit';
import CHART_TYPE from '../../constants/ChartType';
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
    const [month, date, week] = data;

    if (view === CHART_TYPE.MONTH) {
      setCurrentData(month);
    }

    if (view === CHART_TYPE.DAY) {
      setCurrentData(date);
    }

    if (view === CHART_TYPE.WEEK) {
      setCurrentData(week);
    }
    console.log('check data 10', data);
    return () => {};
  }, [view, data]);

  useEffect(() => {
    setCurrentSelection(filterData[0]);
    return () => {};
  }, [filterData]);

  // const customizedTooltip = useMemo(
  //   () =>
  //     ({ payload }) => {

  //       console.log("check tooltipComponent",tooltipComponent);
  //       return (
  //         <div className="areachart-tooltip p-15 text-white bg-primary">
  //           <p className="text-uppercase fw-semibold fs-14 mb-sm">{tooltipComponent.header}</p>
  //           {payload &&
  //             payload.map((item, index) => {
  //               return (
  //                 <div key={index} className="mb-0 fs-12 row">
  //                   {payload.length > 1 && <div className="col-10 fw-bold">{item.name}:</div>}
  //                   <div className="col-2">
  //                     <p className="mb-0">
  //                       <span className="mr-2">{tooltipComponent.value}</span>
  //                       <span>{item.value}</span>
  //                     </p>
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //         </div>
  //       );
  //     },
  //   [tooltipComponent]
  // );

  const customizedTooltip = useMemo(
    () =>
      ({ payload }) => {
        payload.forEach((item, index) => {
          console.log(`Payload item ${index}:`, item); // Log each item in payload
        });

        console.log('check tooltipComponent', tooltipComponent);
        return (
          <div className="areachart-tooltip p-15 text-white bg-primary">
            <p className="text-uppercase fw-semibold fs-14 mb-sm">
              {payload.length > 0 ? payload[0].payload.name : ''}
            </p>
            {payload &&
              payload.map((item, index) => {
                return (
                  <div key={index} className="mb-0 fs-12 row">
                    {payload.length > 1 && <div className="col-10 fw-bold">{item.name}:</div>}
                    <div className="col-2">
                      <p className="mb-0">
                        <span className="mr-2">{tooltipComponent.value}</span>
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

  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="ms-3 mt-2 d-flex align-items-center">
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
          <BarChart data={currentData?.[currentSelection.value]}>
            {lines && (
              <defs>
                {lines.map((item, index) => {
                  return (
                    <linearGradient
                      key={index}
                      id={`${item?.replace(/\s/g, '')}_${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={areaColors[index]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={areaColors[index]} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
            )}
            <CartesianGrid strokeDasharray="7 7" horizontal={true} vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
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
            {/* <Tooltip/> */}

            {isLegend && <Legend content={renderLegend} />}
            {lines &&
              lines.map((item, index) => {
                return (
                  <Bar
                    key={index}
                    dataKey={item}
                    stackId="a"
                    fill={areaColors[index]}
                    barSize={28}
                    maxBarSize={76}
                  />
                );
              })}
          </BarChart>
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
