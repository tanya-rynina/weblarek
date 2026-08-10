import { Card, ICommonCard } from './Card';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { cloneTemplate, formatPrice } from '../../utils/utils';

export interface IPreviewCard extends ICommonCard {
    description: string;
    inBasket: boolean;
}

export class CardPreview extends Card<IPreviewCard> {
    private descriptionElement: HTMLElement;
    private productId: string = '';

    constructor(template: HTMLTemplateElement, events: IEvents) {
        super(cloneTemplate(template));
        this.descriptionElement = this.container.querySelector('.card__text')!;
        this.buttonElement = this.container.querySelector('.card__button') as HTMLButtonElement;
        
        this.buttonElement.addEventListener('click', () => {
            events.emit(EVENTS.CARD_TOGGLE, { id: this.productId });
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    render(data?: Partial<IPreviewCard>): HTMLElement {
        if (data?.id) {
            this.productId = data.id;
        }
        super.render(data);
        if (data) {
            this.buttonText = data.inBasket ? 'Удалить из корзины' : 
                              (data.price ? 'Купить' : 'Недоступно');
            this.disableButton(!data.price);
        }
        return this.container;
    }
}