import { IBuyerData } from '../../types';


export class Buyer {
    payment: IBuyerData['payment'] = '';
    email: string = '';
    phone: string = '';
    address: string = '';


    setData(data: Partial<IBuyerData>): void {
        Object.assign(this, data);
    }

   
    getData(): IBuyerData {
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
    }

 
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