import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ComponentCard from '../../../components/ComponentCard';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { withDashboardViewModel } from '../DashboardViewModels/DashboardViewModelContextProvider';
const CardComponent = observer(
  class extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="row gx-24">
          {this.props.data.length > 0
            ? this.props.data.map((item, index) => (
                <div className={item.className} key={index}>
                  <ComponentCard
                    title={item.title}
                    icon={item.icon}
                    iconColor={item.iconColor}
                    value={item.value}
                    isIncrease={item.isIncrease}
                    loading={item.loading}
                    // percent={`3%`}
                    // textPercent={'form June'}
                    options={item.options}
                    defaultValue={item.defaultValue}
                  />
                </div>
              ))
            : null}
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withDashboardViewModel(CardComponent)));
