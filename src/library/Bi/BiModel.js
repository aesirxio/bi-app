/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BaseItemModel from 'library/Abstract/BaseItemModel';
import {
  BI_DASHBOARD_FIELD_KEY,
  BI_WIDGET_FIELD_KEY,
  BI_NEW_USERS_KEY,
  BI_CONTINENTS_KEY,
  BI_VISITORS_FIELD_KEY,
  BI_DOMAIN_FIELD_KEY,
  BI_SUMMARY_FIELD_KEY,
} from 'library/Constant/BiConstant';
import BaseModel from '../Abstract/BaseModel';
// import {
//   DAM_ASSETS_API_FIELD_KEY,
//   DAM_ASSETS_FIELD_KEY,
//   DAM_COLLECTION_API_RESPONSE_FIELD_KEY,
//   DAM_COLLECTION_FIELD_KEY,
//   DAM_SUBSCIPTION_API_FIELD_KEY,
//   DAM_SUBSCIPTION_FIELD_KEY,
// } from '../Constant/DamConstant';
// import Utils from '../Utils/Utils';
// class ColectionModel extends BaseModel {
//   constructor(entities) {
//     super(entities);
//     if (entities) {
//       this.items = entities._embedded.item.map((element) => {
//         return new CollectionItemModel(element);
//       });
//       this.items.pagination = this.getPagination();
//     }
//   }
// }
// class CollectionItemModel extends BaseItemModel {
//   id = null;
//   parent_id = null;
//   name = '';
//   file_size = 0;
//   owner = null;
//   last_modified = null;
//   constructor(entity) {
//     super(entity);
//     if (entity) {
//       this.id = entity[DAM_COLLECTION_FIELD_KEY.ID] ?? '';
//       this.parent_id = entity[DAM_COLLECTION_FIELD_KEY.PARENT_ID] ?? 0;
//       this.name = entity[DAM_COLLECTION_FIELD_KEY.NAME] ?? '';
//       this.file_size = entity[DAM_COLLECTION_FIELD_KEY.FILE_SIZE] ?? 0;
//       this.owner = entity[DAM_COLLECTION_FIELD_KEY.OWNER] ?? '';
//       this.last_modified = Utils.formatDatetimeByLocale(
//         entity[DAM_COLLECTION_FIELD_KEY.LAST_MODIFIED]
//       );
//     }
//   }

//   toObject = () => {
//     return {};
//   };

//   toJSON = () => {
//     return {
//       ...this.baseToJSON(),
//       [DAM_COLLECTION_FIELD_KEY.ID]: this.id,
//       [DAM_COLLECTION_FIELD_KEY.PARENT_ID]: this.parent_id,
//       [DAM_COLLECTION_FIELD_KEY.NAME]: this.name,
//       [DAM_COLLECTION_FIELD_KEY.FILE_SIZE]: this.file_size,
//       [DAM_COLLECTION_FIELD_KEY.LAST_MODIFIED]: this.last_modified,
//       [DAM_COLLECTION_FIELD_KEY.OWNER]: this.owner,
//     };
//   };

//   static __transformItemToApiOfCreation = (data) => {
//     let formData = new FormData();
//     const excluded = [DAM_COLLECTION_FIELD_KEY.PARENT_ID];
//     Object.keys(DAM_COLLECTION_API_RESPONSE_FIELD_KEY).forEach((index) => {
//       if (!excluded.includes(index) && data[DAM_COLLECTION_FIELD_KEY[index]]) {
//         formData.append(
//           [DAM_COLLECTION_API_RESPONSE_FIELD_KEY[index]],
//           data[DAM_COLLECTION_FIELD_KEY[index]]
//         );
//       }
//     });
//     formData.append(
//       [DAM_COLLECTION_API_RESPONSE_FIELD_KEY.PARENT_ID],
//       data[DAM_COLLECTION_FIELD_KEY.PARENT_ID] ?? 0
//     );
//     return formData;
//   };

//   static __transformItemToApiOfUpdation = (data) => {
//     let formData = {};
//     const excluded = [DAM_COLLECTION_FIELD_KEY.PARENT_ID];

//     Object.keys(DAM_COLLECTION_API_RESPONSE_FIELD_KEY).forEach((index) => {
//       if (!excluded.includes(index) && data[DAM_COLLECTION_FIELD_KEY[index]]) {
//         formData[DAM_COLLECTION_API_RESPONSE_FIELD_KEY[index]] =
//           data[DAM_COLLECTION_FIELD_KEY[index]];
//       }
//     });
//     formData.append(
//       [DAM_COLLECTION_API_RESPONSE_FIELD_KEY.PARENT_ID],
//       data[DAM_COLLECTION_FIELD_KEY.PARENT_ID] ?? 0
//     );
//     return formData;
//   };
// }

