import ComponentNoData from '../ComponentNoData';
import HeaderFilterComponent from '../HeaderFilterComponent';
import { RingLoaderComponent } from 'aesirx-uikit';
import PAGE_STATUS from '../../constants/PageStatus';
import { env } from 'aesirx-lib';
import React from 'react';
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
} from 'recharts';
const BarChartComponent = (props) => {
  const { t } = useTranslation();
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
  return (
    <div className="bg-white rounded-3 px-24 py-3 shadow-sm position-relative h-100">
      {props.loading === PAGE_STATUS.LOADING ? (
        <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white" />
      ) : props.data ? (
        <>
          <HeaderFilterComponent
            chartTitle={props.chartTitle}
            viewMoreLink={props.viewMoreLink}
            isFilterButtons={props.isFilterButtons}
          />
          <ResponsiveContainer width="100%" height={props.height ?? 500}>
            <BarChart data={props.data} layout={'vertical'} margin={props.margin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                axisLine={props.XAxisOptions?.axisLine ?? false}
                tickLine={false}
                style={{
                  fontSize: '12px',
                }}
              />
              <YAxis
                type="category"
                axisLine={props.YAxisOptions?.axisLine ?? false}
                tickLine={false}
                tick={<CustomXAxisTick />}
                dataKey="name"
                style={{
                  fontSize: '12px',
                }}
              />
              <Tooltip />
              {props.bars &&
                props.bars.map((item, index) => {
                  return (
                    <Bar barSize={32} key={index} dataKey={item} fill={props.barColors[index]} />
                  );
                })}
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
