import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';

import { useTranslation } from 'react-i18next';
import CHART_TYPE from '../../constants/ChartType';
import { env } from 'aesirx-lib';
import { AesirXSelect } from 'aesirx-uikit';

const HeaderFilterComponent = ({
  chartTitle,
  chartTitleClass,
  isSelection,
  viewMoreLink,
  filterButtons = [],
  currentSelection,
  onSelectionChange,
  selectionData,
  view,
  setView,
}) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap mb-24">
      <div className="d-flex align-items-center flex-wrap">
        {chartTitle && (
          <h4
            className={`me-24 mb-0 ${
              !filterButtons?.length && !isSelection ? 'mt-20' : ''
            } ${chartTitleClass}`}
          >
            {chartTitle}
          </h4>
        )}
        {isSelection && (
          <AesirXSelect
            value={currentSelection}
            options={selectionData}
            className={`fs-sm`}
            isBorder={true}
            onChange={(data) => {
              onSelectionChange(data);
            }}
            plColor={'#808495'}
            isSearchable={false}
          />
        )}
      </div>
      {viewMoreLink && (
        <a href={viewMoreLink} className="fs-14 text-body">
          <span className="pe-1">{t('txt_view_detail')}</span>
          <span
            className="icon arrow d-inline-block align-text-bottom ms-auto bg-success"
            style={{
              WebkitMaskImage: `url(${env.PUBLIC_URL}/assets/images/arrow-right.svg)`,
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              width: '10px',
              height: '16px',
            }}
          ></span>
        </a>
      )}
      {filterButtons?.length ? (
        <ButtonGroup className="ms-auto me-0">
          {filterButtons?.includes('days') && (
            <Button
              onClick={() => setView(CHART_TYPE.DAY)}
              className={`${
                view == CHART_TYPE.DAY && 'text-white bg-gray-heading'
              } py-2 px-15 fs-12 lh-sm shadow-none border border-gray-800 text-gray-900`}
              variant={
                view == 'days' ? 'dark' : `${view == CHART_TYPE.DAY ? 'gray-heading' : 'outline'}`
              }
            >
              {t('txt_days')}
            </Button>
          )}
          {filterButtons?.includes('weeks') && (
            <Button
              onClick={() => setView(CHART_TYPE.WEEK)}
              className={`${
                view == CHART_TYPE.WEEK && 'text-white bg-gray-heading'
              } py-2 px-15 fs-12 lh-sm shadow-none border border-gray-800 text-gray-900`}
              variant={
                view == 'weeks' ? 'dark' : `${view == CHART_TYPE.WEEK ? 'gray-heading' : 'outline'}`
              }
            >
              {t('txt_weeks')}
            </Button>
          )}
          {filterButtons?.includes('months') && (
            <Button
              onClick={() => setView(CHART_TYPE.MONTH)}
              className={`${
                view == CHART_TYPE.MONTH && 'text-white bg-gray-heading'
              } py-2 px-15 fs-12 lh-sm shadow-none border border-gray-800 text-gray-900`}
              variant={
                view == 'months'
                  ? 'dark'
                  : `${view == CHART_TYPE.MONTH ? 'gray-heading' : 'outline'}`
              }
            >
              {t('txt_months')}
            </Button>
          )}
        </ButtonGroup>
      ) : (
        <></>
      )}
    </div>
  );
};

export default HeaderFilterComponent;
