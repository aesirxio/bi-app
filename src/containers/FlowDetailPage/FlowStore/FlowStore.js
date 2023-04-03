import { runInAction } from 'mobx';

import { AesirxBiApiService } from 'aesirx-dma-lib';
export class FlowStore {
  getFlowDetail = async (flowId, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getFlowDetail(flowId);
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

export default FlowStore;
