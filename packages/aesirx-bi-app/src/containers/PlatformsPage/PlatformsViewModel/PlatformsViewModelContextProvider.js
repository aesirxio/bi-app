/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const PlatformsViewModelContext = React.createContext();

export const PlatformsViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <PlatformsViewModelContext.Provider value={viewModel}>
      {children}
    </PlatformsViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePlatformsViewModel = () => React.useContext(PlatformsViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPlatformsViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={usePlatformsViewModel()} />;
};
