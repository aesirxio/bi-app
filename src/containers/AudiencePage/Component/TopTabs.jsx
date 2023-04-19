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
                <div className="bg-white rounded-3 p-24 shadow-sm">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="country" className="ps-0">
                        {t('txt_Country')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="city" className="ps-0">
                        {t('txt_City')}
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="browser" className="ps-0">
                        {t('txt_browser')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>
              <Col sm={9}>
                <div className="bg-white rounded-3 shadow-sm h-100">
                  <Tab.Content>
                    <Tab.Pane eventKey="country">
                      <TopTable
                        data={this.listViewModel?.countriesTableData}
                        status={statusTopTable}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="city">
                      <TopTable
                        data={this.listViewModel?.citiesTableData}
                        status={statusTopTable}
                      />
                    </Tab.Pane>
                    <Tab.Pane eventKey="browser">
                      <TopTable
                        data={this.listViewModel?.browsersTableData}
                        status={statusTopTable}
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
