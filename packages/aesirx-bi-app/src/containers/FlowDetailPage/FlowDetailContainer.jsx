import React, { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react';
import { useBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { useFlowViewModel } from './FlowViewModels/FlowViewModelContextProvider';
import { useParams, withRouter } from 'react-router-dom';
import Card from './Components/Card';
import { env } from 'aesirx-lib';
import { BI_FLOW_DETAIL_KEY } from 'aesirx-lib';
import moment from 'moment';
import { Image } from 'react-bootstrap';
import { BI_VISITOR_FIELD_KEY } from 'aesirx-lib';
import styles from './index.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { history } from 'aesirx-uikit';

const FlowDetailContainer = observer((props) => {
  const { t } = useTranslation();
  const {
    flowDetailViewModel: { data = [], relatedVisitorData, getFlowDetail, status },
  } = useFlowViewModel();
  const {
    biListViewModel: { activeDomain, integrationLink, dateFilter, dataFilter },
  } = useBiViewModel();
  const { uuid } = useParams();
  const uuidDetail = props.integration ? integrationLink.split('/')[1] : uuid;
  useEffect(() => {
    const execute = async () => {
      await getFlowDetail(uuidDetail, {
        'with[]': 'events',
      });
    };
    execute();
    return () => {};
  }, [activeDomain]);

  const CardData = useMemo(
    () => [
      {
        className: 'col-4',
        title: t('txt_domain'),
        icon: env.PUBLIC_URL + '/assets/images/domain.svg',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.DOMAIN] ?? '',
      },
      // {
      //   className: 'col-4',
      //   title: t('txt_location'),
      //   icon: env.PUBLIC_URL + '/assets/images/location.svg',
      //   iconColor: '#1AB394',
      //   value: data?.[BI_FLOW_DETAIL_KEY.LOCATION]?.country?.name ?? 'unDetected',
      // },
      {
        className: 'col-4',
        title: t('txt_duration'),
        icon: env.PUBLIC_URL + '/assets/images/duration.png',
        iconColor: '#1AB394',
        value:
          moment
            .utc(
              moment
                .duration(
                  moment(data?.[BI_FLOW_DETAIL_KEY.END]).diff(
                    moment(data?.[BI_FLOW_DETAIL_KEY.START])
                  )
                )
                .asMilliseconds()
            )
            .format('HH:mm:ss') ?? 0,
      },
      {
        className: 'col-4',
        title: t('txt_actions'),
        icon: env.PUBLIC_URL + '/assets/images/click.png',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.EVENTS]?.length ?? 0,
      },
    ],
    [data]
  );
  const LeftTableData = useMemo(
    () => [
      {
        text: t('txt_date'),
        value: data?.[BI_FLOW_DETAIL_KEY.START]
          ? moment.utc(data?.[BI_FLOW_DETAIL_KEY.START]).format('DD/MM/YYYY hh:mm:ss')
          : '',
      },
      {
        text: t('txt_domain'),
        value: data?.[BI_FLOW_DETAIL_KEY.DOMAIN] ?? '',
      },
      {
        text: t('txt_locale'),
        value: data?.[BI_FLOW_DETAIL_KEY.LOCATION]?.country?.name ?? 'unDetected',
      },
      {
        text: t('txt_ip'),
        value: data?.[BI_FLOW_DETAIL_KEY.IP] ?? '',
      },
      {
        text: t('txt_device'),
        value: data?.[BI_FLOW_DETAIL_KEY.DEVICE] ?? '',
      },
      {
        text: t('txt_browser'),
        value: data?.[BI_FLOW_DETAIL_KEY.BROWSER_NAME] ?? '',
      },
    ],
    [data]
  );
  return (
    <div className="py-4 px-4 h-100 d-flex flex-column">
      <div className="position-relative d-flex align-items-center mb-3">
        <div
          className={`back_icon d-flex align-items-center justify-content-center cursor-pointer me-1`}
          onClick={() => {
            history.push(
              `/visitors/flow?date_end=${dateFilter?.date_end}&date_start=${
                dateFilter?.date_start
              }&domain=${activeDomain}&page=${dataFilter?.page ? dataFilter?.page : '1'}`
            );
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
                    <span>{item.text}</span>
                    <span>{item.value}</span>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div className="col-9">
          <Card loading={status} data={CardData} />
          {relatedVisitorData?.data?.length ? (
            <div className="bg-white p-24">
              {relatedVisitorData?.data?.map((item, key) => {
                return (
                  <div className="d-flex align-items-center mb-24 flow-detail-item" key={key}>
                    <div className="flow-detail-item-image me-10">
                      <Image
                        className={`object-fit-contain`}
                        style={{ width: 32, height: 32 }}
                        src={`${env.PUBLIC_URL}/assets/images/flow_icon.png`}
                        alt={'icons'}
                      />
                    </div>
                    <div className="flow-detail-item-content d-flex flex-wrap">
                      <div className="fs-14 w-100" style={{ color: '#5F5E70' }}>
                        {moment(item[BI_VISITOR_FIELD_KEY.START_DATE])?.utc()?.format('HH:mm:ss')}
                      </div>
                      <div
                        className={`${
                          styles?.flow_detail_item_content_action
                        } text-white fw-medium d-inline-flex my-sm ${
                          styles[item?.[BI_VISITOR_FIELD_KEY.EVENT_NAME]]
                        } ${
                          item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === 'visit' ? 'text-capitalize' : ''
                        }`}
                      >
                        {item[BI_VISITOR_FIELD_KEY.EVENT_NAME] === 'visit'
                          ? 'Visited'
                          : item[BI_VISITOR_FIELD_KEY.EVENT_NAME]}
                      </div>
                      <div className="w-100">
                        <a
                          href={`${item[BI_VISITOR_FIELD_KEY.URL]}`}
                          target="_blank"
                          class={`${styles?.flow_detail_item_content_link} fw-semibold`}
                        >
                          {item[BI_VISITOR_FIELD_KEY.URL]}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <></>
          )}
          {/* {relatedVisitorData ? (
            <BehaviorTable
              data={relatedVisitorData?.toFlowDetailTable()}
              sortAPI={false}
              limit={20}
            />
          ) : null} */}
        </div>
      </div>
    </div>
  );
});

export default withRouter(FlowDetailContainer);
