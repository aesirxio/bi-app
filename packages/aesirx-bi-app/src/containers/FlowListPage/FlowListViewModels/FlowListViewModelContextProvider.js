/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const FlowListViewModelContext = React.createContext();

export const FlowListViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <FlowListViewModelContext.Provider value={viewModel}>
      {children}
    </FlowListViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useFlowListViewModel = () => React.useContext(FlowListViewModelContext);

/* HOC to inject store to any functional or class component */
export const withFlowListViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useFlowListViewModel()} />;
};
