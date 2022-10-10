import React from 'react';
import { Spinner } from 'react-bootstrap';
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

const AreaChartComponent = ({
  data,
  height,
  lineType,
  areaColors,
  lineColors,
  chartTitle,
  lines,
}) => {
  return (
    <div className="bg-white rounded-3 p-24 shadow">
      {data ? (
        <>
          <AreaChartController chartTitle={chartTitle} />
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              {lines &&
                lines.map((item, index) => {
                  return (
                    <Area
                      key={index}
                      type={lineType ?? 'temperature'}
                      dataKey={item}
                      stroke={lineColors[index]}
                      fillOpacity={1}
                      fill={`url(#${item}_${index})`}
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
export default AreaChartComponent;
