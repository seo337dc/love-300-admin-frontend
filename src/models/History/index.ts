export class HistoryDtoFetchRequest {
  page?: number;
  size?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
  deposit?: number;
}

export class HistoryDtoFetchResponse {
  idx?: number;
  txDate?: string;
  txFrom?: string;
  txTo?: string;
  amount?: string;
  txHash?: string;
  unit?: string;
  email?: string;
  deposit?: boolean;
}

export class HistoryDtoFetchByUserIdRequest {
  page?: number;
  size?: number;
  userId?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
  deposit?: number;
}

export class HistoryDtoFetchByUserIdResponse {
  idx?: number;
  txDate?: string;
  txFrom?: string;
  txTo?: string;
  amount?: string;
  txHash?: string;
  unit?: string;
  deposit?: boolean;
}