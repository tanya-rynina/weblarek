import { IApi, IProductListResponse, IOrder, IOrderResponse } from "../types";

export class AppApi {
  private _baseApi: IApi;

  constructor(baseApi: IApi) {
    this._baseApi = baseApi;
  }

  /** Получить список товаров с сервера */
  getProducts(): Promise<IProductListResponse> {
    return this._baseApi.get<IProductListResponse>("/product");
  }

  /** Отправить заказ на сервер */
  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this._baseApi.post<IOrderResponse>("/order", order);
  }
}
