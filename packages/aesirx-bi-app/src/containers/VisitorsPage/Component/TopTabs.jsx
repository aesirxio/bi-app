import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import TopTable from './TopTable';
const TopTabs = observer(
  class TopTabs extends Component {
    constructor(props) {
      super(props);
      const { listViewModel } = props;
      this.listViewModel = listViewModel ? listViewModel : null;
      this.state = { loading: false };
    }

    handleSortCountries = async (column) => {
      this.listViewModel.getCountries(
        {
          'filter[domain]': this.props.domain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.listViewModel?.sortByCountries['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSortCities = async (column) => {
      this.listViewModel.getCities(
        {
          'filter[domain]': this.props.domain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.listViewModel?.sortByCities['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSortBrowsers = async (column) => {
      this.listViewModel.getBrowsers(
        {
          'filter[domain]': this.props.domain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.listViewModel?.sortByBrowsers['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSortDevices = async (column) => {
      this.listViewModel.getDevices(
        {
          'filter[domain]': this.props.domain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.listViewModel?.sortByDevices['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSortLanguages = async (column) => {
      this.listViewModel.getLanguages(
        {
          'filter[domain]': this.props.domain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.listViewModel?.sortByLanguages['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };
    render() {
      const { t } = this.props;
      const { statusTopTable } = this.listViewModel;
      return (
        <div className="position-relative h-100">
          <Tab.Container id="left-tabs-example" defaultActiveKey="country">
            <Row className="gx-24">
              <Col sm={3} id="customCol">
                <div className="bg-white rounded-3 pe-24 shadow-sm h-100 position-relative">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="country" className="ps-32px">
                        {t('txt_countries')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="city" className="ps-32px">
                        {t('txt_cities')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="browser" className="ps-32px">
                        {t('txt_browser')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="device" className="ps-32px">
                        {t('txt_devices')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="language" className="ps-32px">
                        {t('txt_language')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>
              <Col sm={9}>
                <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
                  <div className="text-end p-3">
                    {this.props.integration ? (
                      <a
                        href="#"
                        onClick={(e) => this.props.handleChangeLink(e, `/visitors-locations`)}
                        className={'text-success me-2 text-nowrap fw-semibold'}
                      >
                        {t('txt_view_more')}
                      </a>
                    ) : (
                      <Link
                        to="/visitors/locations"
                        className="text-success me-2 text-nowrap fw-semibold"
                      >
                        {t('txt_view_more')}
                      </Link>
                    )}
                  </div>
                  <Tab.Content>
                    <Tab.Pane eventKey="country">
                      <TopTable
                        data={this.listViewModel?.countriesTableData?.list}
                        pagination={this.listViewModel?.countriesTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterCountries({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterCountries({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
                        sortAPI={true}
                        handleSort={this.handleSortCountries}
                        sortBy={this.listViewModel?.sortByCountries}
                        {...this.props}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="city">
                      <TopTable
                        data={this.listViewModel?.citiesTableData?.list}
                        pagination={this.listViewModel?.citiesTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterCities({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterCities({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
                        sortAPI={true}
                        handleSort={this.handleSortCities}
                        sortBy={this.listViewModel?.sortByCities}
                        {...this.props}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="browser">
                      <TopTable
                        data={this.listViewModel?.browsersTableData?.list}
                        pagination={this.listViewModel?.browsersTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterBrowsers({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterBrowsers({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
                        sortAPI={true}
                        handleSort={this.handleSortBrowsers}
                        sortBy={this.listViewModel?.sortByBrowsers}
                        {...this.props}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="device">
                      <TopTable
                        data={this.listViewModel?.devicesTableData?.list}
                        pagination={this.listViewModel?.devicesTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterDevices({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterDevices({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
                        sortAPI={true}
                        handleSort={this.handleSortDevices}
                        sortBy={this.listViewModel?.sortByDevices}
                        {...this.props}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="language">
                      <TopTable
                        data={this.listViewModel?.languagesTableData?.list}
                        pagination={this.listViewModel?.languagesTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterLanguages({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterLanguages({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
                        sortAPI={true}
                        handleSort={this.handleSortLanguages}
                        sortBy={this.listViewModel?.sortByLanguages}
                        {...this.props}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(TopTabs));
