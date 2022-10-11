import AreaChartController from 'components/AreaChartComponent/AreaChartController';
import Spinner from 'components/Spinner';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
const BarChartComponent = ({ data, height, chartTitle, bars, barColors }) => {
  console.log('data', data);
  return (
    <div className="bg-white rounded-3 p-24 shadow-sm">
      {data ? (
        <>
          <AreaChartController chartTitle={chartTitle} />
          <ResponsiveContainer width="100%" height={height ?? 500}>
            <BarChart data={data} layout={'vertical'} margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              {bars &&
                bars.map((item, index) => {
                  return <Bar barSize={32} key={index} dataKey={item} fill={barColors[index]} />;
                })}
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
export default withTranslation('common')(BarChartComponent);
