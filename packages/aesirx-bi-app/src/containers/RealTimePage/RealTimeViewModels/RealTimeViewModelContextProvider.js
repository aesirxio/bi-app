/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const RealTimeViewModelContext = React.createContext();

export const RealTimeViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <RealTimeViewModelContext.Provider value={viewModel}>
      {children}
    </RealTimeViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useRealTimeViewModel = () => React.useContext(RealTimeViewModelContext);

/* HOC to inject store to any functional or class component */
export const withRealTimeViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useRealTimeViewModel()} />;
};
