/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const SearchEngineViewModelContext = React.createContext();

export const SearchEngineViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <SearchEngineViewModelContext.Provider value={viewModel}>
      {children}
    </SearchEngineViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useSearchEngineViewModel = () => React.useContext(SearchEngineViewModelContext);

/* HOC to inject store to any functional or class component */
export const withSearchEngineViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useSearchEngineViewModel()} />;
};
