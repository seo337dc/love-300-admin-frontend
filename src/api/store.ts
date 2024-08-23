import { ApiClient } from "api/client";
import { PageInfoDto } from "../models";
import {
  StoreDtoFetchRequest,
  StoreDtoUpdateRequest,
  StoreDtoFetchResponse,
  StoreDtoResponse,
  StoreListDtoResponse,
} from "../models/Store";

export default class StoreApi extends ApiClient {
  private static classInstance?: StoreApi;

  private constructor() {
    super("/api/store");
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new StoreApi();
    }
    return this.classInstance;
  }

  public async fetch(
    params: StoreDtoFetchRequest
  ): Promise<StoreListDtoResponse> {
    return await super.get("/", params);
  }

  public async fetchById(id: string): Promise<StoreDtoResponse> {
    return await super.get("/" + id);
  }

  public async delete(id: string): Promise<any> {
    return await super.delete("/" + id);
  }

  public async update(id: string, params: StoreDtoUpdateRequest): Promise<any> {
    return await super.patch("/" + id, params);
  }
}
