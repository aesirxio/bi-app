import React, { Component, lazy } from 'react';
import { Link, Route, matchPath, withRouter } from 'react-router-dom';
import EventsStore from './EventsStore/EventsStore';
import { EventsViewModelContextProvider } from './EventsViewModels/EventsViewModelContextProvider';
import EventsViewModel from './EventsViewModels/EventsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import { history } from 'aesirx-uikit';
import { Translation, withTranslation } from 'react-i18next';
import ExportButton from 'components/ExportButton';

const Events = lazy(() => import('./Events'));
const Generator = lazy(() => import('./Generator'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'behavior-events':
      return <Events {...props} />;
    case 'behavior-events-generator':
      return <Generator {...props} />;

    default:
      return <Events {...props} />;
  }
};

const EventsPage = observer(
  class EventsPage extends Component {
    eventsStore = null;
    behaviorViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.eventsStore = new EventsStore({});

      this.behaviorViewModel = new EventsViewModel(this.eventsStore, this.biListViewModel);
    }
    handleChangeLink = (e, link) => {
      e.preventDefault();

      if (link) {
        this.biListViewModel.setIntegrationLink(link);
      }
    };
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/behavior/events',
        exact: true,
        strict: false,
      });
      return (
        <EventsViewModelContextProvider viewModel={this.behaviorViewModel}>
          {(match?.isExact || integrationLink === 'behavior-events') && (
            <div className="printButton d-flex">
              {integration ? (
                <a
                  href="#"
                  onClick={(e) => this.handleChangeLink(e, 'behavior-events-generator')}
                  className={`btn btn-success me-2 text-nowrap fw-semibold py-13 lh-sm`}
                >
                  <Translation>{(t) => <>{t('txt_generator_event')}</>}</Translation>
                </a>
              ) : (
                <Link
                  to="/behavior/events-generator"
                  className="btn btn-success me-2 text-nowrap fw-semibold py-13 lh-sm"
                >
                  <Translation>{(t) => <>{t('txt_generator_event')}</>}</Translation>
                </Link>
              )}
              <ExportButton
                data={this?.behaviorViewModel?.eventsList?.data?.list?.toEventTable(true)?.data}
                i18n={this.props.i18n}
                t={this.props.t}
                componentRef={this.componentRef}
                classWrapper={true}
              />
            </div>
          )}

          <ComponentToPrint
            integration={integration}
            integrationLink={integrationLink}
            activeDomain={activeDomain}
            ref={(el) => (this.componentRef = el)}
          />
        </EventsViewModelContextProvider>
      );
    }
  }
);

const ComponentToPrint = observer(
  class extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="aesirxui">
          {this.props.integration ? (
            <RenderComponent
              link={this.props.integrationLink}
              activeDomain={this.props.activeDomain}
              {...this.props}
            />
          ) : (
            <>
              <Route exact path={['/behavior/events', '/bi/behavior/events']}>
                <Events />
              </Route>
              <Route exact path={['/behavior/events-generator']}>
                <Generator />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withTranslation()(withBiViewModel(withRouter(EventsPage)));
