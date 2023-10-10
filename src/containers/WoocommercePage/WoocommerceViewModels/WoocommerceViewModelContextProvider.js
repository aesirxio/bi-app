/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const WoocommerceViewModelContext = React.createContext();

export const WoocommerceViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <WoocommerceViewModelContext.Provider value={viewModel}>
      {children}
    </WoocommerceViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useWoocommerceViewModel = () => React.useContext(WoocommerceViewModelContext);

/* HOC to inject store to any functional or class component */
export const withWoocommerceViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useWoocommerceViewModel()} />;
};
