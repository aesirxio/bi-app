import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withSummaryViewModel } from 'store/SummaryStore/SummaryViewModelContextProvider';
import ComponentCard from 'components/ComponentCard';
import { BI_SUMMARY_FIELD_KEY } from 'aesirx-dma-lib/src/Constant/BiConstant';
import { observer } from 'mobx-react';
import numberWithCommas from 'utils/formatNumber';
import { withBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { withRouter } from 'react-router-dom';
import { Col } from 'react-bootstrap';
const CardComponent = observer(
  class CardComponent extends Component {
    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.summaryListViewModel = this.viewModel ? this.viewModel.summaryListViewModel : null;
      this.state = {
        page_views: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
      };
    }

    componentDidMount() {
      let fetchData = async () => {
        await this.summaryListViewModel.getSummary({
          'filter[domain]': this.props.parentStore.biListViewModel.activeDomain,
        });
      };
      fetchData();
    }

    componentDidUpdate(prevProps) {
      if (prevProps.location !== this.props.location) {
        let fetchData = async () => {
          await this.summaryListViewModel.getSummary({
            'filter[domain]': this.props.parentStore.biListViewModel.activeDomain,
          });
        };
        fetchData();
      }
    }

    handleChange = (data) => {
      this.setState({
        page_views: data.value,
      });
    };

    render() {
      const { t } = this.props;
      return (
        <div className="row gx-24 mb-24">
          <Col lg={3}>
            <ComponentCard
              title={t('txt_visitors')}
              icon={'/assets/images/visitor.svg'}
              iconColor={'#1AB394'}
              value={numberWithCommas(
                this.summaryListViewModel.data[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]
              )}
              isIncrease={true}
              loading={this.summaryListViewModel.status}
              // percent={`3%`}
              // textPercent={'form June'}
              options={[{ label: 'All Users', value: 'all-user' }]}
              defaultValue={{ label: 'All Users', value: 'all-user' }}
            ></ComponentCard>
          </Col>
          <Col lg={3}>
            <ComponentCard
              title={t('txt_page_views')}
              icon={'/assets/images/view.svg'}
              iconColor={'#2E71B1'}
              value={numberWithCommas(this.summaryListViewModel?.data[this.state.page_views])}
              isIncrease={false}
              // percent={'13%'}
              // textPercent={'form June'}
              options={[
                { label: 'All', value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS },
                {
                  label: 'Unique',
                  value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS,
                },
              ]}
              loading={this.summaryListViewModel.status}
              defaultValue={{
                label: 'All',
                value: BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS,
              }}
              handleChange={this.handleChange}
            ></ComponentCard>
          </Col>
          <Col lg={3}>
            <ComponentCard
              title={t('txt_acg_session_duration')}
              icon={'/assets/images/duration.svg'}
              iconColor={'#EF3737'}
              value={
                numberWithCommas(
                  this.summaryListViewModel?.data[BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION]
                ) + 's'
              }
              loading={this.summaryListViewModel.status}
              isIncrease={false}
              // percent={'11%'}
              // textPercent={'form June'}
            ></ComponentCard>
          </Col>
          <Col lg={3}>
            <ComponentCard
              title={t('txt_page_session')}
              icon={'/assets/images/page.svg'}
              iconColor={'#FFBE55'}
              value={numberWithCommas(
                this.summaryListViewModel?.data[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION]
              )}
              loading={this.summaryListViewModel.status}
              isIncrease={false}
              // percent={'11%'}
              // textPercent={'form June'}
            ></ComponentCard>
          </Col>
          {/* <div className="col-lg-3">
            <ComponentCard
              title={t('txt_total_revenue')}
              icon={'/assets/images/revenue-icon.svg'}
              iconColor={'#2E71B1'}
              value={0}
              isIncrease={false}
              percent={`3%`}
              textPercent={'form June'}
              options={[{ label: 'All', value: 'all' }]}
              defaultValue={{ label: 'All', value: 'all' }}
            ></ComponentCard>
          </div>
          <div className="col-lg-3">
            <ComponentCard
              title={t('txt_sessions')}
              icon={'/assets/images/sessions.svg'}
              iconColor={'#FFBE55'}
              value={0}
              isIncrease={true}
              percent={`3%`}
              textPercent={'form June'}
            ></ComponentCard>
          </div>
          <div className="col-lg-3">
            <ComponentCard
              title={t('txt_conversion_rate')}
              icon={'/assets/images/conversion.svg'}
              iconColor={'#EF3737'}
              value={0}
              isIncrease={true}
              percent={`3%`}
              textPercent={'form June'}
            ></ComponentCard>
          </div> */}
        </div>
      );
    }
  }
);
export default withTranslation('common')(
  withRouter(withBiViewModel(withSummaryViewModel(CardComponent)))
);
