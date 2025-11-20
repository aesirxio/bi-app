import React from 'react';
import { observer } from 'mobx-react';
import { UserViewModelContextProvider } from './UserViewModel/UserViewModelContextProvider';
import ListUser from './ListUser';
import { Route, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { PAGE_STATUS } from 'aesirx-uikit';

const UserPage = observer(
  class UserPage extends React.Component {
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
          <UserViewModelContextProvider>
            <Route exact path={['/user-handling']}>
              {dataStreamStatus === PAGE_STATUS.READY ? (
                <>
                  {dataStream?.is_user_admin ? (
                    <ListUser />
                  ) : (
                    <p className="p-3 fw-semibold">Current user does not have access!</p>
                  )}
                </>
              ) : (
                <></>
              )}
            </Route>
          </UserViewModelContextProvider>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(UserPage)));