// class AssetsModel extends BaseModel {
//   constructor(entities) {
//     super(entities);
//     if (entities) {
//       this.items = entities._embedded.item.map((element) => {
//         return new AssetsItemModel(element);
//       });
//       this.items.pagination = this.getPagination();
//     }
//   }
// }
// class AssetsItemModel extends BaseItemModel {
//   id = null;
//   collection_id = null;
//   name = null;
//   alias = null;
//   uuid = null;
//   file_extention = null;
//   file_size = null;
//   file_mine_type = null;
//   type_id = null;
//   type = null;
//   download_url = null;
//   owner = null;
//   last_modified = null;
//   constructor(entity) {
//     super(entity);
//     if (entity) {
//       this.id = entity[DAM_ASSETS_FIELD_KEY.ID] ?? '';
//       this.name = entity[DAM_ASSETS_FIELD_KEY.NAME] ?? '';
//       this.collection_id = entity[DAM_ASSETS_FIELD_KEY.COLLECTION_ID] ?? '';
//       this.alias = entity[DAM_ASSETS_FIELD_KEY.ALIAS] ?? '';
//       this.uuid = entity[DAM_ASSETS_FIELD_KEY.UUID] ?? '';
//       this.file_extention = entity[DAM_ASSETS_FIELD_KEY.FILE_EXTENTION] ?? '';
//       this.file_mine_type = entity[DAM_ASSETS_FIELD_KEY.FILE_MIME_TYPE] ?? '';
//       this.file_size = entity[DAM_ASSETS_FIELD_KEY.FILE_SIZE]
//         ? (+entity[DAM_ASSETS_FIELD_KEY.FILE_SIZE] / 1024).toFixed(2)
//         : '';
//       this.type_id = entity[DAM_ASSETS_FIELD_KEY.TYPE_ID] ?? '';
//       this.type = entity[DAM_ASSETS_FIELD_KEY.TYPE] ?? '';
//       this.download_url = entity[DAM_ASSETS_FIELD_KEY.DOWNLOAD_URL] ?? '';
//       this.owner = entity[DAM_ASSETS_FIELD_KEY.OWNER] ?? '';
//       this.last_modified = Utils.formatDatetimeByLocale(entity[DAM_ASSETS_FIELD_KEY.LAST_MODIFIED]);
//     }
//   }

//   toObject = () => {
//     return {};
//   };

//   toJSON = () => {
//     return {
//       ...this.baseToJSON(),
//       [DAM_ASSETS_FIELD_KEY.ID]: this.id,
//       [DAM_ASSETS_FIELD_KEY.NAME]: this.name,
//       [DAM_ASSETS_FIELD_KEY.COLLECTION_ID]: this.collection_id,
//       [DAM_ASSETS_FIELD_KEY.ALIAS]: this.alias,
//       [DAM_ASSETS_FIELD_KEY.UUID]: this.uuid,
//       [DAM_ASSETS_FIELD_KEY.FILE_EXTENTION]: this.file_extention,
//       [DAM_ASSETS_FIELD_KEY.FILE_MIME_TYPE]: this.file_mine_type,
//       [DAM_ASSETS_FIELD_KEY.FILE_SIZE]: this.file_size,
//       [DAM_ASSETS_FIELD_KEY.TYPE_ID]: this.type_id,
//       [DAM_ASSETS_FIELD_KEY.TYPE]: this.type,
//       [DAM_ASSETS_FIELD_KEY.DOWNLOAD_URL]: this.download_url,
//       [DAM_ASSETS_FIELD_KEY.LAST_MODIFIED]: this.last_modified,
//       [DAM_ASSETS_FIELD_KEY.OWNER]: this.owner,
//     };
//   };

//   static __transformItemToApiOfCreation = (data) => {
//     let formData = new FormData();
//     const excluded = [DAM_ASSETS_FIELD_KEY.COLLECTION_ID];
//     Object.keys(DAM_ASSETS_API_FIELD_KEY).forEach((index) => {
//       if (!excluded.includes(index) && data[DAM_ASSETS_FIELD_KEY[index]]) {
//         formData.append([DAM_ASSETS_API_FIELD_KEY[index]], data[DAM_ASSETS_FIELD_KEY[index]]);
//       }
//     });
//     formData.append(
//       [DAM_ASSETS_API_FIELD_KEY.COLLECTION_ID],
//       data[DAM_ASSETS_FIELD_KEY.COLLECTION_ID] ?? 0
//     );
//     return formData;
//   };

