import React, { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { observer } from 'mobx-react';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { useFlowViewModel } from './FlowViewModels/FlowViewModelContextProvider';
import { useParams } from 'react-router-dom';
import Card from './Components/Card';
import { env } from 'env';
import { BI_FLOW_DETAIL_KEY } from 'aesirx-dma-lib';
import moment from 'moment';
import BehaviorTable from 'containers/Behavior/Component/BehaviorTable';

const FlowDetailContainer = observer(() => {
  const { t } = useTranslation('common');
  const {
    flowDetailViewModel: { data = [], relatedVisitorData, getFlowDetail, status, getVisitor },
  } = useFlowViewModel();
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();

  const { uuid } = useParams();

  useEffect(() => {
    const execute = async () => {
      await getVisitor({
        'filter[domain]': activeDomain,
        page_size: 0,
        'filter[flow_uuid]': uuid,
      });
      await getFlowDetail(uuid);
    };
    execute();
    return () => {};
  }, [activeDomain]);

  const CardData = useMemo(
    () => [
      {
        className: 'col-3',
        title: t('txt_domain'),
        icon: env.PUBLIC_URL + '/assets/images/domain.svg',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.DOMAIN] ?? '',
      },
      {
        className: 'col-3',
        title: t('txt_location'),
        icon: env.PUBLIC_URL + '/assets/images/location.svg',
        iconColor: '#1AB394',
        value: data?.[BI_FLOW_DETAIL_KEY.LOCATION]?.country?.name ?? 'unDetected',
      },
      {
        className: 'col-3',
        title: t('txt_duration'),
        icon: env.PUBLIC_URL + '/assets/images/clock.svg',
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
    ],
    [data]
  );
  const LeftTableData = useMemo(
    () => [
      {
        text: t('txt_date'),
        value: moment(data?.[BI_FLOW_DETAIL_KEY.START]).format('DD/MM/YYYY') ?? '',
      },
      {
        text: t('txt_duration'),
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
    <div className="py-4 px-3 h-100 d-flex flex-column">
      <div className="position-relative">
        <h2 className="text-blue-0 fw-bold mb-8px mb-3">{t('txt_visitor_flow') + ' ' + uuid}</h2>
      </div>
      <Card loading={status} data={CardData} />
      <div className="row gx-24 ">
        <div className="col-3">
          <div className="bg-white p-24 shadow-sm rounded-3 h-100 ">
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
          {relatedVisitorData ? <BehaviorTable data={relatedVisitorData?.toEventTable()} /> : null}
        </div>
      </div>
    </div>
  );
});

export default FlowDetailContainer;
