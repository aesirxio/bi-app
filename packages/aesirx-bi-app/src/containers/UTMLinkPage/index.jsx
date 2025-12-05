import React from 'react';
import { observer } from 'mobx-react';
import { UTMLinkViewModelContextProvider } from './UTMLinkViewModel/UTMLinkViewModelContextProvider';
import ListUTMLink from './ListUTMLink';
import { Route, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { PAGE_STATUS } from 'aesirx-uikit';

const UTMLinkPage = observer(
  class UTMLinkPage extends React.Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
    }
    render() {
      const { dataStream, dataStreamStatus } = this.biListViewModel;
      return (
        <div className="px-3 py-4">
          <UTMLinkViewModelContextProvider globalViewModel={this.biListViewModel}>
            <Route exact path={['/utm-links']}>
              {dataStreamStatus === PAGE_STATUS.READY ? (
                <>
                  {dataStream?.is_user_admin ? (
                    <ListUTMLink />
                  ) : (
                    <p className="p-3 fw-semibold">Current user does not have access!</p>
                  )}
                </>
              ) : (
                <></>
              )}
            </Route>
          </UTMLinkViewModelContextProvider>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(UTMLinkPage)));
