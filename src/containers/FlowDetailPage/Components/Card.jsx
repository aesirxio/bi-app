import { hexToRGB } from 'components/ComponentCard';
import PulseLoaderComponent from 'components/Spinner/pulseLoader';
import PAGE_STATUS from 'constants/PageStatus';
import React from 'react';

const Card = ({ data = [], loading = PAGE_STATUS.LOADING }) => {
  return (
    <div className="row gx-24 mb-24">
      {data?.length > 0
        ? data.map((item, index) => (
            <div className={item.className} key={index}>
              <div className="bg-white p-24 shadow-sm rounded-3 h-100">
                <div className="d-flex justify-content-between position-relative align-items-center">
                  {loading === PAGE_STATUS.LOADING ? (
                    <PulseLoaderComponent
                      className="d-flex justify-content-start align-items-center bg-white"
                      size="10px"
                    />
                  ) : (
                    <>
                      <div className="overflow-hidden">
                        <p className="m-0 text-gray fs-16">{item.title}</p>
                        <h3 className="mb-0 fw-semibold fs-1 text-color">{item?.value}</h3>
                      </div>
                      <div className="d-flex flex-wrap align-item-center">
                        <div
                          className={`icon-card rounded-circle `}
                          style={{ background: hexToRGB(item.iconColor, 0.15) }}
                        >
                          <span
                            className={`icon arrow d-inline-block align-text-bottom ms-auto`}
                            style={{
                              WebkitMaskImage: `url(${item.icon})`,
                              WebkitMaskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              backgroundColor: hexToRGB(item.iconColor),
                            }}
                          ></span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default Card;
