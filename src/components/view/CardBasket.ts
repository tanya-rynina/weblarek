import { Card, ICommonCard } from './Card';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { cloneTemplate, formatPrice } from '../../utils/utils';

export interface IBasketCard extends ICommonCard {
    index: number;
}

export class CardBasket extends Card<IBasketCard> {
    private indexElement: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template));
        this.indexElement = this.container.querySelector('.basket__item-index')!;
        this.deleteButton = this.container.querySelector('.basket__item-delete')!;
        
        this.deleteButton.addEventListener('click', (ev) => {
            ev.stopPropagation();
            events.emit(EVENTS.CART_REMOVE, { id: this.container.dataset.id });
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }

    render(data?: Partial<IBasketCard>): HTMLElement {
        if (data?.id) this.container.dataset.id = data.id;
        super.render(data);
        if (data?.index !== undefined) {
            this.index = data.index;
        }
        return this.container;
    }
}