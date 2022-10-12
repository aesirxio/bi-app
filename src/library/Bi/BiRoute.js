/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

// import AesirxApiInstance from '../gateway/Instance';
import BaseRoute from '../Abstract/BaseRoute';
import dashboard from '../DataStatic/dashboard';

class BiRoute extends BaseRoute {
  getDashboard = () => {
    return dashboard;
    // return AesirxApiInstance.get(
    //   this.createRequestURL({
    //     option: 'dashboard',
    //     ...dataFilter,
    //   })
    // );
  };
}

export default BiRoute;
