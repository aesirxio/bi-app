import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
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
      const { statusTopTable } = this.listViewModel;
      return (
        <div className="position-relative h-100">
          <div className="bg-white rounded-3 shadow-sm h-100 position-relative">
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
          </div>
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(TopTabs));
