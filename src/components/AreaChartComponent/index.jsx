import React from 'react';
import { Spinner } from 'react-bootstrap';
import { withTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AreaChartController from './AreaChartController';
import './index.scss';
const AreaChartComponent = ({
  data,
  height,
  lineType,
  areaColors,
  lineColors,
  chartTitle,
  lines,
  defaultValue, // Select default
  options, // Select Options
  isDot,
  hiddenGrid,
  XAxisOptions, // Line Ngang
  YAxisOptions, // Line Doc
  ...props
}) => {
  const { t } = props;
  const customizedTooltip = ({ payload }) => {
    return (
      <div className="areachart-tooltip p-15 text-white bg-blue-5 rounded-3">
        <p className="text-uppercase fw-semibold fs-12 mb-sm">{t('txt_in_total')}</p>
        {payload &&
          payload.map((item, index) => {
            return (
              <p key={index} className="mb-0 fw-bold">
                {payload.length > 1 && `${item.name}: `}$ {item.value}
              </p>
            );
          })}
      </div>
    );
  };
  return (
    <div className="bg-white rounded-3 p-24 shadow-sm">
      {data ? (
        <>
          <AreaChartController
            chartTitle={chartTitle}
            defaultValue={defaultValue}
            options={options}
          />
          <ResponsiveContainer width="100%" height={height ?? 500}>
            <AreaChart data={data}>
              {lines && (
                <defs>
                  {lines.map((item, index) => {
                    return (
                      <linearGradient
                        key={index}
                        id={`${item}_${index}`}
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
              />
              <YAxis
                tickLine={false}
                axisLine={YAxisOptions?.axisLine ?? false}
                padding={YAxisOptions?.padding}
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
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
export default withTranslation('common')(AreaChartComponent);
