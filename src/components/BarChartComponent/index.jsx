import ComponentNoData from 'components/ComponentNoData';
import HeaderFilterComponent from 'components/HeaderFilterComponent';
import RingLoaderComponent from 'components/Spinner/ringLoader';
import PAGE_STATUS from 'constants/PageStatus';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
const BarChartComponent = (props) => {
  const { t } = useTranslation('common');
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
            icons="/assets/images/ic_project.svg"
            title={t('txt_no_data')}
            width="w-50"
          />
        </div>
      )}
    </div>
  );
};
export default withTranslation('common')(BarChartComponent);
