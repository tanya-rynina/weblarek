import { IBuyer, TPayment } from '../../types';

/**
 * Модель данных покупателя.
 * Хранит и валидирует информацию о покупателе.
 */
export class Buyer {
    payment: TPayment | '' = '';
    email: string = '';
    phone: string = '';
    address: string = '';

    /**
     * Сохранить переданные поля (можно частично).
     * Позволяет обновить только одно поле, не затрагивая остальные.
     */
    setData(data: Partial<IBuyer>): void {
        Object.assign(this, data);
    }

    /** Получить все данные покупателя */
    getData(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    /** Очистить все данные покупателя */
    clear(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    /**
     * Валидация полей.
     * Возвращает объект с сообщениями об ошибках для незаполненных полей.
     * Если ошибок нет, возвращает пустой объект.
     */
    validate(): Record<string, string> {
        const errors: Record<string, string> = {};
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