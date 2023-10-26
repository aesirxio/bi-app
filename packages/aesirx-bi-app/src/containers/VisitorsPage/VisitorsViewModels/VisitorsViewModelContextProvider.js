/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const VisitorsViewModelContext = React.createContext();

export const VisitorsViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <VisitorsViewModelContext.Provider value={viewModel}>
      {children}
    </VisitorsViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useVisitorsViewModel = () => React.useContext(VisitorsViewModelContext);

/* HOC to inject store to any functional or class component */
export const withVisitorsViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useVisitorsViewModel()} />;
};
