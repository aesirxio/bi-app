import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import DateRangePicker from '../../components/DateRangePicker';
import { withRouter } from 'react-router-dom';
import { withUserFlowViewModel } from './UserFlowViewModels/UserFlowViewModelContextProvider';
import { BiViewModelContext } from '../../store/BiStore/BiViewModelContextProvider';
import queryString from 'query-string';
import { Sankey, Tooltip } from 'recharts';
import Node from './Component/Node';
import Link from './Component/Link';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const UserFlowPage = observer(
  class UserFlowPage extends Component {
    static contextType = BiViewModelContext;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;

      this.userFlowListViewModel = this.viewModel
        ? this.viewModel.getUserFlowListViewModel()
        : null;
      this.params = queryString.parse(props.location.search);
    }
    componentDidMount = () => {
      this.userFlowListViewModel.initialize(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        { ...(this.params?.pagination && { page: this.params?.pagination }) }
      );
    };
    componentDidUpdate = (prevProps) => {
      if (
        this.props.location !== prevProps.location ||
        this.props.activeDomain !== prevProps.activeDomain
      ) {
        this.userFlowListViewModel.initialize(
          {
            'filter[domain]': this.context.biListViewModel.activeDomain,
          },
          {},
          { ...(this.params?.pagination && { page: this.params?.pagination }) }
        );
      }
    };
    handleDateRangeChange = (startDate, endDate) => {
      this.userFlowListViewModel.handleFilterDateRange(startDate ?? endDate, endDate ?? startDate);
    };

    handleSort = async (column) => {
      this.userFlowListViewModel.getPages(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {
          'sort[]': column?.id,
          'sort_direction[]':
            this.userFlowListViewModel?.sortBy['sort_direction[]'] === 'desc' ? 'asc' : 'desc',
        }
      );
    };

    handleSearch = async (search) => {
      this.userFlowListViewModel.getPages(
        {
          'filter[domain]': this.context.biListViewModel.activeDomain,
        },
        {},
        {},
        { 'filter[url]': search }
      );
    };

    render() {
      const { t } = this.props;
      return (
        <div className="py-4 px-4">
          <div className="d-flex align-items-center justify-content-between mb-24">
            <div>
              <h2 className="fw-bold mb-8px">{t('txt_users_flow')}</h2>
              <p className="mb-0">{t('txt_analytic_details')}</p>
            </div>
            <div className="position-relative">
              <DateRangePicker onChange={this.handleDateRangeChange} />
            </div>
          </div>
          <div className="bg-white rounded-3 shadow-sm h-100 position-relative ChartWrapper">
            {this.userFlowListViewModel?.userFlowTableData?.list?.data?.nodes?.length ? (
              <>
                {/* {this.userFlowListViewModel?.userFlowTableData?.list?.data?.nodes?.length ? (
                  <Row className="gx-0">
                    {this.userFlowListViewModel?.userFlowTableData?.list?.data?.nodes?.map(
                      (item, index) => {
                        var result =
                          this.userFlowListViewModel?.userFlowTableData?.list?.data?.links
                            ?.filter((obj) => {
                              return obj.target === index;
                            })
                            ?.reduce((n, { value }) => n + value, 0);
                        return (
                          <Col>
                            <div className="border p-3 fw-semibold">
                              <div>{item?.name}</div>
                              <div>{result}</div>
                            </div>
                          </Col>
                        );
                      }
                    )}
                    <Col>
                      <div className="border p-3 fw-semibold d-flex align-items-center">
                        Add <FontAwesomeIcon className={`text-success ms-1`} icon={faPlusCircle} />
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )} */}
                <Sankey
                  width={1024}
                  height={500}
                  data={this.userFlowListViewModel?.userFlowTableData?.list?.data}
                  node={<Node containerWidth={1024} />}
                  nodePadding={50}
                  nodeWidth={10}
                  linkCurvature={0.61}
                  iterations={64}
                  margin={{
                    left: 20,
                    right: 200,
                    top: 50,
                    bottom: 50,
                  }}
                  link={<Link />}
                >
                  <defs>
                    <linearGradient id={'linkGradient'}>
                      <stop offset="0%" stopColor="rgba(0, 136, 254, 0.5)" />
                      <stop offset="100%" stopColor="rgba(0, 197, 159, 0.3)" />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                </Sankey>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    }
  }
);
export default withTranslation()(withRouter(withUserFlowViewModel(UserFlowPage)));
