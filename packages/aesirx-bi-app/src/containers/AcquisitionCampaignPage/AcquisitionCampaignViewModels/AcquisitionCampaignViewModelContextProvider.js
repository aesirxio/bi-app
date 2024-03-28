/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const AcquisitionCampaignViewModelContext = React.createContext();

export const AcquisitionCampaignViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <AcquisitionCampaignViewModelContext.Provider value={viewModel}>
      {children}
    </AcquisitionCampaignViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useAcquisitionCampaignViewModel = () =>
  React.useContext(AcquisitionCampaignViewModelContext);

/* HOC to inject store to any functional or class component */
export const withAcquisitionCampaignViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useAcquisitionCampaignViewModel()} />;
};
