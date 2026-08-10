import { Component } from '../base/Component';
import { CDN_URL, categoryMap } from '../../utils/constants';

export interface ICommonCard {
    id: string;
    title: string;
    price: string;   // уже строка для отображения
    category: string;
    image: string;
}

export class Card<T extends ICommonCard = ICommonCard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
    protected buttonElement?: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = container.querySelector('.card__title')!;
        this.priceElement = container.querySelector('.card__price')!;
        this.categoryElement = container.querySelector('.card__category') || undefined;
        this.imageElement = container.querySelector('.card__image') || undefined;
        this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement || undefined;
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: string) {
        this.priceElement.textContent = value;
    }

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            const modifier = categoryMap[value] || 'card__category_other';
            this.categoryElement.className = `card__category ${modifier}`;
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.imageElement.src = `${CDN_URL}${value}`;
            this.imageElement.alt = this.titleElement?.textContent || '';
        }
    }

    set buttonText(value: string) {
        if (this.buttonElement) {
            this.buttonElement.textContent = value;
        }
    }

    disableButton(disabled: boolean) {
        if (this.buttonElement) {
            this.buttonElement.disabled = disabled;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        return super.render(data);
    }
}