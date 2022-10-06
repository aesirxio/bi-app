/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';
import '../index.scss';

import {
  DAM_ASSETS_API_FIELD_KEY,
  DAM_COLLECTION_API_RESPONSE_FIELD_KEY,
} from 'aesirx-dma-lib/src/Constant/DamConstant';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import history from 'routes/history';
import Spinner from '../../../components/Spinner';
import PAGE_STATUS from '../../../constants/PageStatus';
import { withDamViewModel } from 'store/DamStore/DamViewModelContextProvider';

const HomeList = observer(
  class HomeList extends Component {
    damListViewModel = null;
    damformModalViewModal = null;

    constructor(props) {
      super(props);
      const { viewModel } = props;
      this.viewModel = viewModel ? viewModel : null;
      this.damListViewModel = this.viewModel ? this.viewModel.damListViewModel : null;
      this.damformModalViewModal = this.viewModel ? this.viewModel.damFormViewModel : null;
    }

    async componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside);
      const collectionId = history.location.pathname.split('/');
      this.damListViewModel.getAssets(collectionId[collectionId.length - 1] ?? 0);
      this.damListViewModel.getCollections(collectionId[collectionId.length - 1] ?? 0);
    }

    componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
    }

    componentDidUpdate(prevProps) {
      if (this.props.location !== prevProps.location) {
        const collectionId = history.location.pathname.split('/');
        this.damListViewModel.getAssets(collectionId[collectionId.length - 1] ?? 0);
        this.damListViewModel.getCollections(collectionId[collectionId.length - 1] ?? 0);
      }
    }

    handleClickOutside = (e) => {
      const checkContextMenu = e.target.closest('#contextMenu');
      if (checkContextMenu) {
        return;
      } else {
        if (!document.querySelector('.main-content').classList.contains('overflow-y-auto')) {
          document.querySelector('.main-content').classList.add('overflow-y-auto');
        }
        this.damformModalViewModal.closeContextMenu();
      }
    };

    handleSelect = (data) => {
      this.damListViewModel.damIdsSelected = data
        .map((item) => {
          return item[this.key];
        })
        .reduce((arr, el) => {
          return arr.concat(el);
        }, []);
    };

    handleCreateFolder = () => {
      const collectionId = history.location.pathname.split('/');
      const checkCollection = !isNaN(collectionId[collectionId.length - 1]);
      console.log(checkCollection ? collectionId[collectionId.length - 1] : 0);
      this.damListViewModel.createCollections({
        [DAM_COLLECTION_API_RESPONSE_FIELD_KEY.NAME]: 'New Folder',
        [DAM_COLLECTION_API_RESPONSE_FIELD_KEY.PARENT_ID]: checkCollection
          ? collectionId[collectionId.length - 1]
          : 0,
      });
    };

    handleCreateAssets = (data) => {
      if (data) {
        const collectionId = history.location.pathname.split('/');
        const checkCollection = !isNaN(collectionId[collectionId.length - 1]);

        this.damListViewModel.createAssets({
          [DAM_ASSETS_API_FIELD_KEY.NAME]: data?.name ?? '',
          [DAM_ASSETS_API_FIELD_KEY.FILE_NAME]: data?.name ?? '',
          [DAM_ASSETS_API_FIELD_KEY.COLLECTION_ID]: checkCollection
            ? collectionId[collectionId.length - 1]
            : 0,
          [DAM_ASSETS_API_FIELD_KEY.FILE]: data,
        });
      }
    };

    _handleList = () => {
      this.damListViewModel.isList = !this.damListViewModel.isList;
    };

    handleDoubleClick = (colectionId) => {
      history.push('/root/' + colectionId);
    };

    handleRightClick = (e) => {
      e.preventDefault();
      const inside = e.target.closest('.col_thumb');
      if (!inside) {
        console.log(e);
      }
    };

    handleRightClickItem = (e, data) => {
      e.preventDefault();
      if (document.querySelector('.main-content').classList.contains('overflow-y-auto')) {
        document.querySelector('.main-content').classList.remove('overflow-y-auto');
      }
      this.damformModalViewModal.damEditdata = {
        ...data,
        x: e.clientX,
        y: e.clientY,
      };
      this.damformModalViewModal.openContextMenu();
    };

    handleFilter = (data) => {
      const collectionId = history.location.pathname.split('/');
      this.damListViewModel.filterAssets(collectionId[collectionId.length - 1] ?? 0, {
        'filter[type]': data.value,
      });
    };

    handleSortby = (data) => {
      const collectionId = history.location.pathname.split('/');
      this.damListViewModel.filterAssets(collectionId[collectionId.length - 1] ?? 0, {
        'list[ordering]': data.value.ordering,
        'list[direction]': data.value.direction,
      });
    };

    render() {
      // const { t } = this.props;

      if (status === PAGE_STATUS.LOADING) {
        return <Spinner />;
      }

      return <div className="position-relative col d-flex flex-column" id="outside"></div>;
    }
  }
);

export default withTranslation('common')(withRouter(withDamViewModel(HomeList)));
