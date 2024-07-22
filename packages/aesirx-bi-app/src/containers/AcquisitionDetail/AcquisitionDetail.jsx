/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

import { withRouter } from 'react-router-dom';
import OverviewComponent from './Component/Overview';

import { withAcquisitionDetailViewModel } from './AcquisitionDetailViewModels/AcquisitionDetailViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import DateRangePicker from '../../components/DateRangePicker';
import { Col, Row } from 'react-bootstrap';
import { history } from 'aesirx-uikit';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import PageTable from './Component/PageTable';

const AcquisitionDetail = observer(
  class AcquisitionDetail extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.acquisitionDetailListViewModel = this.viewModel
        ? this.viewModel.getAcquisitionDetailListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
    }

    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.acquisitionDetailListViewModel.initialize({
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'filter[acquisition]': true,
          ...(this.params?.url === 'direct'
            ? { 'filter[filter_not]': '' }
            : { 'filter[referrer]': '' }),
        });
      }
    };

    componentDidMount = () => {
      this.acquisitionDetailListViewModel.initialize({
        ...this.context.biListViewModel.activeDomain
          ?.map((value, index) => ({
            [`filter[domain][${index + 1}]`]: value,
          }))
          ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        'filter[acquisition]': true,
        ...(this.params?.url === 'direct'
          ? { 'filter[filter_not]': '' }
          : { 'filter[referrer]': '' }),
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.acquisitionDetailListViewModel.handleFilterDateRange(
        startDate ?? endDate,
        endDate ?? startDate
      );
    };

    handleSort = async (column) => {
      this.acquisitionDetailListViewModel.getPages(
        {
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'filter[acquisition]': true,
          ...(this.params?.url === 'direct'
            ? { 'filter[filter_not]': '' }
            : { 'filter[referrer]': '' }),
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.acquisitionDetailListViewModel?.sortBy['sort_direction[]'] === 'desc'
              ? 'asc'
              : 'desc',
        }
      );
    };

    handleSearch = async (search) => {
      this.acquisitionDetailListViewModel.getPages(
        {
          ...this.context.biListViewModel.activeDomain
            ?.map((value, index) => ({
              [`filter[domain][${index + 1}]`]: value,
            }))
            ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          'filter[acquisition]': true,
          ...(this.params?.url === 'direct'
            ? { 'filter[filter_not]': '' }
            : { 'filter[referrer]': '' }),
        },
        {},
        {},
        { 'filter[url]': search }
      );
    };

    render() {
      const { t } = this.props;
      console.log('dsadsada', this.acquisitionDetailListViewModel?.visitorData);
      return (
        <div className="py-4 px-4 h-100 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <div className="position-relative d-flex align-items-center mb-8px">
              <div
                className={`back_icon d-flex align-items-center justify-content-center cursor-pointer me-1`}
                onClick={() => {
                  history.push(
                    `/acquisition/?date_end=${this.context.biListViewModel.dateFilter?.date_end}&date_start=${this.context.biListViewModel.dateFilter?.date_start}&domain=${this.context.biListViewModel.activeDomain}`
                  );
                }}
              >
                <FontAwesomeIcon className={`text-success`} icon={faChevronLeft} />
              </div>
              <h2 className="fw-bold mb-0 fs-3">
                {t('txt_acquisition_overview')}/{' '}
                <span className="text-capitalize">{this.params?.url ? this.params?.url : ''}</span>{' '}
                {t('txt_traffic')}
              </h2>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <Row>
            <Col lg="12">
              <OverviewComponent
                bars={['visits']}
                barColors={['#0066FF', '#96C0FF']}
                listViewModel={this.acquisitionDetailListViewModel}
                status={this.acquisitionDetailListViewModel?.status}
                data={this.acquisitionDetailListViewModel?.visitorData?.toAreaChart()}
                filterData={this.acquisitionDetailListViewModel?.visitorData?.getFilterName()}
              />
            </Col>
          </Row>
          <Row className="my-24 pb-24">
            <Col lg={12} className="mb-24">
              <PageTable
                listViewModel={this.acquisitionDetailListViewModel}
                handleSort={this.handleSort}
                handleSearch={this.handleSearch}
                {...this.props}
              />
            </Col>
          </Row>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withAcquisitionDetailViewModel(AcquisitionDetail)));
