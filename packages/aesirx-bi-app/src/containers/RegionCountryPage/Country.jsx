import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withCountryViewModel } from './CountryViewModels/CountryViewModelContextProvider';
import { observer } from 'mobx-react';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import GeoChart from '../../components/GeoChart';
import { Col, Row } from 'react-bootstrap';
import DateRangePicker from '../../components/DateRangePicker';
import PAGE_STATUS from '../../constants/PageStatus';
import { RingLoaderComponent } from 'aesirx-uikit';
import CountryTable from './Component/CountryTable';
import ComponentNoData from '../../components/ComponentNoData';
import { env } from 'aesirx-lib';
import 'flag-icons/sass/flag-icons.scss';
import TopTable from 'containers/VisitorsPage/Component/TopTable';

const Country = observer(
  class Country extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.countryListViewModel = this.viewModel ? this.viewModel.getCountryListViewModel() : null;
    }

    componentDidUpdate = (prevProps) => {
      if (this.props.location !== prevProps.location && !this.props.integration) {
        this.countryListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }

      if (this.props.activeDomain !== prevProps.activeDomain && this.props.integration) {
        this.countryListViewModel.initialize({
          'filter[domain]': this.context.biListViewModel.activeDomain,
        });
      }
    };

    componentDidMount = () => {
      this.countryListViewModel.initialize({
        'filter[domain]': this.context.biListViewModel.activeDomain,
      });
    };

    handleDateRangeChange = (startDate, endDate) => {
      this.countryListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSortRegion = async (column) => {
      this.countryListViewModel.getRegion(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.countryListViewModel?.sortByRegion['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };
    render() {
      const { t } = this.props;
      const { status } = this.countryListViewModel;
      return (
        <>
          <div className="py-4 px-4 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
              <div className="position-relative">
                <h2 className="fw-bold mb-3 mt-3">{t('txt_menu_region')}</h2>
              </div>
              <div className="position-relative">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <div className="position-relative ChartWrapper bg-white rounded-3 p-24 shadow-sm w-100 h-100 mb-24">
              {status === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between mb-24">
                    <h4 className="me-24 mb-0 fw-semibold">{t('txt_countries')}</h4>
                  </div>
                  <Row className="align-items-center justify-content-center">
                    <Col lg={8}>
                      {this.countryListViewModel?.countriesData?.length ? (
                        <GeoChart
                          data={this.countryListViewModel?.countriesData}
                          continent={'world'}
                          markerSize={{ dot: 4, circle: 80 }}
                        />
                      ) : (
                        <ComponentNoData
                          icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                          title={t('txt_no_data')}
                          width="w-50"
                        />
                      )}
                    </Col>
                  </Row>
                </>
              )}
            </div>
            <div className="position-relative ChartWrapper">
              {status === PAGE_STATUS.LOADING ? (
                <RingLoaderComponent className="d-flex justify-content-center align-items-center bg-white rounded-3 shadow-sm" />
              ) : this.countryListViewModel?.countriesTableData?.list ? (
                <CountryTable
                  data={this.countryListViewModel?.countriesTableData?.list}
                  {...this.props}
                />
              ) : (
                <div className="position-relative ChartWrapper bg-white rounded-3 shadow-sm">
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <ComponentNoData
                      icons={env.PUBLIC_URL + '/assets/images/ic_project.svg'}
                      title={t('txt_no_data')}
                      width="w-50"
                    />
                  </div>
                </div>
              )}
            </div>
            <Row className="my-24 pb-24">
              <Col lg={6} className="mb-24">
                <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                  <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_region')}</h4>
                  <TopTable
                    data={this.countryListViewModel?.regionTableData?.list}
                    pagination={this.countryListViewModel?.regionTableData?.pagination}
                    isPagination={true}
                    simplePagination={true}
                    selectPage={async (value) => {
                      await this.countryListViewModel.handleFilterRegion({ page: value });
                    }}
                    selectPageSize={async (value) => {
                      await this.countryListViewModel.handleFilterRegion({
                        page: 1,
                        page_size: value,
                      });
                    }}
                    status={this.countryListViewModel?.statusTopRegionTable}
                    sortAPI={true}
                    handleSort={this.handleSortRegion}
                    sortBy={this.countryListViewModel?.sortByRegion}
                    {...this.props}
                  />
                </div>
              </Col>
              <Col lg={6} className="mb-24">
                <div className="bg-white rounded-3 p-24 shadow-sm h-100 position-relative">
                  <h4 className="me-24 mb-24 fw-semibold fs-5">{t('txt_city')}</h4>
                  <TopTable
                    data={this.countryListViewModel?.citiesTableData?.list}
                    pagination={this.countryListViewModel?.citiesTableData?.pagination}
                    isPagination={true}
                    simplePagination={true}
                    selectPage={async (value) => {
                      await this.countryListViewModel.handleFilterCities({ page: value });
                    }}
                    selectPageSize={async (value) => {
                      await this.countryListViewModel.handleFilterCities({
                        page: 1,
                        page_size: value,
                      });
                    }}
                    status={this.countryListViewModel?.statusTopCitiesTable}
                    sortAPI={true}
                    handleSort={this.handleSortCities}
                    sortBy={this.countryListViewModel?.sortByCities}
                    {...this.props}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </>
      );
    }
  }
);
export default withTranslation()(withRouter(withCountryViewModel(Country)));
