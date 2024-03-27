/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const UserFlowViewModelContext = React.createContext();

export const UserFlowViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <UserFlowViewModelContext.Provider value={viewModel}>
      {children}
    </UserFlowViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useUserFlowViewModel = () => React.useContext(UserFlowViewModelContext);

/* HOC to inject store to any functional or class component */
export const withUserFlowViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useUserFlowViewModel()} />;
};