//   static __transformItemToApiOfUpdation = (data) => {
//     let formData = {};

//     Object.keys(DAM_ASSETS_API_FIELD_KEY).forEach((index) => {
//       if (data[DAM_ASSETS_FIELD_KEY[index]]) {
//         formData[DAM_ASSETS_API_FIELD_KEY[index]] = data[DAM_ASSETS_FIELD_KEY[index]];
//       }
//     });

//     return formData;
//   };
// }

// class SubscriptionModel extends BaseModel {
//   constructor(entities) {
//     super(entities);
//     if (entities) {
//       this.items = entities._embedded.item.map((element) => {
//         return new SubsctiptionItemModel(element);
//       });
//       this.items.pagination = this.getPagination();
//     }
//   }
// }
// class SubsctiptionItemModel extends BaseItemModel {
//   id = null;
//   product = null;
//   product_type = null;
//   product_option = null;
//   product_storage_usage = null;
//   license = null;
//   package = null;
//   package_name = null;
//   package_storage_limit = null;
//   constructor(entity) {
//     super(entity);
//     if (entity) {
//       this.id = entity[DAM_SUBSCIPTION_API_FIELD_KEY.ID] ?? '';
//       if (entity[DAM_SUBSCIPTION_FIELD_KEY.PRODUCT]) {
//         this.product = {
//           [DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_TYPE]:
//             entity[DAM_SUBSCIPTION_FIELD_KEY.PRODUCT][0][DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_TYPE] ??
//             '',
//           [DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_OPTION]:
//             entity[DAM_SUBSCIPTION_FIELD_KEY.PRODUCT][0][
//               DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_OPTION
//             ] ?? {},
//           [DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_STORAGE_USAGE]:
//             Math.floor(
//               +entity[DAM_SUBSCIPTION_FIELD_KEY.PRODUCT][0][
//                 DAM_SUBSCIPTION_FIELD_KEY.PRODUCT_STORAGE_USAGE
//               ] / 1000000
//             ) ?? 0,
//         };
//       }
//       this.license = entity[DAM_SUBSCIPTION_FIELD_KEY.LICENSE] ?? '';
//       if (entity[DAM_SUBSCIPTION_FIELD_KEY.PACKAGE]) {
//         this.package = {
//           [DAM_SUBSCIPTION_FIELD_KEY.PACKAGE_NAME]:
//             entity[DAM_SUBSCIPTION_FIELD_KEY.PACKAGE][DAM_SUBSCIPTION_FIELD_KEY.PACKAGE_NAME] ?? '',
//           [DAM_SUBSCIPTION_FIELD_KEY.PACKAGE_STORAGE_LIMIT]:
//             Math.floor(
//               entity[DAM_SUBSCIPTION_FIELD_KEY.PACKAGE][
//                 DAM_SUBSCIPTION_FIELD_KEY.PACKAGE_STORAGE_LIMIT
//               ].replace(',', '')
//             ) ?? '',
//         };
//       }
//     }
//   }

//   toObject = () => {
//     return {};
//   };

//   toJSON = () => {
//     return {
//       ...this.baseToJSON(),
//       [DAM_SUBSCIPTION_FIELD_KEY.ID]: this.id,
//       [DAM_SUBSCIPTION_FIELD_KEY.PRODUCT]: this.product,
//       [DAM_SUBSCIPTION_FIELD_KEY.PACKAGE]: this.package,
//       [DAM_SUBSCIPTION_FIELD_KEY.LICENSE]: this.license,
//     };
//   };
// }

