import { IBuyer, ValidationErrors } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Buyer {
    private payment: IBuyer['payment'] = '';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(private events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        Object.assign(this, data);
        this.events.emit(EVENTS.BUYER_CHANGED, this.getData());
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit(EVENTS.BUYER_CHANGED, this.getData());
    }

    validate(): ValidationErrors {
        const errors: ValidationErrors = {};
        if (!this.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.address.trim()) {
            errors.address = 'Введите адрес доставки';
        }
        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        return errors;
    }
}