import { IProduct } from '../../types';
import { IEvents } from '../base/Events';
import { EVENTS } from '../../utils/constants';

export class ProductCatalog {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit(EVENTS.CATALOG_CHANGED, { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItem(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(item: IProduct): void {
        this.preview = item;
        this.events.emit(EVENTS.PREVIEW_CHANGED, { preview: this.preview });
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}