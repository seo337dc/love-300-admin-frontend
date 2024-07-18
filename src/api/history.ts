import {ApiClient} from "api/client";
import {PageInfoDto} from "../models";
import {
  HistoryDtoFetchByUserIdRequest,
  HistoryDtoFetchRequest,
} from "../models/History";

export default class HistoryApi extends ApiClient {
  private static classInstance?: HistoryApi;

  private constructor() {
    super('/api/history');
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new HistoryApi();
    }
    return this.classInstance;
  }

  public async fetch(params: HistoryDtoFetchRequest): Promise<PageInfoDto> {
    return await super.get('/', params);
  }

  public async fetchByUserId(params: HistoryDtoFetchByUserIdRequest): Promise<PageInfoDto> {
    return await super.get('/fetchByUserId', params);
  }
}