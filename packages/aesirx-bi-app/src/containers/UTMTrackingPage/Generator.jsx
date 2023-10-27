import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Button } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { observer } from 'mobx-react';

const Generator = observer(() => {
  const { biListViewModel } = useBiViewModel();
  const url = 'https://' + biListViewModel?.activeDomain;

  const [, forceUpdate] = useState();
  const [generateUrl, setGenerateUrl] = useState();
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({
    websiteURL: url,
    campaignID: '',
    campaignSource: '',
    campaignMedium: '',
    campaignName: '',
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
      const params = new URLSearchParams({
        utm_source: values.campaignSource,
        utm_medium: values.campaignMedium,
        utm_campaign: values.campaignName,
        utm_id: values.campaignID,
        ...(values.campaignTerm && { utm_term: values.campaignTerm }),
        ...(values.campaignContent && { utm_content: values.campaignContent }),
      });
      setGenerateUrl(values?.websiteURL + '?' + params.toString());
      setSubmitted(true);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="py-4 px-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">{t('txt_utm_tracking_generator')}</h2>
        </div>
        <div className="position-relative"></div>
      </div>
      <div className="row gx-24 mb-24">
        <div className="col-8 mx-auto bg-white p-24 shadow-sm rounded-3">
          <Form>
            <Row>
              <Col sm="6">
                <Form.Group className="mb-3" controlId="formURL">
                  <Form.Label className="fw-semibold">
                    Website URL <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="input"
                    placeholder="website URL"
                    name="websiteURL"
                    defaultValue={values.websiteURL}
                    onChange={handleChange('websiteURL')}
                  />
                  <p className="fs-sm ps-1 fst-italic">The full website URL</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCampaignID">
                  <Form.Label className="fw-semibold">
                    Campaign ID <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign ID"
                    name="campaignID"
                    defaultValue={values.campaignID}
                    onChange={handleChange('campaignID')}
                  />
                  <p className="fs-sm ps-1 fst-italic">The ads campaign id.</p>
                  {simpleValidator.current?.message('campaignID', values.campaignID, 'required', {
                    className: 'text-danger',
                  })}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCampaignSource">
                  <Form.Label className="fw-semibold">
                    Campaign source <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign source"
                    name="campaignSource"
                    defaultValue={values.campaignSource}
                    onChange={handleChange('campaignSource')}
                  />
                  <p className="fs-sm ps-1 fst-italic">The referrer (e.g. google, newsletter)</p>
                  {simpleValidator.current?.message(
                    'campaignSource',
                    values.campaignSource,
                    'required',
                    {
                      className: 'text-danger',
                    }
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCampaignMedium">
                  <Form.Label className="fw-semibold">
                    Campaign medium <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign medium"
                    name="campaignMedium"
                    defaultValue={values.campaignMedium}
                    onChange={handleChange('campaignMedium')}
                  />
                  <p className="fs-sm ps-1 fst-italic">
                    Marketing medium (e.g. cpc, banner, email)
                  </p>
                  {simpleValidator.current?.message(
                    'campaignMedium',
                    values.campaignMedium,
                    'required',
                    {
                      className: 'text-danger',
                    }
                  )}
                </Form.Group>
              </Col>
              <Col sm="6">
                <Form.Group className="mb-3" controlId="formCampaignName">
                  <Form.Label className="fw-semibold">
                    Campaign name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign name"
                    name="campaignName"
                    defaultValue={values.campaignName}
                    onChange={handleChange('campaignName')}
                  />
                  <p className="fs-sm ps-1 fst-italic">
                    Product, promo code, or slogan (e.g. spring_sale) One of campaign name or
                    campaign id are required.
                  </p>
                  {simpleValidator.current?.message(
                    'campaignName',
                    values.campaignName,
                    'required',
                    {
                      className: 'text-danger',
                    }
                  )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formcampaignContent">
                  <Form.Label className="fw-semibold">Campaign term</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign term"
                    name="campaignTerm"
                    defaultValue={values.campaignTerm}
                    onChange={handleChange('campaignTerm')}
                  />
                  <p className="fs-sm ps-1 fst-italic">Identify the paid keywords</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCampaignContent">
                  <Form.Label className="fw-semibold">Campaign content</Form.Label>
                  <Form.Control
                    as="input"
                    placeholder="campaign content"
                    name="campaignContent"
                    defaultValue={values.campaignTerm}
                    onChange={handleChange('campaignContent')}
                  />
                  <p className="fs-sm ps-1 fst-italic">Use to differentiate ads</p>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={submitForm} className="py-2 px-3">
              Generate URL
            </Button>
          </Form>
          {submitted && (
            <div className="mt-4 p-4 bg-white border rounded-2 text-center">
              <h3>Generated campaign URL</h3>
              <div className="p-24 bg-dark text-white">
                <a
                  href={generateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ps-1 text-white text-decoration-none fs-4 text-break"
                >
                  {generateUrl}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Generator;
