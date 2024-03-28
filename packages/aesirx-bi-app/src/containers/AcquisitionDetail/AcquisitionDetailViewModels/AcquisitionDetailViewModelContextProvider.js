/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const AcquisitionDetailViewModelContext = React.createContext();

export const AcquisitionDetailViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <AcquisitionDetailViewModelContext.Provider value={viewModel}>
      {children}
    </AcquisitionDetailViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useAcquisitionDetailViewModel = () =>
  React.useContext(AcquisitionDetailViewModelContext);

/* HOC to inject store to any functional or class component */
export const withAcquisitionDetailViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useAcquisitionDetailViewModel()} />;
};
