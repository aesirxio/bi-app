import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { PlatformsStore } from './PlatformsStore/PlatformsStore';
import PlatformsViewModel from './PlatformsViewModel/PlatformsViewModel';
import { PlatformsViewModelContextProvider } from './PlatformsViewModel/PlatformsViewModelContextProvider';
import Platform from './Platforms';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
const { observer } = require('mobx-react');

const PlatformsContainers = observer(
  class PlatformsContainers extends Component {
    PlatformsStore = null;
    PlatformsViewModel = null;
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.biListViewModel = this.viewModel ? this.viewModel.getBiListViewModel() : null;

      this.PlatformsStore = new PlatformsStore();
      this.PlatformsViewModel = new PlatformsViewModel(this.PlatformsStore, this.biListViewModel);
    }

    render() {
      return (
        <PlatformsViewModelContextProvider viewModel={this.PlatformsViewModel}>
          <ComponentToPrint ref={(el) => (this.componentRef = el)} />
        </PlatformsViewModelContextProvider>
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
          <Platform {...this.props} />
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(PlatformsContainers)));
