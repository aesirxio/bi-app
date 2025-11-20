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
import { withUserViewModel } from '../UserViewModel/UserViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, Input, ActionsBar } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';

const EditUser = observer(
  class EditUser extends Component {
    userDetailViewModel = null;
    formPropsData = { _id: { $oid: '' } };
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({
        autoForceUpdate: this,
        validators: {
          startsWithAt: {
            message: 'The User SOP must start with "@"',
            rule: (val) => val && val.startsWith('@'),
          },
        },
      });
      this.userDetailViewModel = props.model?.userDetailViewModel
        ? props.model?.userDetailViewModel
        : null;

      this.userDetailViewModel.setForm(this);
      this.isEdit = props.match.params?.id ? true : false;
    }

    async componentDidMount() {
      const { match } = this.props;
      if (this.isEdit) {
        this.formPropsData._id.$oid = match.params?.id;
        await this.userDetailViewModel.initializeData();
      }
      this.userDetailViewModel.handleAliasChange('');
    }

    handleValidateForm() {
      if (this.validator.fields['sop'] === true) {
        this.setState((prevState) => {
          return {
            ...prevState,
            requiredField: Math.random(),
          };
        });
      }
      this.validator.showMessages();
    }

    debouncedChangeHandler = _.debounce((value) => {
      this.userDetailViewModel.handleAliasChange(value);
    }, 300);
    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.userDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={t('txt_user')}
              isEdit={this.isEdit}
              redirectUrl={'/user-handling'}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async () => {
                      historyPush(`/user-handling`);
                    },
                    icon: '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async () => {
                      if (this.validator.allValid()) {
                        const result = this.isEdit
                          ? await this.userDetailViewModel.update()
                          : await this.userDetailViewModel.create();
                        if (!result?.error) {
                          historyPush(`/user-handling`);
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
                        if (this.isEdit) {
                          await this.userDetailViewModel.update();
                          await this.userDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.userDetailViewModel.create();
                          if (!result?.error) {
                            historyPush(`/user-handling/edit/${result?.response?._id?.$oid}`);
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
            <Row className="gx-24 mb-24">
              <Col lg={9}>
                <Form.Group className={`mb-24`}>
                  <Input
                    field={{
                      getValueSelected:
                        this.userDetailViewModel.userDetailViewModel.formPropsData?.sop,
                      classNameInput: 'py-10 fs-4',
                      placeholder: 'Add User SoP',
                      handleChange: (event) => {
                        this.userDetailViewModel.handleFormPropsData('sop', event.target.value);
                      },
                      required: true,
                      validation: 'required|startsWithAt',
                      blurred: () => {
                        this.validator.showMessageFor('User SOP');
                      },
                    }}
                  />
                  {this.validator.message(
                    'User SOP',
                    this.userDetailViewModel.userDetailViewModel.formPropsData?.sop,
                    'required|startsWithAt',
                    {
                      className: 'text-danger mt-8px',
                    }
                  )}
                </Form.Group>
              </Col>
              <Col lg={3}>
                {/* <PublishOptions
                  detailViewModal={this.userDetailViewModel}
                  formPropsData={this.userDetailViewModel.userDetailViewModel.formPropsData}
                  isEdit={this.isEdit}
                  isFeatured={false}
                  isPublished={false}
                /> */}
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withUserViewModel(EditUser)));
