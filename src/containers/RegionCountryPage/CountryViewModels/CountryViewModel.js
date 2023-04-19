/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import CountryListViewModel from './CountryListViewModel';

class CountryViewModel {
  countryListViewModel = null;

  constructor(countryStore, globalStore) {
    if (countryStore) {
      this.countryListViewModel = new CountryListViewModel(countryStore, globalStore);
    }
  }
  getCountryListViewModel = () => this.countryListViewModel;
}

export default CountryViewModel;
