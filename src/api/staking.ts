import {ApiClient} from "api/client";
import {PageInfoDto} from "../models";
import {
  StakingDtoCreateRequest,
  StakingDtoFetchRequest,
  StakingDtoFetchResponse,
  StakingDtoUpdateRequest
} from '../models/Staking';
import { UserDtoFetchByStakingIdRequest } from '../models/User';

export default class StakingApi extends ApiClient {
  private static classInstance?: StakingApi;

  private constructor() {
    super('/api/staking');
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new StakingApi();
    }
    return this.classInstance;
  }

  public async fetch(params: StakingDtoFetchRequest): Promise<PageInfoDto> {
    return await super.get('/', params);
  }

  public async create(params: StakingDtoCreateRequest): Promise<any> {
    return await super.post('/', params);
  }

  public async fetchById(id: string): Promise<StakingDtoFetchResponse> {
    return await super.get('/' + id);
  }

  public async delete(id: string): Promise<any> {
    return await super.delete('/' + id);
  }

  public async fetchApplyById(params: UserDtoFetchByStakingIdRequest): Promise<PageInfoDto> {
    return await super.get('/apply', params);
  }

  public async update(id: string, params: StakingDtoUpdateRequest): Promise<any> {
    return await super.patch('/' + id, params);
  }
}