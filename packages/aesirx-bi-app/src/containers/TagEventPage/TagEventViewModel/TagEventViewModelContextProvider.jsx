/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { TagEventStore } from '../store';
import TagEventViewModel from './TagEventViewModel';

const tagEventStore = new TagEventStore();
const tagEventViewModel = new TagEventViewModel(tagEventStore);

export const TagEventViewModelContext = React.createContext({
  model: tagEventViewModel,
});

export const TagEventViewModelContextProvider = ({ children, globalViewModel }) => {
  return (
    <TagEventViewModelContext.Provider
      value={{ model: tagEventViewModel, globalViewModel: globalViewModel }}
    >
      {children}
    </TagEventViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useTagEventViewModel = () => React.useContext(TagEventViewModelContext);

/* HOC to inject store to any functional or class component */
export const withTagEventViewModel = (Component) => (props) => {
  return <Component {...props} {...useTagEventViewModel()} />;
};
