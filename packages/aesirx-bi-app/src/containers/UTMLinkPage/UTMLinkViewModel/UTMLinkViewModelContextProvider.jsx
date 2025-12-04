/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { UTMLinkStore } from '../store';
import UTMLinkViewModel from './UTMLinkViewModel';

const utmLinkStore = new UTMLinkStore();
const utmLinkViewModel = new UTMLinkViewModel(utmLinkStore);

export const UTMLinkViewModelContext = React.createContext({
  model: utmLinkViewModel,
});

export const UTMLinkViewModelContextProvider = ({ children, globalViewModel }) => {
  return (
    <UTMLinkViewModelContext.Provider
      value={{ model: utmLinkViewModel, globalViewModel: globalViewModel }}
    >
      {children}
    </UTMLinkViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useUTMLinkViewModel = () => React.useContext(UTMLinkViewModelContext);

/* HOC to inject store to any functional or class component */
export const withUTMLinkViewModel = (Component) => (props) => {
  return <Component {...props} {...useUTMLinkViewModel()} />;
};
