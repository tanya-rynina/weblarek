import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';

export class OrderSuccess extends Component<{ total: number }> {
    private messageElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, private events: IEvents) {
        super(cloneTemplate(template));
        this.messageElement = this.container.querySelector('.order-success__description')!;
        this.closeButton = this.container.querySelector('.order-success__close')!;
        
        this.closeButton.addEventListener('click', () => {
            events.emit(EVENTS.MODAL_CLOSE);
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    set total(value: number) {
        this.messageElement.textContent = `Списано ${value} синапсов`;
    }
}