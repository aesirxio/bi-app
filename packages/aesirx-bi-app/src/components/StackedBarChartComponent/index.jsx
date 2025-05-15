import ComponentNoData from '../ComponentNoData';
import HeaderFilterComponent from '../HeaderFilterComponent';
import PAGE_STATUS from '../../constants/PageStatus';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import {
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
import { Tooltip as TooltipReact } from 'react-tooltip';
import ReactDOMServer from 'react-dom/server';
import { Col, Row } from 'react-bootstrap';
const getRandomColor = (areaColors) => {
  return areaColors[Math.floor(Math.random() * areaColors.length)];
};
const defaultAreaColors = [
  '#0066FF',
  '#1AB394',
  '#4747EB',
  '#96C0FF',
  '#D5EEFF',
  '#2196F3',
  '#F44336',
  '#FF9800',
  '#00BCD4',
  '#009688',
  '#9C27B0',
  '#E91E63',
  '#673AB7',
];
const StackedBarChartComponent = ({
  data = [],
  height,
  areaColors,
  chartTitle,
  lines,
  XAxisOptions,
  YAxisOptions,
  loading,
  tooltipComponent,
  filterData = [],
  isLegend,
  isSelection = true,
  filterButtons,
  chartTitleClass,
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
    return () => {};
  }, [view, data]);

  useEffect(() => {
    setCurrentSelection(filterData[0]);
    return () => {};
  }, [filterData]);

  const customizedTooltip = useMemo(
    () =>
      ({ payload }) => {
        const topList = payload?.slice(0, 10);
        return (
          <div
            className="areachart-tooltip p-15 text-white rounded-6"
            style={{ backgroundColor: '#132342' }}
          >
            {/* <p className="fw-semibold fs-14 mb-sm">
              {payload?.length > 0 ? payload[0].payload.name : ''}
            </p> */}
            {topList &&
              topList.map((item, index) => {
                return (
                  <div key={index} className="mb-0 fs-12 d-flex flex-nowrap">
                    {topList?.length > 1 && <div className=" fw-bold">{item.name}:</div>}
                    <div className="ps-sm">
                      <p className="mb-0">
                        <span className="mr-2">{tooltipComponent?.value}</span>
                        <span>{item.value}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            {payload?.length > 10 ? <>...</> : <></>}
          </div>
        );
      },
    [tooltipComponent]
  );

  const renderLegend = (props) => {
    const { payload } = props;
    const columns = payload?.length === 6 ? 12 : payload?.length === 7 ? 6 : 4;
    return (
      <>
        <ul className="ms-3 mt-2 mb-1 d-flex align-items-center flex-wrap" key={1}>
          {payload?.map((entry, index) => {
            if (index <= 4)
              return (
                <li key={`item-${index}`} className="me-24 fs-14 d-flex align-items-center">
                  <div
                    className="rounded-circle me-8px d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: entry?.color ?? '#000', width: 14, height: 14 }}
                  ></div>
                  {entry.value}
                </li>
              );
          })}
        </ul>
        {payload?.length > 5 ? (
          <>
            <div
              className="ms-5 fs-4 lh-1 mb-1 cursor-pointer"
              data-tooltip-id="tooltipChart"
              data-tooltip-place="bottom"
              data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                <>
                  <Row>
                    {payload?.map((entry, index) => {
                      if (index > 4)
                        return (
                          <Col
                            lg={columns}
                            key={`item-${index}`}
                            className="fs-14 d-flex align-items-center"
                          >
                            <div
                              className="rounded-circle me-8px d-flex align-items-center justify-content-center"
                              style={{
                                backgroundColor: entry?.color ?? '#000',
                                width: 14,
                                height: 14,
                              }}
                            ></div>
                            <div className="text-start">{entry.value}</div>
                          </Col>
                        );
                    })}
                  </Row>
                </>
              )}
            >
              ...
            </div>
            <TooltipReact id="tooltipChart" />
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  return (
    <div
      className="bg-white rounded-3 p-24 shadow-sm h-100 ChartWrapper position-relative"
      style={{ minHeight: 390 }}
    >
      <HeaderFilterComponent
        currentSelection={currentSelection}
        onSelectionChange={setCurrentSelection}
        selectionData={filterData}
        chartTitle={chartTitle}
        chartTitleClass={chartTitleClass}
        isSelection={isSelection}
        filterButtons={filterButtons}
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
                  const colorRandom = getRandomColor(defaultAreaColors);
                  return (
                    <linearGradient
                      key={index}
                      id={`${item?.replace(/\s/g, '')}_${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={areaColors[index] ? areaColors[index] : colorRandom}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={areaColors[index] ? areaColors[index] : colorRandom}
                        stopOpacity={0}
                      />
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

            {isLegend && <Legend content={renderLegend} />}
            {lines &&
              lines.map((item, index) => {
                const colorRandom = getRandomColor(defaultAreaColors);
                return (
                  <Bar
                    key={index}
                    dataKey={item}
                    stackId="a"
                    fill={areaColors[index] ? areaColors[index] : colorRandom}
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
export default StackedBarChartComponent;
