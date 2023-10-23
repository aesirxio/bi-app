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
      return (
        <>
          {this.listViewModel && (
            <div className="position-relative h-100">
              <Tab.Container id="left-tabs-example" defaultActiveKey="addToCart">
                <Row className="gx-24">
                  <Col sm={3}>
                    <div className="bg-white rounded-3 p-24 shadow-sm">
                      <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                          <Nav.Link eventKey="addToCart" className="ps-0">
                            {t('txt_add_to_cart')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="searchProduct" className="ps-0">
                            {t('txt_search_product')}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="checkout" className="ps-0">
                            {t('txt_order')}
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </div>
                  </Col>
                  <Col sm={9}>
                    <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
                      <Tab.Content>
                        <Tab.Pane eventKey="addToCart">
                          <TopTable
                            data={this.listViewModel?.dataAddToCart}
                            status={this.listViewModel}
                            {...this.props}
                          />
                        </Tab.Pane>
                        <Tab.Pane eventKey="searchProduct">
                          <TopTable
                            data={this.listViewModel?.dataSearchProduct}
                            status={this.listViewModel}
                            {...this.props}
                          />
                        </Tab.Pane>
                        <Tab.Pane eventKey="checkout">
                          <TopTable
                            data={this.listViewModel?.dataCheckout}
                            status={this.listViewModel}
                            {...this.props}
                          />
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          )}
        </>
      );
    }
  }
);
export default withTranslation()(withRouter(TopTabs));
