/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import SearchEngineListViewModel from './SearchEngineListViewModel';

class SearchEngineViewModel {
  searchEngineListViewModel = null;

  constructor(searchEngineStore, globalStore) {
    if (searchEngineStore) {
      this.searchEngineListViewModel = new SearchEngineListViewModel(
        searchEngineStore,
        globalStore
      );
    }
  }
  getSearchEngineListViewModel = () => this.searchEngineListViewModel;
}

export default SearchEngineViewModel;
