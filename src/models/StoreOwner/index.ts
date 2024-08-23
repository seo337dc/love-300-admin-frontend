export class StoreOwnerFetchRequest {
  page?: number;
  size?: number;
  id?: string;
  phone?: string;
  startDate?: string;
  endDate?: string;
  sort?: [string, "ASC" | "DESC"];
}

export class StoreOwnerFetchResponse {
  idx: number;
  id: string;
  signDate: string;
  phone: string;
}
