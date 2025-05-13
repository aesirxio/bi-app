import { runInAction } from 'mobx';

import { AesirxBiApiService } from 'aesirx-lib';
export class ConsentsAdvanceStore {
  getConsentsTier = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getConsentsTier(dataFilter, dateFilter);
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
  getEventsType = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getEventsType(dataFilter, dateFilter);
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
  getConsentsCategory = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getConsentsCategory(dataFilter, dateFilter);
      // const responseDataFromLibrary = {
      //   list: [
      //     {
      //       created_date: null,
      //       modified_date: '',
      //       modified_date_org: null,
      //       created_by: null,
      //       modified_by: null,
      //       category: 'advertising',
      //       allow: 3,
      //       reject: 1,
      //       total: 4,
      //     },
      //     {
      //       created_date: null,
      //       modified_date: '',
      //       modified_date_org: null,
      //       created_by: null,
      //       modified_by: null,
      //       category: 'analytics',
      //       allow: 2,
      //       reject: 2,
      //       total: 4,
      //     },
      //   ],
      //   pagination: {
      //     page: 1,
      //     page_size: 999,
      //     total_pages: 0,
      //     total_elements: 0,
      //   },
      // };
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
  getConsentsCategoryByDate = async (
    dataFilter,
    dateFilter,
    callbackOnSuccess,
    callbackOnError
  ) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getConsentsCategoryByDate(
        dataFilter,
        dateFilter
      );
      // const responseDataFromLibrary = {
      //   list: [
      //     {
      //       created_date: null,
      //       modified_date: '',
      //       modified_date_org: null,
      //       created_by: null,
      //       modified_by: null,
      //       date: '2025-05-12',
      //       allow_analytics: 2,
      //       allow_advertising: 3,
      //       allow_functional: 0,
      //       allow_custom: 0,
      //       reject_analytics: 2,
      //       reject_advertising: 0,
      //       reject_functional: 0,
      //       reject_custom: 0,
      //     },
      //     {
      //       created_date: null,
      //       modified_date: '',
      //       modified_date_org: null,
      //       created_by: null,
      //       modified_by: null,
      //       date: '2025-05-13',
      //       allow_analytics: 0,
      //       allow_advertising: 0,
      //       allow_functional: 0,
      //       allow_custom: 0,
      //       reject_analytics: 0,
      //       reject_advertising: 1,
      //       reject_functional: 0,
      //       reject_custom: 0,
      //     },
      //   ],
      //   pagination: {
      //     page: 1,
      //     page_size: 999,
      //     total_pages: 0,
      //     total_elements: 0,
      //   },
      // };
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

export default ConsentsAdvanceStore;
