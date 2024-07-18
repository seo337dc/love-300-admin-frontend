export class UserDtoFetchRequest {
  page?: number;
  size?: number;
  text?: string;
  regStartDate?: string;
  regEndDate?: string;
}

export class UserDtoFetchResponse {
  idx?: number;
  id?: string;
  signDate?: string;
  userRole?: string;
  email?: string;
  walletAddress?: string;
}

export class UserDtoFetchByIdResponse {
  idx?: number;
  id?: string;
  signDate?: string;
  userRole?: string;
  email?: string;
  walletAddress?: string;
}

export class UserDtoFetchByStakingIdRequest {
  id?: number;
  page?: number;
  size?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
}

export class UserDtoFetchByStakingIdResponse {
  id?: number;
  regDate?: string;
  rewardAmount?: number;
  seedAmount?: number;
  status?: string;
  statusLabel?: string;
  withdrawalAmount?: number;
  user?: UserDtoFetchResponse;
}
