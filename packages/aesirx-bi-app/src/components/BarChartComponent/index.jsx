import ComponentNoData from '../ComponentNoData';
import HeaderFilterComponent from '../HeaderFilterComponent';
import { RingLoaderComponent } from 'aesirx-uikit';
import PAGE_STATUS from '../../constants/PageStatus';
import { env } from 'aesirx-lib';
import React, { useEffect, useState } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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
  isFilterButtons = true,
}) => {
  const { t } = useTranslation();
  const [currentSelection, setCurrentSelection] = useState(filterData[0]);
  const [currentData, setCurrentData] = useState(data[0]);
  const [view, setView] = useState(CHART_TYPE.DAY);

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

  const CustomXAxisTick = ({ x, y, payload }) => {
    if (payload && payload.value) {
      return (
        <Text
          fontSize={'12px'}
          width={50}
          x={x}
          y={y}
          textAnchor="end"
          verticalAnchor="middle"
          maxLines="2"
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
            isFilterButtons={isFilterButtons}
            view={view}
            setView={setView}
          />
          <ResponsiveContainer width="100%" height={height ?? 500}>
            <BarChart
              data={filterData?.length ? currentData?.[currentSelection.value] : data}
              layout={layout ? layout : 'vertical'}
              margin={margin}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={layout ? false : true} />
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
                    style={{
                      fontSize: '14px',
                    }}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    type="number"
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
              <Tooltip />
              {bars &&
                bars.map((item, index) => {
                  return (
                    <Bar
                      barSize={layout ? 20 : 32}
                      key={index}
                      dataKey={item}
                      fill={barColors[index]}
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
    </div>
  );
};
export default withTranslation()(BarChartComponent);
