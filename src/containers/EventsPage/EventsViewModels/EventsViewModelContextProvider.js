/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
export const EventsViewModelContext = React.createContext();

export const EventsViewModelContextProvider = ({ children, viewModel }) => {
  return (
    <EventsViewModelContext.Provider value={viewModel}>{children}</EventsViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useEventsViewModel = () => React.useContext(EventsViewModelContext);

/* HOC to inject store to any functional or class component */
export const withEventsViewModel = (Component) => (props) => {
  return <Component {...props} viewModel={useEventsViewModel()} />;
};
