import React, { Component, lazy } from 'react';
import { Route, matchPath } from 'react-router-dom';
import EventsStore from './EventsStore/EventsStore';
import { EventsViewModelContextProvider } from './EventsViewModels/EventsViewModelContextProvider';
import EventsViewModel from './EventsViewModels/EventsViewModel';

import { observer } from 'mobx-react';
import { withBiViewModel } from '../../store/BiStore/BiViewModelContextProvider';
import ReactToPrint from 'react-to-print';
import { history } from 'aesirx-uikit';
import { Translation } from 'react-i18next';

const Events = lazy(() => import('./Events'));
const Generator = lazy(() => import('./Generator'));

const RenderComponent = ({ link, ...props }) => {
  switch (link) {
    case 'events':
      return <Events {...props} />;
    case 'events-generator':
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
    render() {
      const { integration = false } = this.props;
      const { integrationLink, activeDomain } = this.biListViewModel;
      const match = matchPath(history.location.pathname, {
        path: process.env.REACT_APP_INTERGRATION ? '/bi' : '' + '/events',
        exact: true,
        strict: false,
      });
      return (
        <EventsViewModelContextProvider viewModel={this.behaviorViewModel}>
          {(match?.isExact || integrationLink === 'events') && (
            <ReactToPrint
              trigger={() => {
                return (
                  <a
                    className={`btn btn-success me-2 text-nowrap fw-semibold py-16 lh-sm printButton `}
                    href="#"
                  >
                    <Translation>{(t) => <>{t('txt_export_pdf')}</>}</Translation>
                  </a>
                );
              }}
              content={() => this.componentRef}
            />
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
              <Route exact path={['/events', '/bi/events']}>
                <Events />
              </Route>
              <Route exact path={['/events/generator']}>
                <Generator />
              </Route>
            </>
          )}
        </div>
      );
    }
  }
);

export default withBiViewModel(EventsPage);
