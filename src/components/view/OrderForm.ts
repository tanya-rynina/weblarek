import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IOrderForm, TPayment } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { EVENTS } from '../../utils/constants';

export class OrderForm extends Form<IOrderForm> {
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;
    private addressInput: HTMLInputElement;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template) as HTMLFormElement, events);
         this.submitButton = this.container.querySelector('.order__button')!;

        this.cardButton = this.container.querySelector('button[name="card"]')!;
        this.cashButton = this.container.querySelector('button[name="cash"]')!;
        this.addressInput = this.container.querySelector('input[name="address"]')!;

        this.cardButton.addEventListener('click', () => {
            events.emit(EVENTS.FORM_CHANGE, { field: 'payment', value: 'card' });
        });
        this.cashButton.addEventListener('click', () => {
            events.emit(EVENTS.FORM_CHANGE, { field: 'payment', value: 'cash' });
        });
        this.addressInput.addEventListener('input', () => {
            events.emit(EVENTS.FORM_CHANGE, { field: 'address', value: this.addressInput.value });
        });
    }

    set payment(value: TPayment) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected onSubmit() {
        this.events.emit(EVENTS.ORDER_SUBMIT);
    }

    render(): HTMLElement {
        return this.container;
    }
}