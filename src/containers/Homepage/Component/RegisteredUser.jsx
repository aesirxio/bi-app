import Table from 'components/Table';
import React from 'react';
const RegisteredUser = () => {
  const columnsTable = React.useMemo(
    () => [
      {
        Header: 'NAME',
        accessor: 'name',
        className: 'px-24 py-2 fs-12 opacity-50 border-bottom-1 ',
      },
      {
        Header: 'EMAIL',
        accessor: 'email',
        className: 'px-24 py-2 fs-12 opacity-50 border-bottom-1 ',
      },
      {
        Header: 'DATE',
        accessor: 'date',
        className: 'px-24 py-2 fs-12 opacity-50 border-bottom-1 text-end',
        Cell: ({ value }) => {
          return <div className="text-end">{value}</div>;
        },
      },
      {
        Header: 'STATUS',
        accessor: 'status',
        className: 'px-24 py-2 fs-12 opacity-50 border-bottom-1 text-end',
        Cell: ({ value }) => {
          let color = value === 'Active' ? '#3EAD8A' : '#F59E0B';
          let backgroundColor = value === 'Active' ? '#D0F4E8' : '#FFEAC8';
          return (
            <div className="text-end">
              <span
                className="px-1 py-sm rounded-pill fs-12"
                style={{ backgroundColor: backgroundColor }}
              >
                <span style={{ color: color }}>{value}</span>
              </span>
            </div>
          );
        },
      },
    ],
    []
  );
  const dataTable = React.useMemo(
    () => [
      { name: 'Babila Ebwélé', email: 'babila@gmail.com', date: '2022-10-07', status: 'Active' },
      {
        name: 'Brijamohan Mallick',
        email: 'brijamohan@gmail.com',
        date: '2022-10-02',
        status: 'Active',
      },
      { name: 'Babila Ebwélé', email: 'babila@gmail.com', date: '2022-10-04', status: 'Active' },
      {
        name: 'Brijamohan Mallick',
        email: 'brijamohan@gmail.com',
        date: '2022-10-07',
        status: 'Waiting',
      },
      {
        name: 'Babila Ebwélé',
        email: 'babila@gmail.com',
        date: '2022-10-07',
        status: 'Active',
      },
      {
        name: 'Brijamohan Mallick',
        email: 'brijamohan@gmail.com',
        date: '2022-10-07',
        status: 'Active',
      },
    ],
    []
  );
  return (
    <div className="py-2 bg-white rounded-1 shadow-sm">
      <div className="d-flex justify-content-between align-items-center py-16 px-24 ">
        <h2 className="mb-0 fs-5 fw-semibold">New Registered Users</h2>
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
        <Table columns={columnsTable} data={dataTable}></Table>
      </div>
    </div>
  );
};
export default RegisteredUser;
