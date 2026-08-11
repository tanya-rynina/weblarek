import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<null> {
    private contentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        const closeBtn = container.querySelector('.modal__close');
        const content = container.querySelector('.modal__content');
        
        if (!closeBtn || !content) {
            throw new Error('Modal: не найдены обязательные элементы .modal__close или .modal__content');
        }
        
        this.closeButton = closeBtn as HTMLButtonElement;
        this.contentContainer = content as HTMLElement;

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (ev) => {
            if (ev.target === container) this.close();
        });
    }

    set content(element: HTMLElement) {
        this.contentContainer.replaceChildren(element);
    }

    open() {
        this.container.classList.add('modal_active');
        document.querySelector('.page')?.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
        document.querySelector('.page')?.classList.remove('modal_active');
    }
}