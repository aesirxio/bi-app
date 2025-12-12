import { Table, Spinner, ActionsBar, notify } from 'aesirx-uikit';
import React, { useEffect } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withTagEventViewModel } from './TagEventViewModel/TagEventViewModelContextProvider';
import { historyPush } from 'routes/routes';
import { useBiViewModel } from 'store/BiStore/BiViewModelContextProvider';
import { Button, Col, Row } from 'react-bootstrap';
import StackedBarChartComponent from 'components/StackedBarChartComponent';

const ListTagEvent = observer((props) => {
  const { t } = useTranslation();
  let listSelected = [];
  const viewModel = props.model.tagEventListViewModel;
  const {
    biListViewModel: { activeDomain },
  } = useBiViewModel();
  useEffect(() => {
    viewModel.initializeAllData(activeDomain, props.globalViewModel);
  }, []);
  const columnsTable = [
    {
      Header: 'Event Name',
      accessor: 'event_name',
      width: 400,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ row, value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              {value}
              <div className="text-green ms-2">
                <button
                  onClick={() => {
                    historyPush(`/tag-events/edit/${row.cells[5].value}`);
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
      Header: 'Metric Value',
      accessor: 'metric_value',
      width: 100,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">
                {value
                  ? viewModel.tagEventListViewModel.formPropsData?.utm_currency
                    ? value + ' ' + viewModel.tagEventListViewModel.formPropsData?.utm_currency
                    : value
                  : 0}
              </div>
            </div>
          </>
        );
      },
    },
    {
      Header: 'Engagement Value',
      accessor: 'engagement_value',
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
                      event_name: row.cells[1].value,
                      publish: !value,
                      _id: {
                        $oid: row.cells[5].value,
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
      accessor: 'id',
      width: 10,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: () => {
        return <></>;
      },
    },
  ];

  const currentSelectHandler = (arr) => {
    listSelected = arr?.map((o) => o.cells[5]?.value);
  };

  const deleteTagEvents = () => {
    if (listSelected.length < 1) {
      notify(t('txt_row_select_error'), 'error');
    } else {
      viewModel.isLoading();
      viewModel.deleteTagEvents(listSelected, activeDomain, props.globalViewModel);
    }
  };
  return (
    <div className="px-3 pb-4">
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">Tag Value Mapping</h2>
        </div>
        <ActionsBar
          buttons={[
            {
              title: t('txt_delete'),
              icon: '/assets/images/delete.svg',
              iconColor: '#cb222c',
              textColor: '#cb222c',
              handle: async () => {
                deleteTagEvents();
              },
            },
            {
              title: t('txt_add_new'),
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                historyPush('/tag-events/link');
              },
            },
          ]}
        />
      </div>
      <div className="bg-white rounded">
        {viewModel?.successResponse?.state ? (
          <Table
            canSort={true}
            sortAPI={false}
            classNameTable={`bg-white rounded table-striped table`}
            columns={columnsTable}
            data={viewModel?.successResponse?.listTagEventsWithoutPagination}
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
              viewModel.tagEventListViewModel.formPropsData?.utm_currency
                ? `(${viewModel.tagEventListViewModel.formPropsData?.utm_currency})`
                : ''
            }`}
            height={390}
            data={viewModel.dataUTM?.toAreaChartUTM('total_value', 'event_name')}
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
            lines={viewModel.dataUTM?.getListLineUTM('event_name')}
            filterData={viewModel.dataUTM?.getFilterNameUTM('event_name')}
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
            data={viewModel.dataUTM?.toAreaChartUTM('engagement_score', 'event_name')}
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
            lines={viewModel.dataUTM?.getListLineUTM('event_name')}
            filterData={viewModel.dataUTM?.getFilterNameUTM('event_name')}
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

export default withTranslation()(withTagEventViewModel(ListTagEvent));
