/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const BehaviorViewModelContext = React.createContext();

export const BehaviorViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <BehaviorViewModelContext.Provider value={viewModel}>
      {children}
    </BehaviorViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useBehaviorViewModel = () => React.useContext(BehaviorViewModelContext);

/* HOC to inject store to any functional or class component */
export const withBehaviorViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useBehaviorViewModel()} />;
};
