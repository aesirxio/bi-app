import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
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
    render() {
      const { t } = this.props;
      const { statusTopTable } = this.listViewModel;
      return (
        <div className="position-relative h-100">
          <Tab.Container id="left-tabs-example" defaultActiveKey="country">
            <Row className="gx-24">
              <Col sm={3}>
                <div className="bg-white rounded-3 pe-24 shadow-sm h-100 position-relative">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="country">{t('txt_Countries')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="city">{t('txt_Cities')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="browser">{t('txt_browser')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="device">{t('txt_devices')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="language">{t('txt_language')}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>
              <Col sm={9}>
                <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
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
                          await this.listViewModel.handleFilterCountries({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
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
                          await this.listViewModel.handleFilterCountries({
                            page: 1,
                            page_size: value,
                          });
                        }}
                        status={statusTopTable}
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
