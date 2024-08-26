import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConsentsTemplateViewModel } from './ConsentsTemplateViewModels/ConsentsTemplateViewModelContextProvider';
import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Image, PAGE_STATUS, notify, FormEditor } from 'aesirx-uikit';
import { env } from 'aesirx-lib';

const ConsentsTemplate = observer(() => {
  const { t } = useTranslation();
  const {
    consentsList: {
      initialize,
      updateConsentsTemplate,
      consentsTemplate,
      statusUpdateConsentsTemplate,
    },
  } = useConsentsTemplateViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  useEffect(() => {
    const execute = async () => {
      await initialize(activeDomain[0]);
    };
    execute();
    return () => {};
  }, [activeDomain]);

  useEffect(() => {
    setValues(consentsTemplate);
  }, [consentsTemplate]);

  const [values, setValues] = useState({
    domain: activeDomain[0],
    template: '',
    gtag_id: '',
    gtm_id: '',
  });

  const handleChange = (name) => {
    setValues({ ...values, domain: activeDomain[0], template: name });
  };
  const handleSubmit = async () => {
    if (values?.template) {
      await updateConsentsTemplate(values);
    } else {
      notify('Please choose template', 'error');
    }
  };

  useEffect(() => {
    updateDefaultConsentText();
  }, []);

  const [defaulConsentText, setDefaulConsentText] = useState();
  const updateDefaultConsentText = (template) => {
    console.log('template', template);
    const text = `
    <p class="mt-0 mb-1 mb-lg-2 text-black fw-semibold">
      Manage Your Consent Preferences
    </p>
    <p class="mt-0 mb-1 mb-lg-3">
     ${
       template === 'simple-consent-mode'
         ? `Choose how we use your data: “Reject” data collection, allow tracking [“Consent”].`
         : `Choose how we use your data: “Reject” data collection, allow tracking [“Consent”], or use “Decentralized Consent” for more control over your personal data & rewards.`
     }
    </p>
    <div class="mb-1 mb-lg-3">
      <p class="mb-1 mb-lg-2 text-black">
        By consenting, you allow us to collect & use your data for:
      </p>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>Analytics & Behavioral Data: To improve our services & personalize your experience.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>Form Data: When you contact us.</div>
        </div>
      </div>
    </div>
    <div>
      <p class="mb-1 mb-lg-2 text-black">Please note</p>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>We do not share your data with third parties without your explicit consent.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          <div>You can opt-in later for specific features without giving blanket consent.</div>
        </div>
      </div>
      <div class="d-flex align-items-start check-line">
        <span>
          <img src="${
            env.PUBLIC_URL + '/assets/images/check_circle.svg'
          }" width={'14px'} height={'15px'} />
        </span>
        <div class="ms-10px">
          For more details, refer to our <a class='text-success fw-semibold text-decoration-underline' href='https://aesirx.io/privacy-policy' target='_blank'>privacy policy.</a>
        </div>
      </div>
    </div>`;
    setDefaulConsentText(text);
  };
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column min-vh-100">
      <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">{t('txt_menu_consents_template')}</h2>
        </div>
        <Button
          variant="success"
          className="px-4 py-2 fw-semibold"
          onClick={() => {
            handleSubmit();
          }}
        >
          {statusUpdateConsentsTemplate === PAGE_STATUS.LOADING && (
            <Spinner size="sm" className="me-2" />
          )}
          Save
        </Button>
      </div>
      <Form.Group className="mb-3" controlId="formExport">
        <Form.Label className="fw-semibold w-100">
          Fill your Google tag id, Google Tag Manager id for {activeDomain[0]} (optional)
        </Form.Label>
        <Row className="mb-3">
          <Col lg="6">
            <Form.Control
              type="text"
              placeholder={`${t('txt_input_gtag_id')}`}
              value={values?.gtag_id ?? ''}
              onChange={(e) => {
                setValues({ ...values, gtag_id: e.target?.value });
              }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col lg="6">
            <Form.Control
              type="text"
              placeholder={`${t('txt_input_gtm_id')}`}
              value={values?.gtm_id ?? ''}
              onChange={(e) => {
                setValues({ ...values, gtm_id: e.target?.value });
              }}
            />
          </Col>
        </Row>
        <Form.Label className="fw-semibold w-100">
          Choose consent template for {activeDomain[0]}
        </Form.Label>
        <Row>
          <Col lg="4" className="mb-3">
            <div className="d-flex justify-content-between flex-column h-100">
              <div className="border rounded-2 shadow-sm mb-3">
                <Image
                  className={`w-100`}
                  src={`${env.PUBLIC_URL}/assets/images/consent_default.png`}
                  alt={'icons'}
                />
              </div>
              <Form.Check
                inline
                label={`Default template`}
                onChange={() => {
                  handleChange('default');
                  updateDefaultConsentText('default');
                }}
                checked={values?.template === 'default'}
                value={`default`}
                name="group1"
                type="radio"
                id={`inline-radio-default`}
              />
            </div>
          </Col>
          <Col lg="4" className="mb-3">
            <div className="d-flex justify-content-between flex-column h-100">
              <div className="border rounded-2 shadow-sm mb-3">
                <Image
                  className={`w-100`}
                  src={`${env.PUBLIC_URL}/assets/images/consent_simple_mode.png`}
                  alt={'icons'}
                />
              </div>
              <Form.Check
                inline
                label={`Simple Consent Mode`}
                onChange={() => {
                  handleChange('simple-consent-mode');
                  updateDefaultConsentText('simple-consent-mode');
                }}
                checked={values?.template === 'simple-consent-mode'}
                value={`simple-consent-mode`}
                name="group1"
                type="radio"
                id={`inline-radio-simple`}
              />
            </div>
          </Col>
        </Row>
        <Form.Label className="mt-2 fw-semibold w-100">Customize consent text</Form.Label>
        <React.Fragment key={defaulConsentText}>
          <FormEditor
            field={{
              getValueSelected: values?.consent_text ?? defaulConsentText,
              handleChange: (data) => {
                setValues({ ...values, consent_text: data ?? '' });
              },
            }}
          />
        </React.Fragment>
      </Form.Group>
    </div>
  );
});

export default ConsentsTemplate;
