import { Table, Spinner, ActionsBar, notify } from 'aesirx-uikit';
import React, { useEffect } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withUserViewModel } from './UserViewModel/UserViewModelContextProvider';
import { historyPush } from 'routes/routes';

const ListUser = observer((props) => {
  const { t } = useTranslation();
  let listSelected = [];
  const viewModel = props.model.userListViewModel;
  useEffect(() => {
    viewModel.initializeAllData();
  }, []);
  const columnsTable = [
    {
      Header: 'SOP',
      accessor: 'label',
      width: 900,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ row, value }) => {
        return (
          <>
            <div className="d-flex align-items-center py-8px align-items-center">
              <div className="">{value}</div>
              <div className="text-green ms-2">
                <button
                  onClick={() => {
                    historyPush(`/user-handling/edit/${row.cells[2].value}`);
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
      Header: '',
      accessor: 'value',
      width: 10,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: () => {
        return <></>;
      },
    },
  ];

  const currentSelectHandler = (arr) => {
    listSelected = arr?.map((o) => o.cells[2]?.value);
  };

  const deleteUsers = () => {
    if (listSelected.length < 1) {
      notify(t('txt_row_select_error'), 'error');
    } else {
      viewModel.isLoading();
      viewModel.deleteUsers(listSelected);
    }
  };

  return (
    <div className="px-3 pb-4">
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="position-relative">
          <h2 className="fw-bold mb-8px">User Handling</h2>
        </div>
        <ActionsBar
          buttons={[
            {
              title: t('txt_delete'),
              icon: '/assets/images/delete.svg',
              iconColor: '#cb222c',
              textColor: '#cb222c',
              handle: async () => {
                deleteUsers();
              },
            },
            {
              title: t('txt_add_new'),
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                historyPush('/user-handling/add');
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
            data={viewModel?.successResponse?.listUsersWithoutPagination}
            selection={false}
            currentSelect={currentSelectHandler}
          ></Table>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
});

export default withTranslation()(withUserViewModel(ListUser));
