/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import _ from 'lodash';
import { withUTMLinkViewModel } from '../UTMLinkViewModel/UTMLinkViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, Input, ActionsBar, FormSelection } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';
import CreatableSelect from 'react-select/creatable';

const EditUTMLink = observer(
  class EditUTMLink extends Component {
    utmLinkDetailViewModel = null;
    formPropsData = {
      _id: { $oid: '' },
      publish: true,
      websiteURL: 'https://' + this.props?.activeDomain[0],
      domain: this.props?.activeDomain[0],
    };
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
      });
      this.utmLinkDetailViewModel = props.model?.utmLinkDetailViewModel
        ? props.model?.utmLinkDetailViewModel
        : null;

      this.utmLinkDetailViewModel.setForm(this);
      this.isEdit = props.match.params?.id ? true : false;
      this.formPropsData.is_generated = !props?.isLink ?? true;
    }

    async componentDidMount() {
      const { match } = this.props;
      const tasks = [];
      if (this.isEdit) {
        this.formPropsData._id.$oid = match.params?.id;
        tasks.push(this.utmLinkDetailViewModel.initializeData(this.props?.activeDomain[0]));
      }
      tasks.push(
        this.utmLinkDetailViewModel.getUniqueUtmValueType({
          'filter[domain][0]': this.props?.activeDomain[0],
          page_size: 1000,
        })
      );
      if (!this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData?.is_generated) {
        tasks.push(
          this.utmLinkDetailViewModel.getUniqueUtmLinks({
            'filter[domain][0]': this.props?.activeDomain[0],
            page_size: 20,
          })
        );
      }

      await Promise.all(tasks);
      this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
      });
    }

    generateLink() {
      const formValid = this.validator.allValid();
      if (!formValid) {
        this.validator.showMessages();
      } else {
        const formPropsData = this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData;
        const params = new URLSearchParams({
          ...(formPropsData.utm_source && { utm_source: formPropsData.utm_source }),
          ...(formPropsData.utm_medium && { utm_medium: formPropsData.utm_medium }),
          ...(formPropsData.utm_campaign && { utm_campaign: formPropsData.utm_campaign }),
          ...(formPropsData.utm_id && { utm_id: formPropsData.utm_id }),
          ...(formPropsData.utm_term && { utm_term: formPropsData.utm_term }),
          ...(formPropsData.utm_content && { utm_content: formPropsData.utm_content }),
        });
        let url = this.formPropsData?.websiteURL + '?' + params.toString();
        if (!this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData?.is_generated) {
          url = this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData.link;
        }
        this.setState((prevState) => {
          return {
            ...prevState,
            generateUrl: url,
          };
        });
        this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData.link = url;
      }
    }

    handleValidateForm() {
      if (this.validator.fields['link'] === true) {
        this.setState((prevState) => {
          return {
            ...prevState,
            requiredField: Math.random(),
          };
        });
      }
      this.validator.showMessages();
    }

    loadUtmExternalLinkOptions = _.debounce(async (inputValue, callback) => {
      try {
        await this.utmLinkDetailViewModel?.getUniqueUtmLinks({
          'filter[domain][0]': this.props?.activeDomain[0],
          'filter[search]': inputValue || '',
          page_size: 20,
        });
        const options =
          this.utmLinkDetailViewModel?.uniqueUtmLinks?.map((item) => {
            return {
              label: item?.link,
              value: item?.link,
            };
          }) || [];
        callback(options);
      } catch (err) {
        console.error('Error loading UTM links:', err);
        callback([]);
      }
    }, 500);
    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console
      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.utmLinkDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={'UTM Links'}
              isEdit={this.isEdit}
              redirectUrl={'/utm-links'}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async () => {
                      historyPush(`/utm-links`);
                    },
                    icon: '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async () => {
                      if (this.validator.allValid()) {
                        this.generateLink();
                        const result = this.isEdit
                          ? await this.utmLinkDetailViewModel.update()
                          : await this.utmLinkDetailViewModel.create();
                        if (!result?.error) {
                          historyPush(`/utm-links`);
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                  },
                  {
                    title: t('txt_save'),
                    validator: this.validator,
                    handle: async () => {
                      if (this.validator.allValid()) {
                        this.generateLink();
                        if (this.isEdit) {
                          await this.utmLinkDetailViewModel.update();
                          await this.utmLinkDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.utmLinkDetailViewModel.create();
                          if (!result?.error) {
                            historyPush(`/utm-links/edit/${result?.response?._id?.$oid}`);
                          }
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                    icon: '/assets/images/save.svg',
                    variant: 'success',
                  },
                ]}
              />
            </div>
          </div>
          <Form>
            <Row>
              <Col lg="9">
                <Row>
                  {!this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                    ?.is_generated ? (
                    <Col sm={`12`}>
                      <Form.Group className="mb-3" controlId="formExternalLink">
                        <Form.Label className="fw-semibold">
                          UTM External Link <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="mb-3 position-relative">
                          {this.utmLinkDetailViewModel.formUtmLinksStatus ===
                            PAGE_STATUS.LOADING && (
                            <Spinner className="spinner-overlay w-auto h-auto" size={25} />
                          )}
                          <FormSelection
                            field={{
                              getValueSelected: this.utmLinkDetailViewModel.utmLinkDetailViewModel
                                .formPropsData.link
                                ? {
                                    label:
                                      this.utmLinkDetailViewModel.utmLinkDetailViewModel
                                        .formPropsData.link,
                                    value:
                                      this.utmLinkDetailViewModel.utmLinkDetailViewModel
                                        .formPropsData.link,
                                  }
                                : null,
                              defaultOptions: this.utmLinkDetailViewModel?.uniqueUtmLinks?.length
                                ? this.utmLinkDetailViewModel?.uniqueUtmLinks?.map((item) => {
                                    return {
                                      label: item?.link,
                                      value: item?.link,
                                    };
                                  })
                                : [],
                              async: true,
                              loadOptions: (inputValue, callback) => {
                                this.loadUtmExternalLinkOptions(inputValue, callback);
                              },
                              arrowColor: 'var(--dropdown-indicator-color)',
                              handleChange: (data) => {
                                if (data?.value) {
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'link',
                                    data.value
                                  );
                                  const params = new URL(data.value)?.searchParams;
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_source',
                                    params?.get('utm_source')
                                  );
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_medium',
                                    params?.get('utm_medium')
                                  );
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_campaign',
                                    params?.get('utm_campaign')
                                  );
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_term',
                                    params?.get('utm_term')
                                  );
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_content',
                                    params?.get('utm_content')
                                  );
                                  this.utmLinkDetailViewModel.handleFormPropsData(
                                    'utm_id',
                                    params?.get('utm_id')
                                  );
                                }
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('link');
                              },
                            }}
                          />
                        </div>

                        {this.validator.message(
                          'link',
                          this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData?.link,
                          'required',
                          {
                            className: 'text-danger mt-8px',
                          }
                        )}
                      </Form.Group>
                    </Col>
                  ) : (
                    <></>
                  )}
                  <Col
                    sm={`${
                      !this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                        ?.is_generated
                        ? '6'
                        : '12'
                    }`}
                  >
                    <Form.Group className="mb-3" controlId="formCampaignLabel">
                      <Form.Label className="fw-semibold">
                        Campaign Label <span className="text-danger">*</span>
                      </Form.Label>
                      <Input
                        field={{
                          getValueSelected:
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.campaign_label,
                          classNameInput: 'py-10 fs-4',
                          placeholder: 'campaign label',
                          handleChange: (event) => {
                            this.utmLinkDetailViewModel.handleFormPropsData(
                              'campaign_label',
                              event.target.value
                            );
                          },
                          required: true,
                          validation: 'required',
                          blurred: () => {
                            this.validator.showMessageFor('campaign_label');
                          },
                        }}
                      />
                      <p className="fs-sm ps-1 fst-italic">
                        Alias/label support for complex or “gibberish” UTM values
                      </p>
                      {this.validator.message(
                        'campaign_label',
                        this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                          ?.campaign_label,
                        'required',
                        {
                          className: 'text-danger mt-8px',
                        }
                      )}
                    </Form.Group>
                  </Col>
                  {this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                    ?.is_generated ? (
                    <>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formURL">
                          <Form.Label className="fw-semibold">
                            Website URL <span className="text-danger">*</span>
                          </Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.websiteURL,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'website URL',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'websiteURL',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('websiteURL');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">The full website URL</p>
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formCampaignName">
                          <Form.Label className="fw-semibold">
                            Campaign name <span className="text-danger">*</span>
                          </Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_campaign,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign name',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_campaign',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_campaign');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">
                            Product, promo code, or slogan (e.g. spring_sale) One of campaign name
                            or campaign id are required.
                          </p>
                          {this.validator.message(
                            'utm_campaign',
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.utm_campaign,
                            'required',
                            {
                              className: 'text-danger mt-8px',
                            }
                          )}
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formCampaignID">
                          <Form.Label className="fw-semibold">
                            Campaign ID <span className="text-danger">*</span>
                          </Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_id,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign ID',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_id',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_id');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">The ads campaign id.</p>
                          {this.validator.message(
                            'utm_id',
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.utm_id,
                            'required',
                            {
                              className: 'text-danger mt-8px',
                            }
                          )}
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formutm_content">
                          <Form.Label className="fw-semibold">Campaign term</Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_term,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign term',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_term',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_term');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">Identify the paid keywords</p>
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formCampaignSource">
                          <Form.Label className="fw-semibold">
                            Campaign source <span className="text-danger">*</span>
                          </Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_source,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign source',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_source',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_source');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">
                            The referrer (e.g. google, newsletter)
                          </p>
                          {this.validator.message(
                            'utm_source',
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.utm_source,
                            'required',
                            {
                              className: 'text-danger mt-8px',
                            }
                          )}
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formCampaignContent">
                          <Form.Label className="fw-semibold">Campaign content</Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_content,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign content',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_content',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_content');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">Use to differentiate ads</p>
                        </Form.Group>
                      </Col>
                      <Col sm="6">
                        <Form.Group className="mb-3" controlId="formCampaignMedium">
                          <Form.Label className="fw-semibold">
                            Campaign medium <span className="text-danger">*</span>
                          </Form.Label>
                          <Input
                            field={{
                              getValueSelected:
                                this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                  ?.utm_medium,
                              classNameInput: 'py-10 fs-4',
                              placeholder: 'campaign medium',
                              handleChange: (event) => {
                                this.utmLinkDetailViewModel.handleFormPropsData(
                                  'utm_medium',
                                  event.target.value
                                );
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('utm_medium');
                              },
                            }}
                          />
                          <p className="fs-sm ps-1 fst-italic">
                            Marketing medium (e.g. cpc, banner, email)
                          </p>
                          {this.validator.message(
                            'utm_medium',
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.utm_medium,
                            'required',
                            {
                              className: 'text-danger mt-8px',
                            }
                          )}
                        </Form.Group>
                      </Col>
                    </>
                  ) : (
                    <></>
                  )}

                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="formValue">
                      <Form.Label className="fw-semibold">Value</Form.Label>
                      <Input
                        field={{
                          getValueSelected:
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData?.value,
                          classNameInput: 'py-10 fs-4',
                          placeholder: 'value',
                          typeFormat: 'number',
                          handleChange: (event) => {
                            this.utmLinkDetailViewModel.handleFormPropsData(
                              'value',
                              parseInt(event.target.value)
                            );
                          },
                        }}
                      />
                      <p className="fs-sm ps-1 fst-italic">Enter a fiscal value i.e. 100</p>
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="formValueType">
                      <Form.Label className="fw-semibold">Value Type</Form.Label>
                      <CreatableSelect
                        className="fs-sm"
                        value={
                          this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                            .value_type
                            ? {
                                label:
                                  this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                    .value_type,
                                value:
                                  this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                                    .value_type,
                              }
                            : null
                        }
                        options={
                          this.utmLinkDetailViewModel?.uniqueUtmValueType?.length
                            ? this.utmLinkDetailViewModel?.uniqueUtmValueType?.map((item) => {
                                return {
                                  label: item?.value_type,
                                  value: item?.value_type,
                                };
                              })
                            : []
                        }
                        onChange={(data) => {
                          if (data?.value) {
                            this.utmLinkDetailViewModel.handleFormPropsData(
                              'value_type',
                              data.value
                            );
                            this.forceUpdate();
                          }
                        }}
                        placeholder="value type (visit, signup, purchase), etc,...)"
                      />
                      <p className="fs-sm ps-1 fst-italic">
                        Enter a type of event: visit, signup, purchase, etc (remember we have to
                        change this in next release to not be just free text but selection)
                      </p>
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="formEngagementWeight">
                      <Form.Label className="fw-semibold">Engagement weight</Form.Label>
                      <Input
                        field={{
                          getValueSelected:
                            this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData
                              ?.engagement_weight,
                          classNameInput: 'py-10 fs-4',
                          placeholder: 'engagement weight',
                          typeFormat: 'number',
                          handleChange: (event) => {
                            this.utmLinkDetailViewModel.handleFormPropsData(
                              'engagement_weight',
                              parseInt(event.target.value)
                            );
                          },
                        }}
                      />
                      <p className="fs-sm ps-1 fst-italic">
                        Additional user engagement score value i.e. 20, which will be added to the
                        user flow total engagement score
                      </p>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          {this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData.link && (
            <div className="mt-4 p-4 bg-white border rounded-2 text-center">
              <h3>Campaign URL</h3>
              <div className="p-24 bg-dark text-white">
                <a
                  href={this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData.link}
                  target="_blank"
                  rel="noreferrer"
                  className="ps-1 text-white text-decoration-none fs-4 text-break"
                >
                  {this.utmLinkDetailViewModel.utmLinkDetailViewModel.formPropsData.link}
                </a>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withUTMLinkViewModel(EditUTMLink)));
