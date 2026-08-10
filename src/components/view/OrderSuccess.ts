import { Component } from '../base/Component';
import { cloneTemplate } from '../../utils/utils';

export class OrderSuccess extends Component<{ total: number }> {
    private messageElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, onClose: () => void) {
        super(cloneTemplate(template));
        this.messageElement = this.container.querySelector('.order-success__description')!;
        this.closeButton = this.container.querySelector('.order-success__close')!;
        this.closeButton.addEventListener('click', onClose);
    }

    set total(value: number) {
        this.messageElement.textContent = `Списано ${value} синапсов`;
    }
}