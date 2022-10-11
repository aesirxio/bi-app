/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { runInAction } from 'mobx';
import BiUtils from './BiUtils';

import AesirxBiApiService from 'library/Bi/Bi';
export default class BiStore {
  updateSubscription = async (data) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.updateBiSubscription(data);
      if (responsedDataFromLibary) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  getCollections = async (collectionId, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.getCollections(collectionId);
      if (responsedDataFromLibary?.list) {
        const collectionDataModel = responsedDataFromLibary?.list;
        if (collectionDataModel) {
          runInAction(() => {
            callbackOnSuccess({
              list: collectionDataModel,
              pagination: responsedDataFromLibary.pagination,
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'No Result',
            });
          });
        }
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  createCollections = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.createCollections(data);
      if (responsedDataFromLibary) {
        const getDetailCollection = await biService.getCollection(responsedDataFromLibary);
        if (getDetailCollection?.item) {
          runInAction(() => {
            callbackOnSuccess({
              item: getDetailCollection.item,
              type: 'create',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'error with getDetail',
            });
          });
        }
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data?.message) {
          callbackOnError({
            message: error.response?.data.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  updateCollections = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.updateCollections(data);
      if (responsedDataFromLibary) {
        runInAction(() => {
          callbackOnSuccess({
            item: data,
            type: 'update',
          });
        });
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  deleteCollections = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.deleteCollections(data?.id);
      if (responsedDataFromLibary) {
        runInAction(() => {
          callbackOnSuccess({
            item: data,
            type: 'delete',
          });
        });
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  getAssets = async (collectionId, dataFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.getAssets(collectionId, dataFilter);
      if (responsedDataFromLibary?.list) {
        const homeDataModels = BiUtils.transformPersonaResponseIntoModel(
          responsedDataFromLibary.list
        );
        if (homeDataModels) {
          runInAction(() => {
            callbackOnSuccess({
              list: homeDataModels,
              pagination: responsedDataFromLibary.pagination,
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'No Result',
            });
          });
        }
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  createAssets = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.createAssets(data);
      console.log(responsedDataFromLibary);
      if (responsedDataFromLibary) {
        const getDetailAsset = await biService.getAsset(responsedDataFromLibary);
        if (getDetailAsset.item) {
          runInAction(() => {
            callbackOnSuccess({
              item: getDetailAsset.item,
              type: 'create',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'error with getDetail',
            });
          });
        }
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  updateAssets = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.updateAssets(data);
      if (responsedDataFromLibary) {
        runInAction(() => {
          callbackOnSuccess({
            item: data,
            type: 'update',
          });
        });
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  deleteAssets = async (data, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.deleteAssets(data?.id);
      if (responsedDataFromLibary) {
        runInAction(() => {
          callbackOnSuccess({
            item: data,
            type: 'delete',
          });
        });
      } else {
        if (responsedDataFromLibary?.message === 'isCancle') {
          runInAction(() => {
            callbackOnError({
              message: 'isCancle',
            });
          });
        } else {
          runInAction(() => {
            callbackOnError({
              message: 'Something went wrong from Server response',
            });
          });
        }
      }
    } catch (error) {
      runInAction(() => {
        if (error.response?.data.message) {
          callbackOnError({
            message: error.response?.data?.message,
          });
        } else {
          callbackOnError({
            message:
              error.response?.data?._messages[0]?.message ??
              'Something went wrong from Server response',
          });
        }
      });
    }
  };

  search = async (query) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.search({
        'filter[search]': query,
      });
      if (responsedDataFromLibary?.assets || responsedDataFromLibary?.collections) {
        const homeDataModels = BiUtils.transformResponseIntoSearchItems([
          ...responsedDataFromLibary?.assets,
          ...responsedDataFromLibary?.collections,
        ]);

        return homeDataModels;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
