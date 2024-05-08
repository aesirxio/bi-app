/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const ConsentsTemplateViewModelContext = React.createContext();

export const ConsentsTemplateViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <ConsentsTemplateViewModelContext.Provider value={viewModel}>
      {children}
    </ConsentsTemplateViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useConsentsTemplateViewModel = () =>
  React.useContext(ConsentsTemplateViewModelContext);

/* HOC to inject store to any functional or class component */
export const withConsentsTemplateViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useConsentsTemplateViewModel()} />;
};
