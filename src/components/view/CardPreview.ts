import { Card, ICommonCard } from './Card';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';
import { cloneTemplate } from '../../utils/utils';

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

    // Новые сеттеры для кнопки
    set button(value: string) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = value;
        }
    }

    render(data?: Partial<IPreviewCard>): HTMLElement {
        if (data?.id) {
            this.productId = data.id;
        }
        super.render(data);
        return this.container;
    }
}