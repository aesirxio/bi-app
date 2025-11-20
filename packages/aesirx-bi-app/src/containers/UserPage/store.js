import { AesirxCmpApiService } from 'aesirx-lib';

class UserStore {
  async getList(filters) {
    try {
      const getListAPIService = new AesirxCmpApiService();
      const respondedData = await getListAPIService.getUserList({ ...filters });
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async getDetail(id) {
    if (!id) return { error: false, response: false };

    try {
      const results = true;

      if (results) {
        const getDetailInfoAPIService = new AesirxCmpApiService();

        const respondedData = await getDetailInfoAPIService.getUserDetail(id);

        return { error: false, response: respondedData };
      }
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async create(createFieldData) {
    try {
      let resultOnSave;
      const createOrganizationApiService = new AesirxCmpApiService();

      // eslint-disable-next-line prefer-const
      resultOnSave = await createOrganizationApiService.createUser(createFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async update(updateFieldData) {
    try {
      let resultOnSave;
      const updateOrganizationApiService = new AesirxCmpApiService();
      // eslint-disable-next-line prefer-const
      resultOnSave = await updateOrganizationApiService.updateUser(updateFieldData);
      return { error: false, response: resultOnSave };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async delete(arr) {
    try {
      const aesirxOrganizationApiService = new AesirxCmpApiService();
      const respondedData = await aesirxOrganizationApiService.deleteUser(arr);
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }
}

export { UserStore };
