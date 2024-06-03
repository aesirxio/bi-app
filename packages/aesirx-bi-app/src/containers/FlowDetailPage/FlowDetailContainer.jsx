import React, { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { useFlowViewModel } from './FlowViewModels/FlowViewModelContextProvider';
import { useParams, withRouter } from 'react-router-dom';
import Card from './Components/Card';
import { env } from 'aesirx-lib';
import { BI_FLOW_DETAIL_KEY } from 'aesirx-lib';
import moment from 'moment';
import { Col, Image, Row } from 'react-bootstrap';
import { BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AesirXSelect, PAGE_STATUS, RingLoaderComponent, history } from 'aesirx-uikit';
import queryString from 'query-string';
import _ from 'lodash';
import axios from 'axios';

const FlowDetailContainer = observer((props) => {
  const [fetchOG, setFetchOG] = useState([]);
  const { t } = useTranslation();
  const {
    flowDetailViewModel: {
      data = [],
      relatedVisitorData,
      getFlowDetail,
      getEvents,
      getConversion,
      dataEvents,
      dataConversion,
      status,
    },
  } = useFlowViewModel();
  const {
    biListViewModel: { activeDomain, dateFilter, dataFilter, integrationLink, setIntegrationLink },
  } = useBiViewModel();
  const { uuid } = useParams();
  const params = queryString.parse(props.location.search);
  const uuidDetail = props.integration
    ? integrationLink?.split('&id=')[1]
      ? integrationLink?.split('&id=')[1]
      : params?.id
    : uuid;
  useEffect(() => {
    const execute = async () => {
      await getFlowDetail(uuidDetail, {
        'with[]': 'events',
      });
      await getEvents({
        'filter[domain]': activeDomain,
        'with[]': 'events',
      });
      await getConversion({
        'filter[domain]': activeDomain,
        'with[]': 'events',
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);

  const getOG = async (url) => {
    try {
      const response = await axios.get(url);
      const parser = new DOMParser();
      const doc = parser.parseFromString(response?.data, 'text/html');
      const ogImageTag = doc.querySelector('meta[property="og:image"]');
      const webTitle = doc.querySelector('title');
      return {
        url,
        image: ogImageTag ? ogImageTag.getAttribute('content') : null,
        title: webTitle ? webTitle.innerText : null,
      };
    } catch (error) {
      return {
        url,
      };
    }
  };

  useEffect(() => {
    const getListOG = async () => {
      if (relatedVisitorData?.data?.length && !fetchOG?.length) {
        const listFetchs = relatedVisitorData.data.reduce((acc, cur) => {
          const isExisted = acc.some((i) => i == cur.url);
          if (!isExisted) {
            acc.push(cur.url);
          }
          return acc;
        }, []);
        const listOG = await Promise.all(
          listFetchs.map(async (url) => {
            return await getOG(url);
          })
        );
        setFetchOG(listOG);
      }
    };
    getListOG();
  }, [relatedVisitorData?.data]);

  const CardData = useMemo(
    () => [
      // {
      //   className: 'col-4',
      //   title: t('txt_location'),
      //   icon: env.PUBLIC_URL + '/assets/images/location.svg',
      //   iconColor: '#1AB394',
      //   value: data?.[BI_FLOW_DETAIL_KEY.LOCATION]?.country?.name ?? 'unDetected',
      // },
      {
        className: 'col-4',
        title: t('txt_total_conversions'),
        icon: env.PUBLIC_URL + '/assets/images/action.svg',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.CONVERSION] ?? 0,
      },
      {
        className: 'col-4',
        title: t('txt_total_events'),
        icon: env.PUBLIC_URL + '/assets/images/click.png',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.EVENT] ?? 0,
      },
      {
        className: 'col-4',
        title: t('txt_total_actions'),
        icon: env.PUBLIC_URL + '/assets/images/aim.svg',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.ACTION] ?? 0,
      },
    ],
    [data]
  );
  const LeftTableData = useMemo(
    () => [
      {
        text: t('txt_date'),
        value: data?.[BI_FLOW_DETAIL_KEY.START]
          ? moment.utc(data?.[BI_FLOW_DETAIL_KEY.START]).format('DD-MM-YYYY hh:mm:ss')
          : '',
      },
      {
        text: t('txt_domain'),
        value: data?.[BI_FLOW_DETAIL_KEY.DOMAIN] ?? '',
      },
      {
        text: t('txt_locale'),
        value: data?.[BI_FLOW_DETAIL_KEY.GEO]?.country?.name ?? 'unDetected',
      },
      {
        text: t('txt_device'),
        value: data?.[BI_FLOW_DETAIL_KEY.DEVICE] ?? '',
      },
      {
        text: t('txt_browser'),
        value: data?.[BI_FLOW_DETAIL_KEY.BROWSER_NAME] ?? '',
      },
      {
        text: t('txt_duration'),
        value: moment.utc(data?.[BI_FLOW_DETAIL_KEY.DURATION] * 1000).format('mm:ss') ?? 0,
      },
      {
        text: 'UX %',
        value: (data?.[BI_FLOW_DETAIL_KEY.UX_PERCENT] ?? 0) + '%',
      },
      {
        text: t('txt_page_view'),
        value: data?.[BI_FLOW_DETAIL_KEY.PAGE_VIEW] ?? 0,
      },
    ],
    [data]
  );
  const handleChangeLink = (e, link) => {
    e.preventDefault();
    if (link) {
      setIntegrationLink(link);
    }
  };

  const onSelectionChangeEvent = async (data) => {
    await getFlowDetail(uuidDetail, {
      'with[]': 'events',
      'filter[event_name]': data?.value,
    });
  };

  const debouncedChangeHandler = _.debounce(async (value) => {
    await getFlowDetail(uuidDetail, {
      'with[]': 'events',
      'filter[url]': value.target?.value
        ? `https://${activeDomain}/${value.target?.value}`
        : 'clearDataFilter',
    });
  }, 400);

  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="position-relative d-flex align-items-center mb-3">
        <div
          className={`back_icon d-flex align-items-center justify-content-center cursor-pointer me-1`}
          onClick={(e) => {
            if (props.integration) {
              handleChangeLink(e, `flow-list`);
            } else {
              history.push(
                `/flow-list?date_end=${dateFilter?.date_end}&date_start=${
                  dateFilter?.date_start
                }&domain=${activeDomain}&pagination=${
                  dataFilter?.pagination ? dataFilter?.pagination : '1'
                }`
              );
            }
          }}
        >
          <FontAwesomeIcon className={`text-success`} icon={faChevronLeft} />
        </div>
        <h2 className="fw-bold mb-0">{t('txt_visitor_detail')}</h2>
      </div>
      <div className="row gx-24 ">
        <div className="col-3">
          <div className="bg-white p-24 shadow-sm rounded-3">
            {LeftTableData?.length
              ? LeftTableData.map((item, index) => (
                  <div
                    key={index}
                    className={`d-flex justify-content-between ${
                      LeftTableData.length - 1 === index ? '' : 'mb-3'
                    } `}
                  >
                    <span className="fw-semibold">{item.text}</span>
                    <span>{item.value}</span>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="col-9">
          <Card loading={status} data={CardData} />
          <Row className="mb-2">
            {dataEvents?.toEventsList()?.length && (
              <Col lg="2" className="mb-2 mb-lg-0">
                <AesirXSelect
                  defaultValue={{ label: 'All Events', value: 'all' }}
                  options={dataEvents?.toEventsList()}
                  className={`fs-sm`}
                  isBorder={true}
                  onChange={(data) => {
                    onSelectionChangeEvent(data);
                  }}
                  plColor={'#808495'}
                  isSearchable={false}
                />
              </Col>
            )}
            {dataConversion?.toConversionList()?.length && (
              <Col lg="2" className="mb-2 mb-lg-0">
                <AesirXSelect
                  defaultValue={{ label: 'All Conversions', value: 'all' }}
                  options={dataConversion?.toConversionList()}
                  className={`fs-sm`}
                  isBorder={true}
                  onChange={(data) => {
                    onSelectionChangeEvent(data);
                  }}
                  plColor={'#808495'}
                  isSearchable={false}
                />
              </Col>
            )}
            <Col lg="6" className="mb-2 mb-lg-0">
              <span className="search_url d-flex position-relative border rounded-2">
                <div className="px-2 bg-gray-400 d-flex align-items-center">
                  https://{activeDomain}/
                </div>
                <input
                  placeholder={t('txt_search_url')}
                  onChange={debouncedChangeHandler}
                  className="form-control pe-2 pe-4 fs-14 border-0 shadow-none p-2"
                />
                <i className="text-green position-absolute top-0 bottom-0 end-0 pe-24 d-flex align-items-center">
                  <FontAwesomeIcon icon={faSearch} />
                </i>
              </span>
            </Col>
          </Row>

          {relatedVisitorData?.data?.length ? (
            <div className="bg-white p-24 position-relative ChartWrapper">
              {status === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : (
                <>
                  {relatedVisitorData?.data?.map((item, key) => {
                    const ogData = fetchOG.find((i) => item.url == i.url);
                    return (
                      <div className="d-flex align-items-center mb-24 flow-detail-item" key={key}>
                        <div className="flow-detail-item-image me-18px">
                          <Image
                            className={`object-fit-cover rounded-3 overflow-hidden`}
                            style={{ width: 148, height: 95 }}
                            src={
                              ogData?.image ? ogData?.image : `/assets/images/default_preview.jpg`
                            }
                            alt={'icons'}
                          />
                        </div>
                        <div className="flow-detail-item-content d-flex flex-wrap">
                          <div className="fs-14 w-100" style={{ color: '#5F5E70' }}>
                            {moment(item[BI_VISITOR_FIELD_KEY.START_DATE])
                              ?.utc()
                              ?.format('HH:mm:ss')}
                          </div>
                          <div className="d-flex mb-sm fs-14 fw-medium">
                            <div
                              className={`flow_detail_item_content_action ${
                                item[BI_VISITOR_FIELD_KEY.EVENT_TYPE]
                              } text-white text-capitalize`}
                            >
                              {item[BI_VISITOR_FIELD_KEY.EVENT_TYPE] === 'action'
                                ? t('txt_visitor')
                                : item[BI_VISITOR_FIELD_KEY.EVENT_TYPE] === 'conversion'
                                ? t('txt_conversion')
                                : t('txt_event')}
                            </div>
                            <span className="flow_detail_item_content_name ms-sm">
                              {item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === 'visit'
                                ? 'Visited'
                                : item[BI_VISITOR_FIELD_KEY.EVENT_NAME]}
                            </span>
                          </div>
                          {ogData?.title && (
                            <p className="mb-0 fw-medium w-100 lh-base text-gray-heading fs-14">
                              {ogData.title}
                            </p>
                          )}
                          <div className="w-100">
                            <a
                              href={`${item[BI_VISITOR_FIELD_KEY.URL]}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`flow_detail_item_content_link fw-semibold`}
                            >
                              {item[BI_VISITOR_FIELD_KEY.URL]}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
});

export default withRouter(FlowDetailContainer);
