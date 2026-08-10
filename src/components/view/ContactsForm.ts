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

        this.emailInput.addEventListener('input', () => this.emitChanges());
        this.phoneInput.addEventListener('input', () => this.emitChanges());
    }

    private emitChanges() {
        this.events.emit(EVENTS.FORM_ERRORS, {
            email: this.emailInput.value,
            phone: this.phoneInput.value
        });
    }

    protected onSubmit() {
        this.events.emit(EVENTS.CONTACTS_SUBMIT);
    }

    render(data: Partial<IContactsForm> = {}): HTMLElement {
        if (data.email) this.emailInput.value = data.email;
        if (data.phone) this.phoneInput.value = data.phone;
        return this.container;
    }
}