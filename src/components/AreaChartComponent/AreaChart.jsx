import React, { Component } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default class AreaChartComponent extends Component {
  render() {
    const { data, height, lineType, areaColors, lineColors } = this.props;
    let arrLine;
    if (arrLine) {
      arrLine = Object.keys(data[0]).map((key) => {
        return key;
      });
      arrLine.shift();
    }
    return (
      <ResponsiveContainer width="100%" height="100%" className="bg-white">
        <AreaChart width={'100%'} height={height ?? 'auto'} data={data}>
          {arrLine && (
            <defs>
              {arrLine.map((item, index) => {
                return (
                  <linearGradient key={index} id={`${item}_${index}`} x1="0" y1="0" x2="0" y2="1">
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
          {arrLine &&
            arrLine.map((item, index) => {
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
    );
  }
}
