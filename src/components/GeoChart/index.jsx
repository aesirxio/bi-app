import { csv } from 'd3-fetch';
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import './index.scss';
import { env } from 'env';

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
  const { markerSize = { dot: 8, circle: 40 } } = props;
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
            geographies?.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
            ))
          }
        </Geographies>
        {markers?.map(({ country_code, views, country, coordinates }) => (
          <Marker
            key={country_code}
            coordinates={coordinates}
            onMouseEnter={() => {
              setTooltipContent(`${country}: ${views}`);
            }}
            onMouseLeave={() => {
              setTooltipContent('');
            }}
            data-tooltip-id="markerTooltip"
            data-tooltip-content={tooltipContent}
            data-tooltip-place="top"
          >
            <circle r={markerSize.dot} fill="#1AB394" />
            <circle r={markerSize.circle} fill="#1AB39433" stroke="#1AB394" strokeWidth={1} />\
          </Marker>
        ))}
      </ComposableMap>
      <Tooltip id="markerTooltip" />
    </>
  );
};

export default GeoChart;
