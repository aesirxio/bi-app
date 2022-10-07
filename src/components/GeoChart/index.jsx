import { csv } from 'd3-fetch';
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GeoChart = (props) => {
  const geoUrl = '/assets/data/continents/world-continents.json';
  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    csv('/assets/data/countries.csv').then((cities) => {
      const markerList = props.data.map((item) => {
        return {
          country_code: item.country_code,
          coordinates: [
            cities?.find((x) => x.country === item.country_code)?.longitude,
            cities?.find((x) => x.country === item.country_code)?.latitude,
          ],
        };
      });
      setMarkers(markerList);
    });
  }, []);

  return (
    <>
      <ComposableMap projection="geoEqualEarth">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
            ))
          }
        </Geographies>
        {markers.map(({ country_code, coordinates }) => (
          <Marker key={country_code} coordinates={coordinates}>
            <g
              fill="none"
              stroke="#FF5533"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-12, -24)"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </g>
            <text textAnchor="middle" style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}>
              {/* {name} */}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </>
  );
};

export default GeoChart;
