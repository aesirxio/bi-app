/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const AcquisitionViewModelContext = React.createContext();

export const AcquisitionViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <AcquisitionViewModelContext.Provider value={viewModel}>
      {children}
    </AcquisitionViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useAcquisitionViewModel = () => React.useContext(AcquisitionViewModelContext);

/* HOC to inject store to any functional or class component */
export const withAcquisitionViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useAcquisitionViewModel()} />;
};
