import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Modal extends Component<null> {
    private contentContainer: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.closeButton = container.querySelector('.modal__close')!;
        this.contentContainer = container.querySelector('.modal__content')!;

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
        this.events.emit(EVENTS.MODAL_OPEN);
    }

    close() {
        this.container.classList.remove('modal_active');
        document.querySelector('.page')?.classList.remove('modal_active');
        this.events.emit(EVENTS.MODAL_CLOSE);
    }
}