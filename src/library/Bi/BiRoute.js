/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import AesirxApiInstance from '../gateway/Instance';
import BaseRoute from '../Abstract/BaseRoute';
import dashboard from '../DataStatic/dashboard';
import domains from '../DataStatic/domains';

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
  getListDomain = () => {
    return domains;
  };
  getVisitor = (dataFilter) => {
    return AesirxApiInstance.get(
      this.createRequestURL({
        view: 'visitor',
        option: 'reditem',
        ...dataFilter,
      })
    );
  };
  getSummary = (dataFilter) => {
    return AesirxApiInstance.get(
      this.createRequestURL({
        view: 'visitsummary',
        task: 'summary',
        option: 'reditem',
        ...dataFilter,
      })
    );
  };
}

export default BiRoute;
