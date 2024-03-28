import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import TopTable from './TopTable';
const PageTable = observer(
  class PageTable extends Component {
    constructor(props) {
      super(props);
      const { listViewModel } = props;
      this.listViewModel = listViewModel ? listViewModel : null;
      this.state = { loading: false };
    }
    // search = _.debounce((e) => {
    //   this.props.handleSearch(e?.target?.value);
    // }, 500);
    render() {
      const { statusTopTable } = this.listViewModel;

      return (
        <div className="position-relative h-100">
          {/* <Row className="mb-3">
            <Col lg="4">
              <Form.Control
                as="input"
                placeholder="Search url"
                name="search"
                onChange={this.search}
              />
            </Col>
          </Row> */}
          <div className="bg-white rounded-3 shadow-sm h-100 position-relative ChartWrapper">
            <TopTable
              data={this.listViewModel?.acquisitionsTableData?.list?.toPagesTableTop(
                this.props.integration
              )}
              pagination={this.listViewModel?.acquisitionsTableData?.pagination}
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
              sortAPI={true}
              handleSort={this.props.handleSort}
              sortBy={this.listViewModel?.sortBy}
              {...this.props}
            />
          </div>
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(PageTable));
