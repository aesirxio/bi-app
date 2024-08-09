import { runInAction } from 'mobx';
import { AesirxBiApiService } from 'aesirx-lib';
export class FlowListStore {
  getFlowList = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getFlowList(dataFilter, dateFilter);
      if (responseDataFromLibrary && responseDataFromLibrary?.name !== 'AxiosError') {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message:
            responseDataFromLibrary?.response?.data?.error ||
            'Something went wrong from Server response',
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
  getFlowDate = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getFlowDate(dataFilter, dateFilter);
      if (responseDataFromLibrary && responseDataFromLibrary?.name !== 'AxiosError') {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message:
            responseDataFromLibrary?.response?.data?.error ||
            'Something went wrong from Server response',
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
  getEvents = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getEvents(dataFilter, dateFilter);
      if (responseDataFromLibrary && responseDataFromLibrary?.name !== 'AxiosError') {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary);
        });
      } else {
        callbackOnError({
          message:
            responseDataFromLibrary?.response?.data?.error ||
            'Something went wrong from Server response',
        });
      }
    } catch (error) {
      console.log('errorrrr', error);
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else if (error.response?.data.error) {
          callbackOnError({
            message: error.response?.data?.error,
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
  getLiveVisitorsTotal = async (dataFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getLiveVisitorsTotal(dataFilter);
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
  getLiveVisitorsDevice = async (dataFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getLiveVisitorsDevice(dataFilter);
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

export default FlowListStore;
