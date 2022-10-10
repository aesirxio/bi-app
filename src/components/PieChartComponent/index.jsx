import Spinner from 'components/Spinner';
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
const PieChartComponent = ({ data, colors, height, chartTitle, link }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const RADIAN = Math.PI / 180;

  const customizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="fw-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  const customizedLegend = ({ payload }) => {
    return (
      <ul className="piechart-legend mb-0 mt-1">
        {payload.map((entry, index) => (
          <li style={{ color: entry.color }} key={`item-${index}`}>
            <span
              onClick={() => onPieEnter(entry, index)}
              className="cursor-pointer fs-sm text-color"
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    percent,
    value,
  }) => {
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 6) * cos;
    const sy = cy + (outerRadius + 6) * sin;
    const mx = cx + (outerRadius + 12) * cos;
    const my = cy + (outerRadius + 12) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 8;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 2}
          outerRadius={outerRadius + 5}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
          className="fw-semibold"
        >{`Value: ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
          className="fs-sm"
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  return (
    <div className="p-24 bg-white rounded-3 shadow">
      {chartTitle && (
        <div className="d-flex justify-content-between mb-24">
          <h5 className="fw-semibold">{chartTitle} </h5>
          {link && (
            <Link to={link} className="text-decoration-none text-color">
              View more
              <FontAwesomeIcon
                className="text-success ms-1 align-middle"
                icon={faChevronRight}
                width={4}
                height={9}
              />
            </Link>
          )}
        </div>
      )}
      {data ? (
        <ResponsiveContainer width="100%" height={height ?? 500} className="bg-white">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={105}
              labelLine={false}
              label={customizedLabel}
              fill="#8884D8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
            >
              {data &&
                colors &&
                data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
            </Pie>
            <Legend content={customizedLegend} onClick={onPieEnter} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default PieChartComponent;
