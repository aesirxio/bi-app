import { AesirxBiApiService } from 'aesirx-lib';
import { runInAction } from 'mobx';

class UTMLinkStore {
  async getList(activeDomain) {
    try {
      const getListAPIService = new AesirxBiApiService();
      const respondedData = await getListAPIService.getUtmLinkList(activeDomain);
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async getDetail(id, activeDomain) {
    if (!id) return { error: false, response: false };

    try {
      const results = true;

      if (results) {
        const getDetailInfoAPIService = new AesirxBiApiService();

        const respondedData = await getDetailInfoAPIService.getUtmLinkDetail(id, activeDomain);

        return { error: false, response: respondedData };
      }
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async create(createFieldData) {
    try {
      let resultOnSave;
      const createOrganizationApiService = new AesirxBiApiService();

      // eslint-disable-next-line prefer-const
      resultOnSave = await createOrganizationApiService.createUtmLink(createFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async update(updateFieldData) {
    try {
      let resultOnSave;
      const updateOrganizationApiService = new AesirxBiApiService();
      // eslint-disable-next-line prefer-const
      resultOnSave = await updateOrganizationApiService.updateUtmLink(updateFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async delete(arr) {
    try {
      const aesirxOrganizationApiService = new AesirxBiApiService();
      const respondedData = await aesirxOrganizationApiService.deleteUtmLink(arr);
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async updateConsentsTemplate(updateFieldData) {
    try {
      let resultOnSave;
      console.log('updateFieldData', updateFieldData);
      const updateOrganizationApiService = new AesirxBiApiService();
      // eslint-disable-next-line prefer-const
      resultOnSave = await updateOrganizationApiService.updateConsentsTemplate(updateFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  getAttributeDateUtm = async (
    dataFilter,
    dateFilter,
    callbackOnSuccess,
    callbackOnError,
    globalStoreViewModel
  ) => {
    try {
      const biService = new AesirxBiApiService();
      const responseDataFromLibrary = await biService.getAttributeDateUtm(dataFilter, dateFilter);
      if (responseDataFromLibrary && responseDataFromLibrary?.name !== 'AxiosError') {
        runInAction(() => {
          callbackOnSuccess(responseDataFromLibrary, globalStoreViewModel);
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
}

export { UTMLinkStore };
