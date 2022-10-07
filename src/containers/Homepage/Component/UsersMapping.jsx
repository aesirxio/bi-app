import React from 'react';
const UsersMapping = () => {
  return (
    <div className="py-2 bg-white rounded-1 shadow-sm">
      <div className="d-flex justify-content-between align-items-center py-16 px-24 ">
        <h2 className="mb-0 fs-5 fw-semibold">Users Mapping by Country</h2>
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
      <div className="fs-14"></div>
    </div>
  );
};
export default UsersMapping;
