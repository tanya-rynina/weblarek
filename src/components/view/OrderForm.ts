import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrderForm, TPayment } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { EVENTS } from '../../utils/constants';

export class OrderForm extends Form<IOrderForm> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;
    private selectedPayment: TPayment | null = null;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template) as HTMLFormElement, events);

        // Переопределяем кнопку сабмита, чтобы не цеплять первую попавшуюся .button
        this.submitButton = this.container.querySelector('.order__button')!;

        this.cardButton = this.container.querySelector('button[name="card"]')!;
        this.cashButton = this.container.querySelector('button[name="cash"]')!;
        this.addressInput = this.container.querySelector('input[name="address"]')!;

        this.cardButton.addEventListener('click', () => this.setPayment('card'));
        this.cashButton.addEventListener('click', () => this.setPayment('cash'));
        this.addressInput.addEventListener('input', () => this.emitChanges());
    }

    private setPayment(method: TPayment) {
        this.selectedPayment = method;
        this.cardButton.classList.toggle('button_alt-active', method === 'card');
        this.cashButton.classList.toggle('button_alt-active', method === 'cash');
        this.emitChanges();
    }

    private emitChanges() {
        this.events.emit(EVENTS.FORM_ERRORS, {
            payment: this.selectedPayment ?? '',
            address: this.addressInput.value,
        });
    }

    protected onSubmit() {
        this.events.emit(EVENTS.ORDER_SUBMIT);
    }

    render(data: Partial<IOrderForm> = {}): HTMLElement {
        if (data.payment) {
            this.setPayment(data.payment);
        } else {
            this.selectedPayment = null;
            this.cardButton.classList.remove('button_alt-active');
            this.cashButton.classList.remove('button_alt-active');
        }
        if (data.address !== undefined) {
            this.addressInput.value = data.address;
        }
        return this.container;
    }
}