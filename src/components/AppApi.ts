import { IApi, IProductListResponse, IOrder, IOrderResponse } from "../types";

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

 
  getProducts(): Promise<IProductListResponse> {
    return this._baseApi.get<IProductListResponse>("/product");
  }


  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this._baseApi.post<IOrderResponse>("/order", order);
  }
}
