export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | '';
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends Omit<IBuyer, 'payment'> {
    payment: TPayment;
    items: string[];
    total: number;
}

export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export type ValidationErrors = Record<string, string>;

// Новые типы для форм
export interface IOrderForm {
    payment: TPayment;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}