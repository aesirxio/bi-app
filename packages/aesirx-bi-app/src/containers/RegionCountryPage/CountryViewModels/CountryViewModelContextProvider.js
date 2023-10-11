/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const CountryViewModelContext = React.createContext();

export const CountryViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <CountryViewModelContext.Provider value={viewModel}>
      {children}
    </CountryViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useCountryViewModel = () => React.useContext(CountryViewModelContext);

/* HOC to inject store to any functional or class component */
export const withCountryViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useCountryViewModel()} />;
};
