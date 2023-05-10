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
          <Tab.Container id="left-tabs-example" defaultActiveKey="page">
            <Row className="gx-24">
              <Col sm={3}>
                <div className="bg-white rounded-3 p-24 shadow-sm">
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link eventKey="page" className="ps-0">
                        {t('txt_page')}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>
              </Col>
              <Col sm={9}>
                <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
                  <Tab.Content>
                    <Tab.Pane eventKey="page">
                      <TopTable
                        data={this.listViewModel?.pagesTableData?.list}
                        pagination={this.listViewModel?.pagesTableData?.pagination}
                        selectPage={async (value) => {
                          await this.listViewModel.handleFilterPages({ page: value });
                        }}
                        selectPageSize={async (value) => {
                          await this.listViewModel.handleFilterPages({
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