class DashboardModel extends BaseItemModel {
  visitor = null;
  total_revenue = null;
  sessions = null;
  conversion_rate = null;
  revenue_by_subscribers = null;
  new_users = null;
  continents = null;
  constructor(entity) {
    super(entity);
    if (entity) {
      if (entity[BI_WIDGET_FIELD_KEY.VISITOR]) {
        this.visitor = {
          [BI_WIDGET_FIELD_KEY.VALUE]:
            entity[BI_WIDGET_FIELD_KEY.VISITOR][BI_WIDGET_FIELD_KEY.VALUE] ?? '',
          [BI_WIDGET_FIELD_KEY.PERCENT]:
            entity[BI_WIDGET_FIELD_KEY.VISITOR][BI_WIDGET_FIELD_KEY.PERCENT] ?? '',
          [BI_WIDGET_FIELD_KEY.INCREASE]:
            entity[BI_WIDGET_FIELD_KEY.VISITOR][BI_WIDGET_FIELD_KEY.INCREASE] ?? '',
        };
      }
      if (entity[BI_WIDGET_FIELD_KEY.TOTAL_REVENUE]) {
        this.total_revenue = {
          [BI_WIDGET_FIELD_KEY.VALUE]:
            entity[BI_WIDGET_FIELD_KEY.TOTAL_REVENUE][BI_WIDGET_FIELD_KEY.VALUE] ?? '',
          [BI_WIDGET_FIELD_KEY.PERCENT]:
            entity[BI_WIDGET_FIELD_KEY.TOTAL_REVENUE][BI_WIDGET_FIELD_KEY.PERCENT] ?? '',
          [BI_WIDGET_FIELD_KEY.INCREASE]:
            entity[BI_WIDGET_FIELD_KEY.TOTAL_REVENUE][BI_WIDGET_FIELD_KEY.INCREASE] ?? '',
        };
      }
      if (entity[BI_WIDGET_FIELD_KEY.SESSIONS]) {
        this.sessions = {
          [BI_WIDGET_FIELD_KEY.VALUE]:
            entity[BI_WIDGET_FIELD_KEY.SESSIONS][BI_WIDGET_FIELD_KEY.VALUE] ?? '',
          [BI_WIDGET_FIELD_KEY.PERCENT]:
            entity[BI_WIDGET_FIELD_KEY.SESSIONS][BI_WIDGET_FIELD_KEY.PERCENT] ?? '',
          [BI_WIDGET_FIELD_KEY.INCREASE]:
            entity[BI_WIDGET_FIELD_KEY.SESSIONS][BI_WIDGET_FIELD_KEY.INCREASE] ?? '',
        };
      }
      if (entity[BI_WIDGET_FIELD_KEY.CONVERSION_RATE]) {
        this.conversion_rate = {
          [BI_WIDGET_FIELD_KEY.VALUE]:
            entity[BI_WIDGET_FIELD_KEY.CONVERSION_RATE][BI_WIDGET_FIELD_KEY.VALUE] ?? '',
          [BI_WIDGET_FIELD_KEY.PERCENT]:
            entity[BI_WIDGET_FIELD_KEY.CONVERSION_RATE][BI_WIDGET_FIELD_KEY.PERCENT] ?? '',
          [BI_WIDGET_FIELD_KEY.INCREASE]:
            entity[BI_WIDGET_FIELD_KEY.CONVERSION_RATE][BI_WIDGET_FIELD_KEY.INCREASE] ?? '',
        };
      }
      if (entity[BI_DASHBOARD_FIELD_KEY.REVENUE_BY_SUBSCRIBERS]) {
        this.revenue_by_subscribers = entity[BI_DASHBOARD_FIELD_KEY.REVENUE_BY_SUBSCRIBERS].map(
          (item) => {
            return {
              [BI_CONTINENTS_KEY.TYPE]: item[BI_CONTINENTS_KEY.TYPE],
              [BI_WIDGET_FIELD_KEY.PERCENT]: item[BI_WIDGET_FIELD_KEY.PERCENT],
              [BI_WIDGET_FIELD_KEY.VALUE]: item[BI_WIDGET_FIELD_KEY.VALUE],
            };
          }
        );
      }
      if (entity[BI_NEW_USERS_KEY.NEW_USERS]) {
        this.new_users = entity[BI_NEW_USERS_KEY.NEW_USERS].map((item) => {
          return {
            [BI_NEW_USERS_KEY.NAME]: item[BI_NEW_USERS_KEY.NAME],
            [BI_NEW_USERS_KEY.EMAIL]: item[BI_NEW_USERS_KEY.EMAIL],
            [BI_NEW_USERS_KEY.DATE]: item[BI_NEW_USERS_KEY.DATE],
            [BI_NEW_USERS_KEY.STATUS]: item[BI_NEW_USERS_KEY.STATUS],
          };
        });
      }
      if (entity[BI_CONTINENTS_KEY.CONTINENTS]) {
        this.continents = entity[BI_CONTINENTS_KEY.CONTINENTS].map((item) => {
          return {
            [BI_CONTINENTS_KEY.COUNTRY]: item[BI_CONTINENTS_KEY.COUNTRY],
            [BI_CONTINENTS_KEY.COUNTRY_CODE]: item[BI_CONTINENTS_KEY.COUNTRY_CODE],
            [BI_CONTINENTS_KEY.FLAG]: item[BI_CONTINENTS_KEY.FLAG],
            [BI_CONTINENTS_KEY.VIEWS]: item[BI_CONTINENTS_KEY.VIEWS],
          };
        });
      }
    }
  }
  toObject = () => {
    return {};
  };
  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [BI_WIDGET_FIELD_KEY.VISITOR]: this.visitor,
      [BI_WIDGET_FIELD_KEY.TOTAL_REVENUE]: this.total_revenue,
      [BI_WIDGET_FIELD_KEY.SESSIONS]: this.sessions,
      [BI_WIDGET_FIELD_KEY.CONVERSION_RATE]: this.conversion_rate,
      [BI_DASHBOARD_FIELD_KEY.REVENUE_BY_SUBSCRIBERS]: this.revenue_by_subscribers,
      [BI_NEW_USERS_KEY.NEW_USERS]: this.new_users,
      [BI_CONTINENTS_KEY.CONTINENTS]: this.continents,
    };
  };
}
class DomainModel extends BaseItemModel {
  name = null;
  domain = null;
  constructor(entity) {
    super(entity);
    if (entity) {
      this.name = entity[BI_DOMAIN_FIELD_KEY.NAME][BI_DOMAIN_FIELD_KEY.NAME] ?? '';
      this.domain = entity[BI_DOMAIN_FIELD_KEY.DOMAIN][BI_DOMAIN_FIELD_KEY.DOMAIN] ?? '';
    }
  }
  toObject = () => {
    return {};
  };
  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [BI_DOMAIN_FIELD_KEY.NAME]: this.name,
      [BI_DOMAIN_FIELD_KEY.DOMAIN]: this.domain,
    };
  };
}
class VisitorModel extends BaseModel {
  constructor(entities) {
    super(entities);
    if (entities) {
      this.items = entities._embedded.item.map((element) => {
        return new VisitorItemModel(element);
      });
      this.items.pagination = this.getPagination();
    }
  }
}
class VisitorItemModel extends BaseItemModel {
  visits = null;
  date = null;
  constructor(entity) {
    super(entity);
    if (entity) {
      this.visits = entity[BI_VISITORS_FIELD_KEY.VISITS] ?? '';
      this.date = entity[BI_VISITORS_FIELD_KEY.DATE] ?? '';
    }
  }
  toObject = () => {
    return {};
  };
  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [BI_VISITORS_FIELD_KEY.VISITS]: this.visits,
      [BI_VISITORS_FIELD_KEY.DATE]: this.date,
    };
  };
}

