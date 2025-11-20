/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { UserStore } from '../store';
import UserViewModel from './UserViewModel';

const userStore = new UserStore();
const userViewModel = new UserViewModel(userStore);

export const UserViewModelContext = React.createContext({
  model: userViewModel,
});

export const UserViewModelContextProvider = ({ children }) => {
  return (
    <UserViewModelContext.Provider value={{ model: userViewModel }}>
      {children}
    </UserViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useUserViewModel = () => React.useContext(UserViewModelContext);

/* HOC to inject store to any functional or class component */
export const withUserViewModel = (Component) => (props) => {
  return <Component {...props} {...useUserViewModel()} />;
};
