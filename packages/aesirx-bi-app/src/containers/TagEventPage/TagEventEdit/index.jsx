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
import { withTagEventViewModel } from '../TagEventViewModel/TagEventViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, Input, ActionsBar, FormSelection } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';
import queryString from 'query-string';
import { env } from 'aesirx-lib';

const EditTagEvent = observer(
  class EditTagEvent extends Component {
    tagEventDetailViewModel = null;
    formPropsData = {
      _id: { $oid: '' },
      publish: true,
      domain: this.props?.activeDomain[0],
    };
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
      });
      this.tagEventDetailViewModel = props.model?.tagEventDetailViewModel
        ? props.model?.tagEventDetailViewModel
        : null;

      this.tagEventDetailViewModel.setForm(this);
      this.params = queryString.parse(props.location.search);
      this.editID = props.integration
        ? props?.integrationLink?.split('&tagid=')[1]
          ? props?.integrationLink?.split('&tagid=')[1]
          : this.params?.tagid
        : props.match.params?.id;
      this.isEdit = this.editID ? true : false;
      this.formPropsData.is_generated = !props?.isLink ?? true;
    }

    async componentDidMount() {
      const tasks = [];
      if (this.isEdit) {
        this.formPropsData._id.$oid = this.editID;
        tasks.push(this.tagEventDetailViewModel.initializeData(this.props?.activeDomain[0]));
      }
      if (!this.tagEventDetailViewModel.tagEventDetailViewModel.formPropsData?.is_generated) {
        tasks.push(
          this.tagEventDetailViewModel.getUniqueEventNames({
            'filter[domain][0]': this.props?.activeDomain[0],
            'filter_not[event_name][0]': 'visit',
            'filter_not[event_name][1]': 'Reject consent',
            page_size: 20,
          })
        );
      }

      await Promise.all(tasks);
      this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
      });
    }

    handleValidateForm() {
      if (this.validator.fields['event_name'] === true) {
        this.setState((prevState) => {
          return {
            ...prevState,
            requiredField: Math.random(),
          };
        });
      }
      this.validator.showMessages();
    }

    loadEventExternalLinkOptions = _.debounce(async (inputValue, callback) => {
      try {
        await this.tagEventDetailViewModel?.getUniqueEventNames({
          'filter[domain][0]': this.props?.activeDomain[0],
          'filter[search]': inputValue || '',
          page_size: 20,
        });
        const options =
          this.tagEventDetailViewModel?.uniqueTagEvents?.map((item) => {
            return {
              label: item?.event_name,
              value: item?.event_name,
            };
          }) || [];
        callback(options);
      } catch (err) {
        console.error('Error loading event names:', err);
        callback([]);
      }
    }, 500);

    handleChangeLink = (e, link, deleteParams) => {
      e.preventDefault();
      if (link) {
        this.props.setIntegrationLink(link, deleteParams);
      }
    };
    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console
      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.tagEventDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={'Tag Value'}
              isEdit={this.isEdit}
              redirectUrl={this.props.integration ? 'tag-events' : '/tag-events'}
              handleChangeLink={this.handleChangeLink}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async (e) => {
                      this.props.integration
                        ? this.handleChangeLink(e, `tag-events`)
                        : historyPush(`/tag-events`);
                    },
                    icon: env.PUBLIC_URL + '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async (e) => {
                      if (this.validator.allValid()) {
                        const result = this.isEdit
                          ? await this.tagEventDetailViewModel.update()
                          : await this.tagEventDetailViewModel.create();
                        if (!result?.error) {
                          this.props.integration
                            ? this.handleChangeLink(e, `tag-events`)
                            : historyPush(`/tag-events`);
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                  },
                  {
                    title: t('txt_save'),
                    validator: this.validator,
                    handle: async (e) => {
                      if (this.validator.allValid()) {
                        if (this.isEdit) {
                          await this.tagEventDetailViewModel.update();
                          await this.tagEventDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.tagEventDetailViewModel.create();
                          if (!result?.error) {
                            if (this.props.integration) {
                              this.handleChangeLink(
                                e,
                                `tag-events-edit&tagid=${result?.response?._id?.$oid}`
                              );
                            } else {
                              historyPush(`/tag-events/edit/${result?.response?._id?.$oid}`);
                            }
                          }
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                    icon: env.PUBLIC_URL + '/assets/images/save.svg',
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
                  {!this.tagEventDetailViewModel.tagEventDetailViewModel.formPropsData
                    ?.is_generated ? (
                    <Col sm={`12`}>
                      <Form.Group className="mb-3" controlId="formExternalLink">
                        <Form.Label className="fw-semibold">
                          Tag Value <span className="text-danger">*</span>
                        </Form.Label>
                        <div className="mb-3 position-relative">
                          {this.tagEventDetailViewModel.formTagEventsStatus ===
                            PAGE_STATUS.LOADING && (
                            <Spinner className="spinner-overlay w-auto h-auto" size={25} />
                          )}
                          <FormSelection
                            field={{
                              getValueSelected: this.tagEventDetailViewModel.tagEventDetailViewModel
                                .formPropsData.event_name
                                ? {
                                    label:
                                      this.tagEventDetailViewModel.tagEventDetailViewModel
                                        .formPropsData.event_name,
                                    value:
                                      this.tagEventDetailViewModel.tagEventDetailViewModel
                                        .formPropsData.event_name,
                                  }
                                : null,
                              defaultOptions: this.tagEventDetailViewModel?.uniqueTagEvents?.length
                                ? this.tagEventDetailViewModel?.uniqueTagEvents?.map((item) => {
                                    return {
                                      label: item?.event_name,
                                      value: item?.event_name,
                                    };
                                  })
                                : [],
                              async: true,
                              loadOptions: (inputValue, callback) => {
                                this.loadEventExternalLinkOptions(inputValue, callback);
                              },
                              arrowColor: 'var(--dropdown-indicator-color)',
                              handleChange: (data) => {
                                if (data?.value) {
                                  this.tagEventDetailViewModel.handleFormPropsData(
                                    'event_name',
                                    data.value
                                  );
                                }
                              },
                              required: true,
                              validation: 'required',
                              blurred: () => {
                                this.validator.showMessageFor('event_name');
                              },
                            }}
                          />
                        </div>

                        {this.validator.message(
                          'event_name',
                          this.tagEventDetailViewModel.tagEventDetailViewModel.formPropsData
                            ?.event_name,
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
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="formMetricValue">
                      <Form.Label className="fw-semibold">Metric Value</Form.Label>
                      <Input
                        field={{
                          getValueSelected:
                            this.tagEventDetailViewModel.tagEventDetailViewModel.formPropsData
                              ?.metric_value,
                          classNameInput: 'py-10 fs-4',
                          placeholder: 'Metric Value',
                          typeFormat: 'number',
                          handleChange: (event) => {
                            this.tagEventDetailViewModel.handleFormPropsData(
                              'metric_value',
                              parseInt(event.target.value)
                            );
                          },
                        }}
                      />
                      <p className="fs-sm ps-1 fst-italic">Enter a metric value i.e. 100</p>
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group className="mb-3" controlId="formEngagementValue">
                      <Form.Label className="fw-semibold">Engagement value</Form.Label>
                      <Input
                        field={{
                          getValueSelected:
                            this.tagEventDetailViewModel.tagEventDetailViewModel.formPropsData
                              ?.engagement_value,
                          classNameInput: 'py-10 fs-4',
                          placeholder: 'engagement weight',
                          typeFormat: 'number',
                          handleChange: (event) => {
                            this.tagEventDetailViewModel.handleFormPropsData(
                              'engagement_value',
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
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withTagEventViewModel(EditTagEvent)));
