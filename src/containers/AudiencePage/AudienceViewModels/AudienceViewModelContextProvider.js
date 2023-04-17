/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const AudienceViewModelContext = React.createContext();

export const AudienceViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <AudienceViewModelContext.Provider value={viewModel}>
      {children}
    </AudienceViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useAudienceViewModel = () => React.useContext(AudienceViewModelContext);

/* HOC to inject store to any functional or class component */
export const withAudienceViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useAudienceViewModel()} />;
};
