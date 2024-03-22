import { runInAction } from 'mobx';
import { AesirxBiApiService } from 'aesirx-lib';

export class PlatformsStore {
  getBrowsers = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getBrowsers(dataFilter, dateFilter);
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
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?._messages
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };

  getDevices = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getDevices(dataFilter, dateFilter);
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
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?._messages
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };

  getIsps = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getIsps(dataFilter, dateFilter);
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
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message: error?.response?.data?._messages
              ? error.response?.data?._messages[0]?.message
              : 'Something went wrong from Server response',
          });
        }
      });
    }
  };

}

export default PlatformsStore;
