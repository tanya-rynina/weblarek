import { Card, ICommonCard } from './Card';
import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { cloneTemplate, formatPrice } from '../../utils/utils';

export interface ICatalogCard extends Pick<IProduct, 'id' | 'title' | 'category' | 'image'> {
    price: string;
}

export class CardCatalog extends Card<ICatalogCard> {
    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template));
        this.container.addEventListener('click', () => {
            events.emit(EVENTS.CARD_SELECT, { id: this.container.dataset.id });
        });
    }

    // Принимает Partial<ICatalogCard>
    render(data?: Partial<ICatalogCard>): HTMLElement {
        if (data?.id) this.container.dataset.id = data.id;
        return super.render(data);
    }
}