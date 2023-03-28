/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { withTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';

import './index.scss';

import { login } from '../../auth';
import InputPassword from '../../components/inputPassword';
// import ComponentImage from 'components/ComponentImage';
// import { AesirxAuthenticationApiService, Storage } from 'aesirx-dma-lib';
import Checkbox from 'components/Checkbox';
import { env } from 'env';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: env.REACT_APP_DEFAULT_USER ?? '',
      password: env.REACT_APP_DEFAULT_PASSWORD ?? '',
      remember: false,
      isProcessing: false,
    };

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });

    this.usernameInput = React.createRef();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit() {
    if (this.validator.allValid()) {
      await login(this.state);
    } else {
      this.validator.showMessages();
      return;
    }
  }

  onKeyPress = (e) => {
    if (e.which === 13) {
      this.handleSubmit();
    }
  };

  render() {
    const { t } = this.props;

    return (
      <div className="vh-100 bg-blue-9">
        <div className="row justify-content-center align-items-center h-100 bg-white">
          <div className="col-lg-7 col-xxl-4">
            <div className="d-block bg-white p-2 p-lg-5">
              <h1 className="fs-2 text-blue fw-semibold text-center mb-16 lh-base">
                {t('txt_login_text_1')}
                <img
                  className="px-1"
                  style={{ verticalAlign: 'inherit' }}
                  alt="aesirx"
                  src={env.PUBLIC_URL + '/assets/images/logo/welcome-logo.png'}
                />
                {t('txt_bi')}.
                <br /> {t('txt_login_text_2')}
              </h1>
              <form className="login-form">
                <label className="form-label mb-1 fw-semibold text-black">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                  ref={this.usernameInput}
                  onBlur={() => {
                    this.validator.showMessageFor('Email or username');
                  }}
                />
                {this.validator.message('Email or username', this.state.username, 'required', {
                  className: 'text-danger',
                })}
                <label className="form-label fw-semibold mt-24 mb-1 text-black" htmlFor="password">
                  Password <span className="text-danger">*</span>
                </label>
                <InputPassword
                  type="password"
                  className="form-control"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  onKeyPress={this.onKeyPress}
                  onBlur={() => {
                    this.validator.showMessageFor('password');
                  }}
                />
                {this.validator.message('password', this.state.password, 'required', {
                  className: 'text-danger',
                })}
                <div className="d-flex justify-content-between mt-24">
                  <Checkbox text="Remember me" />
                  <a
                    href="https://bi.aesirx.io/auth/forgotpassword"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex fw-semibold fs-6"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="button"
                  className={`btn w-100 fw-bold btn-success position-relative d-flex align-item-center justify-content-center wr_btn_login mt-24 text-uppercase`}
                  onClick={this.handleSubmit}
                >
                  {t('txt_sign_in')}
                  <div className="ps-2 btn_loading">
                    <div
                      className="spinner-border"
                      style={{ width: '1.7rem', height: '1.7rem' }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('common')(LoginPage);
