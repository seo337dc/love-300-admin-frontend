import { UserDtoFetchResponse } from "../User";

export class LockupDtoFetchRequest {
  page?: number;
  size?: number;
  status?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
}

export class LockupDtoFetchResponse {
  id?: number;
  user?: UserDtoFetchResponse;
  title?: string;
  status?: number;
  amount?: number;
  releaseAmount?: number;
  withdrawalAmount?: number;
  releaseRate?: number;
  startDate?: string;
  endDate?: string;
  regDate?: string;
}

export class LockupDtoCreateRequest {
  title?: string;
  userId?: number;
  amount?: number;
  startDate?: string;
  endDate?: string;
  releaseRate?: number;
}

export class LockupDtoUpdateRequest {
  title?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  releaseRate?: number;
}
