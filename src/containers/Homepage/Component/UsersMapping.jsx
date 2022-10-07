import GeoChart from 'components/GeoChart';
import React from 'react';
const UsersMapping = () => {
  const data = [
    {
      country: 'Vietnam',
      country_code: 'VN',
      views: '698',
      flag: '/assets/images/flags/flag-vietnam.png',
    },
    {
      country: 'Thailand',
      country_code: 'TH',
      views: '200',
      flag: '/assets/images/flags/flag-thailand.png',
    },
    {
      country: 'Cambodia',
      country_code: 'KH',
      views: '100',
      flag: '/assets/images/flags/flag-cambodia.png',
    },
    {
      country: 'Malaysia',
      country_code: 'MY',
      views: '235',
      flag: '/assets/images/flags/flag-malaysia.png',
    },
    {
      country: 'Myanmar',
      country_code: 'MM',
      views: '333',
      flag: '/assets/images/flags/flag-myanmar.png',
    },
    {
      country: 'Singapore',
      country_code: 'SG',
      views: '555',
      flag: '/assets/images/flags/flag-singapore.png',
    },
    {
      country: 'Philippines',
      country_code: 'PH',
      views: '123',
      flag: '/assets/images/flags/flag-philippines.png',
    },
  ];
  return (
    <div className="py-2 px-24 bg-white rounded-1 shadow-sm h-100">
      <div className="d-flex justify-content-between align-items-center py-16">
        <h2 className="mb-0 fs-4 fw-semibold">Users Mapping by Country</h2>
        <a href="#" className="fs-14 text-body">
          <span className="pe-1">View more</span>
          <span
            className="icon arrow d-inline-block align-text-bottom ms-auto bg-success"
            style={{
              WebkitMaskImage: `url(/assets/images/arrow-right.svg)`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              width: '10px',
              height: '16px',
            }}
          ></span>
        </a>
      </div>
      <div className="fs-14">
        <div className="row gx-24 align-items-center">
          <div className="col-lg-7">
            <GeoChart data={data}></GeoChart>
          </div>
          <div className="col-lg-5">
            <div className="d-flex justify-content-between align-items-center py-16 border-bottom-1">
              <div className="fs-5 fw-bold">Country</div>
              <div className="fs-5 fw-bold">Views</div>
            </div>
            {data.map((item, key) => {
              return (
                <div key={key} className="d-flex justify-content-between align-items-center py-16">
                  <div>
                    <img src={item.flag} className="pe-1"></img>
                    {item.country}
                  </div>
                  <div>{item.views}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UsersMapping;
