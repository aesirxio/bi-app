/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import TagEventDetailViewModel from './TagEventDetailViewModel';
import TagEventListViewModel from './TagEventListViewModel';

class TagEventViewModel {
  tagEventDetailViewModel = {};
  tagEventListViewModel = {};

  constructor(tagEventStore) {
    if (tagEventStore) {
      this.tagEventDetailViewModel = new TagEventDetailViewModel(tagEventStore);
      this.tagEventListViewModel = new TagEventListViewModel(tagEventStore);
    }
  }

  getTagEventDetailViewModel = () => this.tagEventDetailViewModel;
  getTagEventListViewModel = () => this.tagEventListViewModel;
}

export default TagEventViewModel;
