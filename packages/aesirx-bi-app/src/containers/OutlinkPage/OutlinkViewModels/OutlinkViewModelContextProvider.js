/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const OutlinkViewModelContext = React.createContext();

export const OutlinkViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <OutlinkViewModelContext.Provider value={viewModel}>
      {children}
    </OutlinkViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useOutlinkViewModel = () => React.useContext(OutlinkViewModelContext);

/* HOC to inject store to any functional or class component */
export const withOutlinkViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useOutlinkViewModel()} />;
};
