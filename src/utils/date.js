/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { FORMAT_DATE, FORMAT_TIME } from '../constants/FormFieldType';
import { addMilliseconds, format, fromUnixTime } from 'date-fns';
import { getTimezoneOffset } from 'date-fns-tz';
import Helper from './helper';
import moment from 'moment';

const timezone = Helper.getTimezoneDefault();

const formatDate = (date, withTime = false, convert = true) => {
  date = new Date(date);

  if (convert) {
    const offset = getTimezoneOffset(timezone);
    date = addMilliseconds(date, offset);
  }

  const f = `${FORMAT_DATE} ${withTime ? ` ${FORMAT_TIME}` : ''}`;
  return format(date, f);
};

const formatUnix = (timestamp, withTime = false) => {
  return formatDate(fromUnixTime(timestamp), withTime, false);
};

const enumerateDaysBetweenDates = function (startDate, endDate) {
  let dates = [];

  const currDate = moment(startDate).startOf('day');
  const lastDate = moment(endDate).startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.clone().format('YYYY-MM-DD'));
  }

  return dates;
};

export { formatDate, formatUnix, enumerateDaysBetweenDates };
