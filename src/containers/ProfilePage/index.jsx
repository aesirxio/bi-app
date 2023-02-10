/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { observer } from 'mobx-react';
import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { UPDATE_GENERAL_FIELD_KEY } from '../../constants/ProfileModule';
import UpdateGeneral from './UpdateGeneral';
import UpdatePassword from './UpdatePassword';
import { withTranslation } from 'react-i18next';
import ProfileStore from './ProfileStore/ProfileStore';
import ProfileViewModel from './ProfileViewModel/ProfileViewModel';
import { ProfileViewModelContextProvider } from './ProfileViewModel/ProfileViewModelContextProvider';
import { Storage } from 'aesirx-dma-lib';
import { AUTHORIZATION_KEY } from 'aesirx-dma-lib';

const profileStore = new ProfileStore();
const profileViewModel = new ProfileViewModel(profileStore);

const ProfilePage = observer(
  class ProfilePage extends React.Component {
    updateGeneralViewModel = null;
    formPropsData = {
      [UPDATE_GENERAL_FIELD_KEY.ID]: Storage.getItem(AUTHORIZATION_KEY.MEMBER_ID),
      [UPDATE_GENERAL_FIELD_KEY.USERNAME]: '',
      [UPDATE_GENERAL_FIELD_KEY.AVATAR_DAM]: '',
      [UPDATE_GENERAL_FIELD_KEY.FULLNAME]: '',
      [UPDATE_GENERAL_FIELD_KEY.EMAIL]: '',
      [UPDATE_GENERAL_FIELD_KEY.PHONE]: '',
    };
    constructor(props) {
      super(props);
      // this.state = {
      //   loading: false,
      //   getUrlImage: '',
      // };
      this.validator = new SimpleReactValidator();
      // const { viewModel } = props;
      // this.updateGeneralViewModel = viewModel ? viewModel.getUpdateGeneralViewModel() : null;
      this.updateGeneralViewModel?.setAllValue(this);
      this.validateInfoBeforeSending = this.validateInfoBeforeSending?.bind(this);
      this.handleDamAssets = this.handleDamAssets?.bind(this);
      this.updateGeneralViewModel?.setForm(this);
    }

    componentDidMount() {
      this.updateGeneralViewModel?.initializeData();
    }

    saveGeneralHandler = () => {
      this.updateGeneralViewModel?.saveGeneralInformationOnPage();
    };

    blurringFieldHandler = () => {
      this.validator.hideMessageFor('password');
    };
    validateInfoBeforeSending = () => {
      if (this.validator.allValid()) {
        this.setState({ loading: true });
        this.saveGeneralHandler();
      } else {
        this.validator.showMessages();
        this.forceUpdate();
        return false;
      }
    };

    render() {
      const { t } = this.props;

      return (
        <ProfileViewModelContextProvider viewModel={profileViewModel}>
          <div>
            <div className="d-flex flex-row justify-content-between py-4 px-16">
              <div>
                <h2 className="text-blue-0">{t('txt_title_profilfe_setting')}</h2>
                <span className="text-color">{t('txt_title_set_information_name')}</span>
              </div>
              {/* <div className='d-flex flex-row'>
              <div className='me-16'>
                <SubmitButton validateInfoBeforeSending={this.validateInfoBeforeSending} />
              </div>
                <ButtonCancel />
              </div> */}
            </div>

            <div className="py-4 px-16 bg-white mx-16 rounded-3">
              <div className="w-80-percent">
                <h2 className="text-blue-0 mb-16">{t('txt_general_information')}</h2>
                <UpdateGeneral />
                <h2 className="text-blue-0 my-16">{t('txt_projectpage_password')}</h2>
                <UpdatePassword />
              </div>
            </div>
          </div>
        </ProfileViewModelContextProvider>
      );
    }
  }
);

export default withTranslation('common')(ProfilePage);
