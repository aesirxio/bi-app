import { runInAction } from 'mobx';

import { AesirxBiApiService } from 'aesirx-lib';
export class ConsentsStore {
  getConsentsTemplate = async (activeDomain, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getConsentsTemplate(activeDomain);
      if (responseDataFromLibrary) {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message: 'Something went wrong from Server response',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.error) {
          callbackOnError({
            message: error.response?.data?.error,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?.error
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };

  updateConsentsTemplate = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.updateConsentsTemplate(data);
      if (responseDataFromLibrary) {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message: 'Something went wrong from Server response',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.error) {
          callbackOnError({
            message: error.response?.data?.error,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?.error
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };
}

export default ConsentsStore;
