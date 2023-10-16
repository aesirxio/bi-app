/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

class DashBoardUtils {
  transformPersonaResponseIntoModel = (response) => {
    return response[0] ?? {};
  };

  transformResponseIntoSearchItems = (response) => {
    return response;
  };
}

export default DashBoardUtils;
