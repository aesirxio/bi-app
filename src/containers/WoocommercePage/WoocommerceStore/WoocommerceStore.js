import { runInAction } from 'mobx';

import { AesirxBiApiService } from 'aesirx-lib';
export class WoocommerceStore {
  getVisitor = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getVisitor(dataFilter, dateFilter);
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

  getAttribute = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError, attr) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getAttribute(dataFilter, dateFilter);
      console.log(responseDataFromLibrary);
      if (responseDataFromLibrary) {
        console.log('attrattr', attr);
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary, attr);
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

  getWoocommerce = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getEvents(dataFilter, dateFilter);
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

export default WoocommerceStore;
