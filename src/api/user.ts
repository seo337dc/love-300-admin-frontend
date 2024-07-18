import {ApiClient} from "api/client";
import {
  UserDtoFetchByIdResponse, UserDtoFetchByStakingIdRequest,
  UserDtoFetchRequest,
} from 'models/User';
import {PageInfoDto} from "../models";
import { HistoryDtoFetchByUserIdRequest } from '../models/History';

export default class UserApi extends ApiClient {
  private static classInstance?: UserApi;

  private constructor() {
    super('/api/user');
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new UserApi();
    }
    return this.classInstance;
  }

  public async fetch(params: UserDtoFetchRequest): Promise<PageInfoDto> {
    return await super.get('/', params);
  }

  public async fetchById(id: string): Promise<UserDtoFetchByIdResponse> {
    return await super.get('/' + id);
  }
}