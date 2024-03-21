/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */
import React from 'react';
import moment from 'moment';
import {
  BI_BROWSERS_FIELD_KEY,
  BI_DEVICES_FIELD_KEY,
  BI_SUMMARY_FIELD_KEY,
  BI_VISITORS_FIELD_KEY,
  Helper,
  enumerateDaysBetweenDates,
  env,
} from 'aesirx-lib';
import { Image } from 'react-bootstrap';
import { BI_REFERER_FIELD_KEY } from 'aesirx-lib';

class PageDetailModel {
  data = [];
  globalViewModel = null;
  constructor(entity, globalViewModel) {
    if (entity) {
      this.data = entity ?? [];
      this.globalViewModel = globalViewModel;
    }
  }

  toRaw = () => {
    return this.data;
  };

  toAreaChart = () => {
    const twelveMonth = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dateRange = enumerateDaysBetweenDates(
      this.globalViewModel?.dateFilter?.date_start,
      this.globalViewModel?.dateFilter?.date_end
    );

    const date = dateRange.map((date) => {
      const filterDate = this.data.find(
        (_item) => moment(_item.date).format('YYYY-MM-DD') === date
      );
      return {
        name: date && moment(date, 'YYYY-MM-DD').format('DD MMM'),
        visits: filterDate?.[BI_VISITORS_FIELD_KEY.VISITS] ?? 0,
        page_views: filterDate?.[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS] ?? 0,
        unique_visits: filterDate?.['unique_visits'] ?? 0,
      };
    });

    const month = twelveMonth.map((month, index) => {
      const filterMonthDate = this.data.filter((_item) => moment(_item?.date).month() === index);
      let totalVisitorCount = 0;
      let totalPageViewCount = 0;
      let totalUniqueVisitorCount = 0;
      if (filterMonthDate) {
        totalVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.VISITS],
          0
        );
        totalPageViewCount = filterMonthDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS],
          0
        );
        totalUniqueVisitorCount = filterMonthDate.reduce(
          (acc, item) => acc + item['unique_visits'],
          0
        );
      }

      return {
        name: month,
        visits: totalVisitorCount,
        page_views: totalPageViewCount,
        unique_visits: totalUniqueVisitorCount,
      };
    });

    const weekData = {};

    dateRange.forEach((date) => {
      const startOfWeek = moment(date).startOf('isoWeek');
      const endOfWeek = moment(date).endOf('isoWeek');
      const weekName = `${startOfWeek.format('DD MMM')} - ${endOfWeek.format('DD MMM')}`;

      if (!weekData[weekName]) {
        weekData[weekName] = {
          visits: 0,
          page_views: 0,
          unique_visits: 0,
        };
      }

      const filterWeekDate = this.data.filter((item) =>
        moment(item?.date).isBetween(startOfWeek, endOfWeek, null, '[]')
      );

      if (filterWeekDate) {
        const totalVisitorCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.VISITS],
          0
        );
        const totalPageViewCount = filterWeekDate.reduce(
          (acc, item) => acc + item[BI_VISITORS_FIELD_KEY.TOTAL_PAGE_VIEWS],
          0
        );
        const totalUniqueVisitorCount = filterWeekDate.reduce(
          (acc, item) => acc + item['unique_visits'],
          0
        );

        weekData[weekName].visits += totalVisitorCount;
        weekData[weekName].page_views += totalPageViewCount;
        weekData[weekName].unique_visits += totalUniqueVisitorCount;
      }
    });

    // Convert object to array format
    const week = Object.keys(weekData).map((weekName) => ({
      name: weekName,
      visits: weekData[weekName].visits,
      page_views: weekData[weekName].page_views,
      unique_visits: weekData[weekName].unique_visits,
    }));

    return [{ visitors: month }, { visitors: date }, { visitors: week }];
  };

  getFilterName = () => {
    return [{ label: 'Visitors', value: 'visitors' }];
  };

  toBrowsersTableTop = () => {
    const headerTable = ['txt_browser', 'txt_visitors', '%'];
    const largestValue = Math.max(
      ...this.data.map((o) => o[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS])
    );
    const accessor = [
      BI_BROWSERS_FIELD_KEY.BROWSER_NAME,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS,
      BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS_PERCENT,
    ];
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          width:
            key === BI_BROWSERS_FIELD_KEY.BROWSER_NAME
              ? 250
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 100,
          Cell: ({ cell, column, row }) => {
            let browserImg = '';
            switch (cell?.value) {
              case 'Chrome':
                browserImg = '/assets/images/chrome.svg';
                break;
              case 'Safari':
                browserImg = '/assets/images/safari.svg';
                break;
              case 'Firefox':
                browserImg = '/assets/images/firefox.svg';
                break;
              case 'Microsoft Edge':
                browserImg = '/assets/images/microsoft_edge.svg';
                break;
              case 'Opera':
                browserImg = '/assets/images/opera.svg';
                break;
              case 'Samsung Internet for Android':
                browserImg = '/assets/images/samsung_browser.svg';
                break;
              case 'Googlebot':
                browserImg = '/assets/images/google_bot.svg';
                break;
              case 'Yandex Browser':
                browserImg = '/assets/images/yandex_browser.svg';
                break;
            }
            return (
              <>
                {column.id === BI_BROWSERS_FIELD_KEY.BROWSER_NAME ? (
                  <div className={'d-flex align-items-center py-sm px-20 position-relative'}>
                    <div
                      className="position-absolute top-0 start-0 h-100 z-0"
                      style={{
                        backgroundColor: '#E7EFFF',
                        width: `${((row.cells[1]?.value / largestValue) * 100)?.toString()}%`,
                      }}
                    ></div>
                    <div className="z-1">
                      {browserImg && (
                        <Image
                          className={`me-12px`}
                          style={{ width: 22, height: 22 }}
                          src={env.PUBLIC_URL + browserImg}
                          alt={'icons'}
                        />
                      )}
                      {cell?.value === '' ? 'Unknown' : cell?.value}
                    </div>
                  </div>
                ) : column.id === BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS_PERCENT ? (
                  <div className={'text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
                ) : (
                  <div className={'text-end pe-2'}>
                    {Helper.numberWithCommas(cell?.value) ?? null}
                  </div>
                )}
              </>
            );
          },
        };
      });
      const data = this.data?.map((item) => {
        item[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS_PERCENT] =
          item[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS_PERCENT] / 10;
        return {
          ...item,
          ...accessor
            .map((i) => {
              return {
                [i]: item[i],
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });
      return {
        header,
        data: filteredData,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };

  toDevicesTableTop = () => {
    const headerTable = ['txt_device', 'txt_visitors'];
    const accessor = [BI_DEVICES_FIELD_KEY.DEVICE, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    const largestValue = Math.max(
      ...this.data.map((o) => o[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS])
    );
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          width:
            key === BI_DEVICES_FIELD_KEY.DEVICE
              ? 250
              : key === BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS
              ? 220
              : 170,
          Cell: ({ cell, column, row }) => {
            return (
              <>
                {column.id === BI_DEVICES_FIELD_KEY.DEVICE ? (
                  <div
                    className={
                      'd-flex align-items-center text-capitalize py-sm px-20 position-relative'
                    }
                  >
                    <div
                      className="position-absolute top-0 start-0 h-100 z-0"
                      style={{
                        backgroundColor: '#E7EFFF',
                        width: `${((row.cells[1]?.value / largestValue) * 100)?.toString()}%`,
                      }}
                    ></div>
                    <div className="z-1">{cell?.value === '' ? 'Unknown' : cell?.value}</div>
                  </div>
                ) : (
                  <div className={' text-end'}>{Helper.numberWithCommas(cell?.value) ?? null}</div>
                )}
              </>
            );
          },
        };
      });
      const data = this.data?.map((item) => {
        return {
          ...item,
          ...accessor
            .map((i) => {
              return {
                [i]: item[i],
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });
      const filteredData = data?.map((obj) => {
        for (let prop in obj) {
          if (!accessor.includes(prop)) {
            delete obj[prop];
          }
        }
        return obj;
      });

      return {
        header,
        data: filteredData,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };

  toSourcesTableTopPageDetail = () => {
    const headerTable = ['txt_source', 'txt_visitors'];
    const accessor = [BI_REFERER_FIELD_KEY.REFERER, BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS];
    const largestValue = Math.max(
      ...this.data.map((o) => o[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS])
    );
    if (this.data?.length) {
      const header = accessor.map((key, index) => {
        return {
          Header: headerTable[index],
          accessor: key,
          allowSort: true,
          Cell: ({ cell, column, row }) => {
            let imgIcon = ``;
            if (column.id === BI_REFERER_FIELD_KEY.REFERER) {
              if (cell?.value) {
                const url = new URL(cell?.value);
                imgIcon =
                  url?.hostname === 'aesirx.io'
                    ? `${env.PUBLIC_URL}/assets/images/logo/welcome-logo.png`
                    : ``;
              }
              switch (cell?.value) {
                case '':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/direct.png`;
                  break;
                case 'https://www.google.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/google.png`;
                  break;
                case 'https://www.facebook.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/facebook.png`;
                  break;
                case 'https://www.linkedin.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/linkedin.png`;
                  break;
                case 'https://yandex.ru/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/yandex.png`;
                  break;
                case 'https://duckduckgo.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/duckduckgo.svg`;
                  break;
                case 'https://www.reddit.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/reddit.png`;
                  break;
                case 'https://twitter.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/twitter.png`;
                  break;
                case 'https://github.com/':
                  imgIcon = `${env.PUBLIC_URL}/assets/images/github.png`;
                  break;
              }
            }

            return column.id === BI_REFERER_FIELD_KEY.REFERER ? (
              <a
                {...(cell?.value
                  ? {
                      target: '_blank',
                      rel: 'noreferrer',
                      href: `${cell?.value}`,
                    }
                  : {})}
                className={'d-block position-relative px-20 py-sm text-gray-900 table-link'}
              >
                <div
                  className="position-absolute top-0 start-0 h-100 z-0 table-link-bg"
                  style={{
                    width: `${((row.cells[1]?.value / largestValue) * 100)?.toString()}%`,
                  }}
                ></div>
                <div className="position-relative z-1 text-ellipsis line-clamp-1 pe-20">
                  <div className="position-relative table-link-text">
                    {imgIcon && (
                      <Image
                        className={`me-sm object-fit-contain`}
                        style={{ width: 22, height: 22 }}
                        src={env.PUBLIC_URL + imgIcon}
                        alt={'icons'}
                      />
                    )}
                    {/* {urlParams === '' ? 'Unknown' : urlParams.pathname + urlParams.search} */}
                    {cell?.value ? cell?.value : 'Direct / None'}
                  </div>
                </div>
              </a>
            ) : (
              <div className={'px-15 text-end'}>{cell?.value ?? null}</div>
            );
          },
        };
      });
      const data = this.data?.map((item) => {
        return {
          ...item,
          ...accessor
            .map((i) => {
              return {
                [i]: item[i],
              };
            })
            .reduce((accumulator, currentValue) => ({ ...currentValue, ...accumulator }), {}),
        };
      });

      return {
        header,
        data: data,
      };
    } else {
      return {
        header: [],
        data: [],
      };
    }
  };
}

export default PageDetailModel;
