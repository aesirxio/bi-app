/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import UTMTrackingEventModel from '../UTMTrackingModel/UTMTrackingListEventModel';

class UTMTrackingUtils {
  transformResponseIntoAreaChart = (response) => {
    let data = {};
    response.forEach((item) => {
      const dataFilterEventName = response.filter(
        (_item) => _item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === item[BI_VISITOR_FIELD_KEY.EVENT_NAME]
      );
      data = {
        ...data,
        [item[BI_VISITOR_FIELD_KEY.EVENT_NAME]]: dataFilterEventName,
      };
    });
    return new UTMTrackingEventModel(data);
  };
}

export default UTMTrackingUtils;
