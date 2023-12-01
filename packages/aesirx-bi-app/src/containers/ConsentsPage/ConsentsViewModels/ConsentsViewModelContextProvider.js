/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const ConsentsViewModelContext = React.createContext();

export const ConsentsViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <ConsentsViewModelContext.Provider value={viewModel}>
      {children}
    </ConsentsViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useConsentsViewModel = () => React.useContext(ConsentsViewModelContext);

/* HOC to inject store to any functional or class component */
export const withConsentsViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useConsentsViewModel()} />;
};
