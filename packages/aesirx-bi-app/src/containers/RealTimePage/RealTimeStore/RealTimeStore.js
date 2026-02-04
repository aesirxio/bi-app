import { runInAction } from 'mobx';
import { AesirxBiApiService } from 'aesirx-lib';
export class RealTimeStore {
  getRealTime = async (dataFilter, dateFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getLiveVisitorsList(dataFilter, dateFilter);
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
  updateConsentsTemplate = async (updateFieldData, integration = false) => {
    try {
      let resultOnSave;
      const updateOrganizationApiService = new AesirxBiApiService();
      resultOnSave = integration
        ? await updateOrganizationApiService.updateAnalyticsSetting(updateFieldData)
        : await updateOrganizationApiService.updateConsentsTemplate(updateFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  };
}

export default RealTimeStore;
