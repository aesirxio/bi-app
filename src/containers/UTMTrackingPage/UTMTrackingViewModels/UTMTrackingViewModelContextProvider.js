/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const UTMTrackingViewModelContext = React.createContext();

export const UTMTrackingViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <UTMTrackingViewModelContext.Provider value={viewModel}>
      {children}
    </UTMTrackingViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useUTMTrackingViewModel = () => React.useContext(UTMTrackingViewModelContext);

/* HOC to inject store to any functional or class component */
export const withUTMTrackingViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useUTMTrackingViewModel()} />;
};
