import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Button } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import { observer } from 'mobx-react';

const Generator = observer(() => {
  const [, forceUpdate] = useState();
  const [generateUrl, setGenerateUrl] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    eventName: '',
    eventType: '',
    buttonName: '',
    attributeNameA: '',
    attributeValueA: '',
    attributeNameB: '',
    attributeValueB: '',
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const simpleValidator = useRef(new SimpleReactValidator());

  const submitForm = () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate(1);
    } else {
      setGenerateUrl(`<button
                          class="button"
                          data-aesirx-event-name="${values.eventName}"
                          data-aesirx-event-type="${values.eventType}"
                          ${
                            values.attributeNameA &&
                            values.attributeValueA &&
                            'data-aesirx-event-attribute-' +
                              values.attributeNameA +
                              '="' +
                              values.attributeValueA +
                              '"'
                          }
                          ${
                            values.attributeNameB &&
                            values.attributeValueB &&
                            'data-aesirx-event-attribute-' +
                              values.attributeNameB +
                              '="' +
                              values.attributeValueB +
                              '"'
                          }
                          
                      >${values.buttonName}</button>`);
      setSubmitted(true);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="py-4 px-3 h-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="text-blue-0 fw-bold mb-8px">{t('txt_events_generator')}</h2>
        </div>
        <div className="position-relative"></div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-lg-6 mx-auto bg-white p-24 shadow-sm rounded-3">
          <Form>
            <Form.Group className="mb-3" controlId="formEventName">
              <Form.Label className="fw-semibold">
                Event Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="input"
                placeholder="Event Name"
                name="eventName"
                defaultValue={values.eventName}
                onChange={handleChange('eventName')}
              />
              <p className="fs-sm ps-1 fst-italic">example: signin</p>
              {simpleValidator.current?.message('eventName', values.eventName, 'required', {
                className: 'text-danger',
              })}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEventType">
              <Form.Label className="fw-semibold">
                Event Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="input"
                placeholder="Event Type"
                name="eventType"
                defaultValue={values.eventType}
                onChange={handleChange('eventType')}
              />
              <p className="fs-sm ps-1 fst-italic">example: login</p>
              {simpleValidator.current?.message('eventType', values.eventType, 'required', {
                className: 'text-danger',
              })}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formButtonName">
              <Form.Label className="fw-semibold">Button Name</Form.Label>
              <Form.Control
                as="input"
                placeholder="Button Name"
                name="buttonName"
                defaultValue={values.buttonName}
                onChange={handleChange('buttonName')}
              />
              <p className="fs-sm ps-1 fst-italic">example: Sign In</p>
            </Form.Group>
            <Row>
              <Col lg="6">
                <Form.Group className="mb-3" controlId="formAttributeNameA">
                  <Form.Label className="fw-semibold">Attribute Name A</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Attribute Name"
                    name="attributeNameA"
                    defaultValue={values.attributeNameA}
                    onChange={handleChange('attributeNameA')}
                  />
                  <p className="fs-sm ps-1 fst-italic">example: a</p>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3" controlId="formAttributeValueA">
                  <Form.Label className="fw-semibold">Attribute Value A</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Attribute Value"
                    name="attributeValueA"
                    defaultValue={values.attributeValueA}
                    onChange={handleChange('attributeValueA')}
                  />
                  <p className="fs-sm ps-1 fst-italic">example: value-a</p>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg="6">
                <Form.Group className="mb-3" controlId="formAttributeNameB">
                  <Form.Label className="fw-semibold">Attribute Name B</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Attribute Name"
                    name="attributeNameB"
                    defaultValue={values.attributeNameB}
                    onChange={handleChange('attributeNameB')}
                  />
                  <p className="fs-sm ps-1 fst-italic">example: b</p>
                </Form.Group>
              </Col>
              <Col lg="6">
                <Form.Group className="mb-3" controlId="formAttributeValueB">
                  <Form.Label className="fw-semibold">Attribute Value B</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="Attribute Value"
                    name="attributeValueB"
                    defaultValue={values.attributeValueB}
                    onChange={handleChange('attributeValueB')}
                  />
                  <p className="fs-sm ps-1 fst-italic">example: value-b</p>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={submitForm} className="py-2 px-3">
              Generate Button
            </Button>
          </Form>
          {submitted && (
            <div className="mt-4 p-4 bg-white border rounded-2 text-center">
              <h3>Generated Event Button</h3>
              <div className="bg-dark text-white p-24">{generateUrl}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Generator;
