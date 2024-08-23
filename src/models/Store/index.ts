export class StoreDtoFetchRequest {
  page?: number;
  size?: number;
  status?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
}

export class StoreDtoUpdateRequest {
  id?: number;
  rejectReason: string;
  approveStatus: number;
}

export class StoreDtoFetchResponse {
  approveStatus: number;
  businessHours: string;
  businessNumber: string;
  createDate: string;
  description: string;
  detailAddress: string;
  englishAddress: string;
  id: number;
  jibunAddress: string;
  latitude: number;
  longitude: number;
  rejectReason: string;
  representativeName: string;
  representativePhone: string;
  roadAddress: string;
  storeType: number;
  title: string;
}

export class StoreContent {
  id: number; // 0;
  createDate: string; // "2024-08-23T13:03:17.471Z";
  businessNumber: string; //"string";
  approveStatus: number; // 0;
  rejectReason: string; //"string";
  englishAddress: string; //"string";
  roadAddress: string; //"string";
  jibunAddress: string; //"string";
  detailAddress: string; //"string";
  title: string; //"string";
  description: string; //"string";
  latitude: number; // 0;
  longitude: number; // 0;
  representativeName: string; //"string";
  representativePhone: string; //"string";
  businessHours: string; //"string";
  storeType: number; // 0;
}

export class PageInfo {
  totalPages: 0;
  totalElements: 0;
  size: 0;
  first: true;
  last: true;
  numberOfElements: 0;
  empty: true;
  number: 0;
}
export class SortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export class Pageable {
  offset: number;
  pageNumber: number; // 0;
  pageSize: number; // 0;
  paged: boolean;
  unpaged: boolean;
  sort: SortInfo;
}

export class StoreListDtoResponse extends PageInfo {
  content: StoreContent[];
  sort: SortInfo;
  pageable: Pageable;
}

export class StoreDtoResponse {
  id: number; // 0;
  createDate: string; //  "2024-08-23T13:15:00.635Z";
  businessNumber: string;
  approveStatus: number; // 0;
  rejectReason: string;
  englishAddress: string;
  roadAddress: string;
  jibunAddress: string;
  detailAddress: string;
  title: string;
  description: string;
  latitude: number; // 0;
  longitude: number; // 0;
  representativeName: string;
  representativePhone: string;
  businessHours: string;
  storeType: number; // 0;
}
