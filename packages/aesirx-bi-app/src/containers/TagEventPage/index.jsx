import React, { lazy } from 'react';
import { observer } from 'mobx-react';
import { TagEventViewModelContextProvider } from './TagEventViewModel/TagEventViewModelContextProvider';
import { Route, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { PAGE_STATUS } from 'aesirx-uikit';

const ListTagEvent = lazy(() => import('./ListTagEvent'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    default:
      return <ListTagEvent {...props} />;
  }
};

const TagEventPage = observer(
  class TagEventPage extends React.Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;
    }
    handleChangeLink = (e, link) => {
      e.preventDefault();

      if (link) {
        this.biListViewModel.setIntegrationLink(link);
      }
    };
    render() {
      const { dataStream, dataStreamStatus } = this.biListViewModel;
      return (
        <div className="px-3 py-4">
          <TagEventViewModelContextProvider globalViewModel={this.biListViewModel}>
            {this.props.integration ? (
              <RenderComponent
                link={this.props.integrationLink}
                activeDomain={this.props.activeDomain}
                {...this.props}
              />
            ) : (
              <Route exact path={['/tag-events', '/bi/tag-events']}>
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
            )}
          </TagEventViewModelContextProvider>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(TagEventPage)));
