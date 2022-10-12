/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import {
  // AssetsModel,
  // ColectionModel,
  DashboardModel,
  // CollectionItemModel,
  // SubscriptionModel,
} from './BiModel';
import BiRoute from './BiRoute';
import { Component } from 'react';
import axios from 'axios';

/**
 * API Service - Member
 */
class AesirxBiApiService extends Component {
  route = null;

  constructor(props) {
    super(props);
    this.route = new BiRoute();
  }

  // search = async (data) => {
  //   try {
  //     const dataSearchAssets = await this.route.searchAssets(data);
  //     const dataSearchCollections = await this.route.searchCollections(data);

  //     let resultsAssets = null;
  //     let resultCollection = null;
  //     if (dataSearchAssets) {
  //       resultsAssets = new AssetsModel(dataSearchAssets);
  //     }
  //     if (dataSearchCollections) {
  //       resultCollection = new ColectionModel(dataSearchCollections);
  //     }
  //     if (resultsAssets) {
  //       resultsAssets = resultsAssets.toJSON();
  //     }
  //     if (resultCollection) {
  //       resultCollection = resultCollection.toJSON();
  //     }
  //     return {
  //       assets: resultsAssets ?? [],
  //       collections: resultCollection ?? [],
  //     };
  //   } catch (error) {
  //     if (axios.isCancel(error)) {
  //       return { message: 'isCancle' };
  //     } else throw error;
  //   }
  // };

  getDashboard = async () => {
    try {
      const data = await this.route.getDashboard();

      let results = null;
      if (data) {
        results = new DashboardModel(data.result);
      }
      if (results) {
        results = results.toJSON();
      }
      return results;
    } catch (error) {
      if (axios.isCancel(error)) {
        return { message: 'isCancle' };
      } else throw error;
    }
  };

  // getCollections = async (id = 0) => {
  //   try {
  //     const data = await this.route.getCollections(id);
  //     let results = null;
  //     let pagination = null;
  //     if (data) {
  //       results = new ColectionModel(data);
  //       pagination = results.getPagination();
  //     }
  //     if (results) {
  //       results = results.toJSON();
  //     }

  //     return {
  //       list: results ?? [],
  //       pagination: pagination ?? {},
  //     };
  //   } catch (error) {
  //     if (axios.isCancel(error)) {
  //       return { message: 'isCancle' };
  //     } else throw error;
  //   }
  // };
}

export default AesirxBiApiService;
