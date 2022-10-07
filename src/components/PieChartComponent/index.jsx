import Spinner from 'components/Spinner';
import React, { Component } from 'react';
import { Chart } from 'react-google-charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default class PieChart extends Component {
  render() {
    let { graphID, data, colors, pieHole, legendPosition, chartArea, height, titleChart, href } =
      this.props;
    return (
      <div className="bg-white shadow-sm position-relative mb-24 rounded-3 p-24 pb-0 text-color">
        {titleChart && (
          <div className="d-flex justify-content-between">
            <h3 className="fs-5">{titleChart}</h3>
            {href && (
              <Link to={href} className="text-decoration-none fs-7 text-color">
                View detail
                <FontAwesomeIcon
                  className="text-success ms-1"
                  icon={faChevronRight}
                  width={9}
                  height={4}
                />
              </Link>
            )}
          </div>
        )}
        <div className="position-relative pieChart-wrapper">
          {data.length > 1 ? (
            <Chart
              graphID={graphID}
              width={'100%'}
              height={height ? height : 'auto'}
              chartType="PieChart"
              loader={
                <div className="mt-4">
                  <Spinner />
                </div>
              }
              data={data}
              options={{
                chartArea: chartArea,
                pieHole: pieHole,
                pieSliceText: 'percentage',
                pieSliceTextStyle: {
                  fontSize: 16,
                  bold: true,
                },
                colors: colors ?? ['#2C94EA', '#8E30FF', '#FF7723'],
                legend: {
                  position: legendPosition,
                  labeledValueText: 'value',
                  maxLines: 3,
                  textStyle: { fontSize: 14 },
                  alignment: 'start',
                  scrollArrows: {
                    inactiveColor: '#ec868c',
                    activeColor: '#a41d23',
                  },
                  pagingTextStyle: { color: '#a41d23' },
                },
              }}
              chartEvents={[
                {
                  eventName: 'select',
                  callback({ chartWrapper }) {
                    console.log('Selected ', chartWrapper);
                  },
                },
              ]}
            />
          ) : (
            <div className="py-6">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    );
  }
}
