import { Table, Spinner, ActionsBar, notify, Input, PAGE_STATUS } from 'aesirx-uikit';
import React, { useEffect } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withUTMLinkViewModel } from './UTMLinkViewModel/UTMLinkViewModelContextProvider';
import { historyPush } from 'routes/routes';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { Button, Col, Form, Row, Spinner as BootstrapSpinner } from 'react-bootstrap';
import StackedBarChartComponent from 'components/StackedBarChartComponent';

const ListUTMLink = observer((props) => {
  const { t } = useTranslation();
  let listSelected = [];
  const viewModel = props.model.utmLinkListViewModel;
  const {
    biListViewModel: { activeDomain, dataStream },
  } = useBiViewModel();
  useEffect(() => {
    viewModel.initializeAllData(activeDomain, props.globalViewModel);
  }, []);
  const columnsTable = [
    {
      Header: 'Campaign Label',
      accessor: 'label',
      width: 400,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ row, value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <a href={row.cells[8].value} target="_blank" className="text-decoration-underline">
                {value}
              </a>
              <div className="text-green ms-2">
                <button
                  onClick={() => {
                    historyPush(`/utm-links/edit/${row.cells[9].value}`);
                  }}
                  className="p-0 border-0 bg-transparent d-inline-block text-green"
                >
                  {t('txt_edit')}
                </button>
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Campaign Name',
      accessor: 'utm_campaign',
      width: 200,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">{value}</div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Campaign Source',
      accessor: 'utm_source',
      width: 200,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">{value}</div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Value Type',
      accessor: 'value_type',
      width: 200,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">{value}</div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Value',
      accessor: 'value',
      width: 100,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">
                {value
                  ? viewModel.utmLinkListViewModel.formPropsData?.utm_currency
                    ? value + ' ' + viewModel.utmLinkListViewModel.formPropsData?.utm_currency
                    : value
                  : 0}
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Engagement Weight',
      accessor: 'engagement_weight',
      width: 200,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">{value ? value : 0}</div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'publish',
      width: 100,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value, row }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <Button
                className="cursor-pointer py-1"
                variant={value === true ? 'success' : 'danger'}
                onClick={() => {
                  viewModel.isLoading();
                  viewModel.update(
                    {
                      domain: activeDomain[0],
                      link: row.cells[8].value,
                      publish: !value,
                      _id: {
                        $oid: row.cells[9].value,
                      },
                    },
                    activeDomain,
                    props.globalViewModel
                  );
                }}
              >
                {value === true ? <>Active</> : <>Disable</>}
              </Button>
            </div>
          </>
        );
      },
    },
    {
      Header: '',
      accessor: 'link',
      width: 10,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: () => {
        return <></>;
      },
    },
    {
      Header: '',
      accessor: 'id',
      width: 10,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: () => {
        return <></>;
      },
    },
  ];

  const currentSelectHandler = (arr) => {
    listSelected = arr?.map((o) => o.cells[9]?.value);
  };

  const deleteUTMLinks = () => {
    if (listSelected.length < 1) {
      notify(t('txt_row_select_error'), 'error');
    } else {
      viewModel.isLoading();
      viewModel.deleteUTMLinks(listSelected, activeDomain, props.globalViewModel);
    }
  };
  return (
    <div className="px-3 pb-4">
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">UTM Value Mapping</h2>
        </div>
        <ActionsBar
          buttons={[
            {
              title: t('txt_delete'),
              icon: '/assets/images/delete.svg',
              iconColor: '#cb222c',
              textColor: '#cb222c',
              handle: async () => {
                deleteUTMLinks();
              },
            },
            {
              title: 'Generate UTM Link',
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                historyPush('/utm-links/add');
              },
            },
            {
              title: t('txt_add_new'),
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                historyPush('/utm-links/link');
              },
            },
          ]}
        />
      </div>
      <div>
        <Row>
          <Col sm="6">
            <Form>
              <Form.Group>
                <div className="d-inline-flex align-items-center justify-content-start bg-white rounded p-2 mb-3">
                  <div className="me-3">UTM Currency: </div>
                  <Input
                    field={{
                      getValueSelected: viewModel.utmLinkListViewModel.formPropsData?.utm_currency,
                      classNameInput: 'py-10 fs-4',
                      placeholder: 'e.g. USD, EUR, VND',
                      handleChange: (event) => {
                        viewModel.utmLinkListViewModel.formPropsData.utm_currency =
                          event.target.value;
                      },
                    }}
                  />
                  <Button
                    onClick={async () => {
                      viewModel.updateConsentsTemplate(
                        {
                          domain: activeDomain[0],
                          utm_currency: viewModel.utmLinkListViewModel.formPropsData?.utm_currency,
                        },
                        activeDomain,
                        props.globalViewModel
                      );
                    }}
                    variant="success"
                    className="ms-3 py-2 border-0"
                    disabled={viewModel.formCurrencyStatus === PAGE_STATUS.LOADING}
                  >
                    {viewModel.formCurrencyStatus === PAGE_STATUS.LOADING ? (
                      <BootstrapSpinner size="sm" variant="white" className="me-2" />
                    ) : (
                      <></>
                    )}
                    Save
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </div>
      <div className="bg-white rounded">
        {viewModel?.successResponse?.state ? (
          <Table
            canSort={true}
            sortAPI={false}
            classNameTable={`bg-white rounded table-striped table`}
            columns={columnsTable}
            data={viewModel?.successResponse?.listUTMLinksWithoutPagination}
            selection={false}
            currentSelect={currentSelectHandler}
          ></Table>
        ) : (
          <Spinner />
        )}
      </div>
      <Row>
        <Col lg="6">
          <StackedBarChartComponent
            loading={viewModel.statusUTM}
            chartTitle={`Total Value ${
              viewModel.utmLinkListViewModel.formPropsData?.utm_currency
                ? `(${viewModel.utmLinkListViewModel.formPropsData?.utm_currency})`
                : ''
            }`}
            height={390}
            data={viewModel.dataUTM?.toAreaChartUTM('total_value', 'campaign_label')}
            colors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            areaColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lineColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lines={viewModel.dataUTM?.getListLineUTM('campaign_label')}
            filterData={viewModel.dataUTM?.getFilterNameUTM('campaign_label')}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'months']}
          />
        </Col>
        <Col lg="6">
          <StackedBarChartComponent
            loading={viewModel.statusUTM}
            chartTitle={'Engagement Score'}
            height={390}
            data={viewModel.dataUTM?.toAreaChartUTM('engagement_score', 'campaign_label')}
            colors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            areaColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lineColors={[
              '#1AB394',
              '#9747FF',
              '#479CFF',
              '#024E6D',
              '#3F51B5',
              '#FFC107',
              '#4CAF50',
              '#FF5722',
            ]}
            lines={viewModel.dataUTM?.getListLineUTM('campaign_label')}
            filterData={viewModel.dataUTM?.getFilterNameUTM('campaign_label')}
            tooltipComponent={{
              header: t('txt_number'),
              value: ``,
            }}
            isLegend={true}
            filterButtons={['days', 'months']}
          />
        </Col>
      </Row>
    </div>
  );
});

export default withTranslation()(withUTMLinkViewModel(ListUTMLink));