class SummaryModel extends BaseItemModel {
  number_of_visitors = null;
  number_of_page_views = null;
  number_of_unique_page_views = null;
  average_session_duration = null;
  number_of_pages_per_session = null;
  bounce_rate = null;
  constructor(entity) {
    super(entity);
    if (entity) {
      this.number_of_visitors = entity[BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS] ?? '';
      this.number_of_page_views = entity[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS] ?? '';
      this.number_of_unique_page_views =
        entity[BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS] ?? '';
      this.average_session_duration = entity[BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION] ?? '';
      this.number_of_pages_per_session =
        entity[BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION] ?? '';
      this.bounce_rate = entity[BI_SUMMARY_FIELD_KEY.BOUNCE_RATE] ?? '';
    }
  }
  toObject = () => {
    return {};
  };
  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [BI_SUMMARY_FIELD_KEY.NUMBER_OF_VISITORS]: this.number_of_visitors,
      [BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGE_VIEWS]: this.number_of_page_views,
      [BI_SUMMARY_FIELD_KEY.NUMBER_OF_UNIQUE_PAGE_VIEWS]: this.number_of_unique_page_views,
      [BI_SUMMARY_FIELD_KEY.AVERAGE_SESSION_DURATION]: this.average_session_duration,
      [BI_SUMMARY_FIELD_KEY.NUMBER_OF_PAGES_PER_SESSION]: this.number_of_pages_per_session,
      [BI_SUMMARY_FIELD_KEY.BOUNCE_RATE]: this.bounce_rate,
    };
  };
}

export {
  // ColectionModel,
  // CollectionItemModel,
  // AssetsItemModel,
  // AssetsModel,
  // SubscriptionModel,
  // SubsctiptionItemModel,
  DomainModel,
  DashboardModel,
  VisitorModel,
  SummaryModel,
};
