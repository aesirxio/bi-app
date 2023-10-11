/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const FlowViewModelContext = React.createContext();

export const FlowViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <FlowViewModelContext.Provider value={viewModel}>{children}</FlowViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useFlowViewModel = () => React.useContext(FlowViewModelContext);

/* HOC to inject store to any functional or class component */
export const withFlowViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useFlowViewModel()} />;
};
