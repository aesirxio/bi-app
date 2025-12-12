import React from 'react';
import { observer } from 'mobx-react';
import { TagEventViewModelContextProvider } from './TagEventViewModel/TagEventViewModelContextProvider';
import ListTagEvent from './ListTagEvent';
import { Route, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { PAGE_STATUS } from 'aesirx-uikit';

const TagEventPage = observer(
  class TagEventPage extends React.Component {
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
          <TagEventViewModelContextProvider globalViewModel={this.biListViewModel}>
            <Route exact path={['/tag-events']}>
              {dataStreamStatus === PAGE_STATUS.READY ? (
                <>
                  {dataStream?.is_user_admin ? (
                    <ListTagEvent />
                  ) : (
                    <p className="p-3 fw-semibold">Current user does not have access!</p>
                  )}
                </>
              ) : (
                <></>
              )}
            </Route>
          </TagEventViewModelContextProvider>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(TagEventPage)));
