import {ApiClient} from "api/client";
import {
  AdminDtoSignInRequest, AdminDtoTransactionRequest,
} from "../models/Admin";

export default class AdminApi extends ApiClient {
  private static classInstance?: AdminApi;

  private constructor() {
    super('/api/admin');
  }
  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new AdminApi();
    }
    return this.classInstance;
  }

  public async signIn(params: AdminDtoSignInRequest): Promise<any> {
    return await super.post('/signIn', params);
  }

  public async transaction(params: AdminDtoTransactionRequest): Promise<any> {
    return await super.post('/transaction', params);
  }
}