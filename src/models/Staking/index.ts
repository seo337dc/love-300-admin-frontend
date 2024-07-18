export class StakingDtoFetchRequest {
  page?: number;
  size?: number;
  text?: string;
  startDate?: string;
  endDate?: string;
}

export class StakingDtoFetchResponse {
  id?: number;
  title?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  isDuplicatedApply?: boolean;
  rewardRate?: number;
  regDate?: string;

}

export class StakingDtoCreateRequest {
  title?: string;
  startDate?: string;
  endDate?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  isDuplicatedApply?: boolean;
  rewardRate?: number;
}

export class StakingDtoUpdateRequest {
  title?: string;
  startDate?: string;
  endDate?: string;
  applyStartDate?: string;
  applyEndDate?: string;
  isDuplicatedApply?: boolean;
  rewardRate?: number;
}
