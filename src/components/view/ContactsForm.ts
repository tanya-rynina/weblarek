import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IContactsForm } from '../../types';
import { cloneTemplate } from '../../utils/utils';
import { EVENTS } from '../../utils/constants';

export class ContactsForm extends Form<IContactsForm> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template) as HTMLFormElement, events);
        this.emailInput = this.container.querySelector('input[name="email"]')!;
        this.phoneInput = this.container.querySelector('input[name="phone"]')!;

        this.emailInput.addEventListener('input', () => {
            events.emit(EVENTS.FORM_CHANGE, { field: 'email', value: this.emailInput.value });
        });
        this.phoneInput.addEventListener('input', () => {
            events.emit(EVENTS.FORM_CHANGE, { field: 'phone', value: this.phoneInput.value });
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onSubmit() {
        this.events.emit(EVENTS.CONTACTS_SUBMIT);
    }

    render(): HTMLElement {
        return this.container;
    }
}