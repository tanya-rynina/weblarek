import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { CardBasket } from './CardBasket';
import { IProduct } from '../../types';
import { formatPrice } from '../../utils/utils';

export class Basket extends Component<{ items: IProduct[]; total: number }> {
    private listContainer: HTMLElement;
    private totalElement: HTMLElement;
    private button: HTMLButtonElement;
    private cardTemplate: HTMLTemplateElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.listContainer = container.querySelector('.basket__list')!;
        this.totalElement = container.querySelector('.basket__price')!;
        this.button = container.querySelector('.basket__button')!;
        this.cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
        
        this.button.addEventListener('click', () => {
            events.emit(EVENTS.ORDER_OPEN);
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    set items(items: IProduct[]) {
        this.listContainer.replaceChildren();
        if (items.length === 0) return;
        items.forEach((item, index) => {
            const card = new CardBasket(this.cardTemplate, this.events);
            this.listContainer.appendChild(
                card.render({
                    id: item.id,
                    title: item.title,
                    price: formatPrice(item.price),
                    category: item.category,
                    image: item.image,
                    index: index + 1,
                })
            );
        });
        this.button.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}