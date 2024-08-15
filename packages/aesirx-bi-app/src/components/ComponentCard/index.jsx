import React, { useEffect, useState } from 'react';
import './index.scss';
import { AesirXSelect, PulseLoaderComponent } from 'aesirx-uikit';

import PAGE_STATUS from '../../constants/PageStatus';
import { env } from 'aesirx-lib';
import { Tooltip } from 'react-tooltip';
import ComponentSVG from 'components/ComponentSVG';
const ComponentCard = ({
  title,
  icon,
  iconColor,
  value,
  isIncrease,
  percent,
  textPercent,
  options,
  defaultValue,
  loading,
  tooltip,
}) => {
  const [defaultFilter, setDefaultFilter] = useState(defaultValue ?? null);
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    let defaultOption = options?.find((item) => item?.value === defaultFilter?.value);
    if (defaultOption) {
      setSelectedValue(defaultOption?.actualValue);
    } else {
      setSelectedValue(value);
    }
  }, [value]);

  const handleChange = (data) => {
    setDefaultFilter(data);
    data?.actualValue && setSelectedValue(data?.actualValue);
  };
  return (
    <div className="bg-white p-24 shadow-sm rounded-3 h-100">
      <div className="d-flex justify-content-between align-items-center mb-16">
        <div className="d-flex align-items-center position-relative">
          {icon && (
            <div
              className={`icon-card rounded-circle me-16 `}
              style={{ background: hexToRGB(iconColor, 0.15) }}
            >
              <span
                className={`icon arrow d-inline-block align-text-bottom ms-auto`}
                style={{
                  WebkitMaskImage: `url(${icon})`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  backgroundColor: hexToRGB(iconColor),
                }}
              ></span>
            </div>
          )}
          <h6 className="mb-0 fw-medium text-gray-900">{title}</h6>
          {tooltip && (
            <>
              <div
                className="mx-sm fs-12 mb-1 cursor-pointer"
                data-tooltip-id="tooltipTable"
                data-tooltip-content={tooltip}
              >
                <ComponentSVG
                  url={env.PUBLIC_URL + '/assets/images/info.svg'}
                  width={'12px'}
                  height={'12px'}
                  color={'#5F5E70'}
                />
              </div>
              <Tooltip id="tooltipTable" />
            </>
          )}
        </div>
        {options && (
          <AesirXSelect
            value={defaultFilter}
            options={options}
            className={`fs-sm`}
            isBorder={true}
            onChange={handleChange}
            isSearchable={false}
          />
        )}
      </div>
      <div className="d-flex justify-content-between position-relative">
        {loading === PAGE_STATUS.LOADING && (
          <PulseLoaderComponent
            className="d-flex justify-content-start align-items-center bg-white"
            size="10px"
          />
        )}
        <h3 className="mb-0 fw-medium fs-24">{selectedValue}</h3>
        <div className="d-flex flex-wrap align-item-center">
          {percent && (
            <div className="d-flex w-100 mb-sm justify-content-end">
              <span
                className={`icon-grown arrow d-inline-block align-text-bottom ms-auto text-primary ${
                  isIncrease ? 'bg-green' : 'bg-red'
                }`}
                style={{
                  WebkitMaskImage: `url(${env.PUBLIC_URL}${
                    isIncrease ? '/assets/images/grown-up.svg' : '/assets/images/grown-down.svg'
                  })`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                }}
              ></span>
              <span className={`${isIncrease ? 'text-green' : 'text-danger'} fw-semibold`}>
                {isIncrease ? '+' : '-'}
                {percent}
              </span>
            </div>
          )}
          <div className="w-100 text-gray fs-sm text-end">{textPercent}</div>
        </div>
      </div>
    </div>
  );
};
export function hexToRGB(hex, alpha) {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

export default ComponentCard;
