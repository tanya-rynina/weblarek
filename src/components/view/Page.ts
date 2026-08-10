import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class Page extends Component<null> {
    private basketButton: HTMLElement;
    private basketCounter: HTMLElement;
    private galleryContainer: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = container.querySelector('.header__basket')!;
        this.basketCounter = container.querySelector('.header__basket-counter')!;
        this.galleryContainer = container.querySelector('.gallery')!;

        this.basketButton.addEventListener('click', () => {
            events.emit(EVENTS.CART_OPEN);
        });
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }

    set gallery(items: HTMLElement[]) {
        this.galleryContainer.replaceChildren(...items);
    }
}