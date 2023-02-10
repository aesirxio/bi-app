/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { runInAction } from 'mobx';
import BiUtils from './BiUtils';

import { AesirxBiApiService } from 'aesirx-dma-lib';
export default class BiStore {
  getListDomain = async (dataFilter, listDomains, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.getListDomain(dataFilter, listDomains);
      if (responsedDataFromLibary) {
        const homeDataModels = BiUtils.transformPersonaResponseIntoModel(responsedDataFromLibary);

        if (homeDataModels) {
          runInAction(() => {
            callbackOnSuccess(homeDataModels);
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
      console.log('errorrrr', error);
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

  getDashboard = async (dataFilter, callbackOnSuccess, callbackOnError) => {
    try {
      const biService = new AesirxBiApiService();
      const responsedDataFromLibary = await biService.getDashboard(dataFilter);
      if (responsedDataFromLibary) {
        const homeDataModels = BiUtils.transformPersonaResponseIntoModel(responsedDataFromLibary);

        if (homeDataModels) {
          runInAction(() => {
            callbackOnSuccess(homeDataModels);
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
      console.log('errorrrr', error);
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
}
