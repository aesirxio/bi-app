/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const EventsDetailViewModelContext = React.createContext();

export const EventsDetailViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <EventsDetailViewModelContext.Provider value={viewModel}>
      {children}
    </EventsDetailViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useEventsDetailViewModel = () => React.useContext(EventsDetailViewModelContext);

/* HOC to inject store to any functional or class component */
export const withEventsDetailViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useEventsDetailViewModel()} />;
};
