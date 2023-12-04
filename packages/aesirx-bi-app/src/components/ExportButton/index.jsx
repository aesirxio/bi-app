import React, { useState } from 'react';
import { Col, Dropdown, Form, Row } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import { Translation } from 'react-i18next';
import ReactToPrint from 'react-to-print';
import { downloadExcel } from 'utils';

function ExportButton({ data, tableExport, t, i18n, componentRef, classWrapper = false }) {
  const [exportFile, setExportFile] = useState({
    format: 'pdf',
    type: 'page',
  });

  const handleChange = (state) => {
    setExportFile(state);
  };
  return (
    <div className={`${classWrapper ? '' : 'printButton'} me-2`}>
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" className="text-nowrap py-13 lh-sm rounded-1">
          <Translation>{(t) => t('txt_export')}</Translation>
        </Dropdown.Toggle>

        <Dropdown.Menu className="p-3 bg-white rounded-1">
          <div className="">
            <Form.Group className="mb-3" controlId="formExport">
              <Form.Label className="fw-semibold w-100">Page Export</Form.Label>
              <Form.Check
                inline
                label="PDF"
                defaultChecked={true}
                onChange={() => {
                  handleChange({
                    format: 'pdf',
                    type: 'page',
                  });
                }}
                value="pdf"
                name="group1"
                type="radio"
                id={`inline-radio-1`}
              />
              {tableExport?.length ? (
                <Row>
                  {tableExport?.map((item, key) => {
                    return (
                      <Col sm="6" key={key}>
                        <Form.Label className="fw-semibold w-100">{item?.name}</Form.Label>
                        <Form.Check
                          inline
                          label={`CSV`}
                          onChange={() => {
                            handleChange({
                              format: 'csv',
                              type: 'table',
                              name: `${item?.name}`,
                            });
                          }}
                          value={`csv-${item?.name}`}
                          name="group1"
                          type="radio"
                          id={`inline-radio-2-${item?.name}`}
                        />
                        <Form.Check
                          inline
                          label={`XLS`}
                          onChange={() => {
                            handleChange({
                              format: 'xls',
                              type: 'table',
                              name: `${item?.name}`,
                            });
                          }}
                          value={`xls-${item?.name}`}
                          name="group1"
                          type="radio"
                          id={`inline-radio-3-${item?.name}`}
                        />
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <>
                  <Form.Label className="fw-semibold w-100">Table Export</Form.Label>
                  <Form.Check
                    inline
                    label="CSV"
                    onChange={() => {
                      handleChange({
                        format: 'csv',
                        type: 'table',
                      });
                    }}
                    value="csv"
                    name="group1"
                    type="radio"
                    id={`inline-radio-2`}
                  />
                  <Form.Check
                    inline
                    label="XLS"
                    onChange={() => {
                      handleChange({
                        format: 'xls',
                        type: 'table',
                      });
                    }}
                    value="xls"
                    name="group1"
                    type="radio"
                    id={`inline-radio-3`}
                  />
                </>
              )}
            </Form.Group>
            {exportFile.type === 'page' ? (
              <ReactToPrint
                trigger={() => {
                  return (
                    <a
                      className={`btn btn-light text-nowrap py-13 lh-sm rounded-1 ${i18n?.language}`}
                      href="#"
                    >
                      {t('txt_export')}
                    </a>
                  );
                }}
                content={() => componentRef}
              />
            ) : exportFile.format === 'csv' ? (
              <>
                {tableExport?.length ? (
                  tableExport?.find((o) => o?.name === exportFile?.name)?.data?.length ? (
                    <CSVLink
                      data={tableExport?.find((o) => o?.name === exportFile?.name)?.data}
                      className="btn btn-light text-nowrap py-13 lh-sm rounded-1"
                      filename="data.csv"
                    >
                      Export
                    </CSVLink>
                  ) : (
                    <></>
                  )
                ) : data?.length ? (
                  <CSVLink
                    data={data}
                    className="btn btn-light text-nowrap py-13 lh-sm rounded-1"
                    filename="data.csv"
                  >
                    Export
                  </CSVLink>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <>
                {tableExport?.length ? (
                  tableExport?.find((o) => o?.name === exportFile?.name)?.data?.length ? (
                    <button
                      className="btn btn-light text-nowrap py-13 lh-sm rounded-1"
                      onClick={() =>
                        downloadExcel(tableExport?.find((o) => o?.name === exportFile?.name)?.data)
                      }
                    >
                      Export
                    </button>
                  ) : (
                    <></>
                  )
                ) : data?.length ? (
                  <button
                    className="btn btn-light text-nowrap py-13 lh-sm rounded-1"
                    onClick={() => downloadExcel(data)}
                  >
                    Export
                  </button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ExportButton;
