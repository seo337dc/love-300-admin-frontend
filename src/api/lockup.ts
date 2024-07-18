import {ApiClient} from "api/client";
import {PageInfoDto} from "../models";
import {
  LockupDtoCreateRequest,
  LockupDtoFetchRequest,
  LockupDtoFetchResponse,
  LockupDtoUpdateRequest
} from "../models/Lockup";

export default class LockupApi extends ApiClient {
  private static classInstance?: LockupApi;

  private constructor() {
    super('/api/lockup');
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new LockupApi();
    }
    return this.classInstance;
  }

  public async fetch(params: LockupDtoFetchRequest): Promise<PageInfoDto> {
    return await super.get('/', params);
  }

  public async create(params: LockupDtoCreateRequest): Promise<any> {
    return await super.post('/', params);
  }

  public async fetchById(id: string): Promise<LockupDtoFetchResponse> {
    return await super.get('/' + id);
  }

  public async delete(id: string): Promise<any> {
    return await super.delete('/' + id);
  }

  public async update(id: string, params: LockupDtoUpdateRequest): Promise<any> {
    return await super.patch('/' + id, params);
  }
}