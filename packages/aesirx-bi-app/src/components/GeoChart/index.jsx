import { csv } from 'd3-fetch';
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { env } from 'aesirx-lib';
import { scaleLinear } from 'd3-scale';
const GeoChart = (props) => {
  const geoUrl = props.continent
    ? env.PUBLIC_URL + `/assets/data/continents/${props.continent}.json`
    : env.PUBLIC_URL + '/assets/data/continents/world.json';
  const [markers, setMarkers] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const configContinent = {
    asia: {
      center: [90, 25],
      scale: 380,
    },
    europe: {
      center: [20, 50],
      scale: 800,
    },
    africa: {
      center: [20, 0],
      scale: 400,
    },
    na: {
      center: [-80, 40],
      scale: 400,
    },
    sa: {
      center: [-50, -20],
      scale: 400,
    },
    oceania: {
      center: [150, -30],
      scale: 600,
    },
    world: {
      center: [20, 0],
      scale: 0,
    },
  };
  // const { markerSize = { dot: 8, circle: 80 } } = props;
  useEffect(() => {
    csv(env.PUBLIC_URL + '/assets/data/countries.csv').then((cities) => {
      const markerList = props.data?.map((item) => {
        return {
          country: item.country,
          views: item.views,
          country_code: item.country_code,
          coordinates: [
            cities?.find((x) => x.country === item.country_code)?.longitude,
            cities?.find((x) => x.country === item.country_code)?.latitude,
          ],
        };
      });
      setMarkers(markerList);
    });
  }, [props.data]);
  let maximumViews = markers?.length ? Math.max(...markers?.map((o) => o.views)) : 0;
  // let smallestCircle = markerSize?.dot > 5 ? 12 : 7;
  const colorScale = scaleLinear().domain([1, maximumViews]).range(['#8CAAD7', '#1D55A9']);
  return (
    <>
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={props.continent && configContinent[props.continent]}
        width={800}
        height={500}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies?.map((geo) => {
              const d = props.data?.find((s) => s?.country === geo.properties?.name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={d ? colorScale(d['views']) : '#D4DEEF'}
                  stroke="#D6D6DA"
                  onMouseEnter={() => {
                    setTooltipContent(
                      `<div>
                        <div class="fw-semibold">${geo.properties.name}</div>
                        <div>
                          <span class="text-success fw-semibold">${d?.views ?? 0}</span> visitors
                        </div>
                      </div>`
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                  data-tooltip-id="markerTooltip"
                  data-tooltip-html={tooltipContent}
                  data-tooltip-place="top"
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip id="markerTooltip" float={true} />
    </>
  );
};

export default GeoChart;
