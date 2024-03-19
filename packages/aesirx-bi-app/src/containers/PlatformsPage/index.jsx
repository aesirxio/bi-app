import DateRangePicker from 'components/DateRangePicker';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';

const { observer } = require('mobx-react');

const PlatformsContainers = observer(
  class PlatformsContainers extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
    }
    render() {
      return (
        <div className="aesirxui">
          <div className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-24">
              <div>
                <h2 className="fw-bold mb-8px">Platforms</h2>
              </div>
              <div className="position-relative">
                <DateRangePicker onChange={this.handleDateRangeChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="bg-white shadow-sm rounded-3 h-100 d-flex flex-column">
                    <div className='p-32px d-flex flex-column flex-grow-1'>
                        <h4 className='me-24 mb-0 fw-semibold mb-3'>Device model</h4>
                        <div className='w-100 d-flex justify-content-between border-bottom mb-2'>
                            <p className='mb-1 text-gray-heading fw-bold fs-14'>Model</p>
                            <p className='mb-1 text-gray-heading fw-bold fs-14'>Unique Visitors</p>
                        </div>
                        <ul className='list-unstyled border-bottom fs-14'>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                            <li className='d-flex justify-content-between'><p>Generic Desktop</p><p>1.537</p></li>
                        </ul>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withBiViewModel(PlatformsContainers)));
