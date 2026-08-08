export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Тип способа оплаты
export type TPayment = 'card' | 'cash';

// Товар
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// Полностью заполненные данные покупателя (для отправки заказа)
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// Данные покупателя в процессе заполнения (модель)
export interface IBuyerData {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

// Заказ, отправляемый на сервер
export interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

// Ответ сервера со списком товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Ответ сервера при успешном оформлении заказа
export interface IOrderResponse {
    id: string;
    total: number;
}