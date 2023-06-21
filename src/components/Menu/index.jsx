/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';

import { Menu as AesirXMenu } from 'aesirx-uikit';
import { mainMenu } from 'routes/menu';

const Menu = () => {
  return <AesirXMenu dataMenu={mainMenu} />;
};

export default Menu;
