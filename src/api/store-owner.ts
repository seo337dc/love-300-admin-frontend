import { ApiClient } from "api/client";
import { PageInfoDto } from "../models";
import { StoreOwnerFetchRequest } from "models/StoreOwner";

export default class StoreOwnerApi extends ApiClient {
  private static classInstance?: StoreOwnerApi;

  private constructor() {
    super("/api/store-owner");
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new StoreOwnerApi();
    }
    return this.classInstance;
  }

  public async fetch(params: StoreOwnerFetchRequest): Promise<PageInfoDto> {
    return await super.get("/", params);
  }
}
