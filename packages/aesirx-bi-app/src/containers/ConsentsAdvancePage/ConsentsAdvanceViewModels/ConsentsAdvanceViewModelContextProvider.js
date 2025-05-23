/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const ConsentsAdvanceViewModelContext = React.createContext();

export const ConsentsAdvanceViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <ConsentsAdvanceViewModelContext.Provider value={viewModel}>
      {children}
    </ConsentsAdvanceViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useConsentsAdvanceViewModel = () => React.useContext(ConsentsAdvanceViewModelContext);

/* HOC to inject store to any functional or class component */
export const withConsentsAdvanceViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useConsentsAdvanceViewModel()} />;
};
