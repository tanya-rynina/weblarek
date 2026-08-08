import { IProduct } from '../../types';

/**
 * Модель каталога товаров.
 * Хранит список всех товаров и текущий товар для предпросмотра.
 */
export class ProductCatalog {
    private _items: IProduct[] = [];
    private _preview: IProduct | null = null;

    /** Сохранить массив товаров */
    setItems(items: IProduct[]): void {
        this._items = items;
    }

    /** Получить все товары */
    getItems(): IProduct[] {
        return this._items;
    }

    /** Получить товар по идентификатору */
    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    /** Установить товар для детального просмотра */
    setPreview(item: IProduct): void {
        this._preview = item;
    }

    /** Получить товар для детального просмотра */
    getPreview(): IProduct | null {
        return this._preview;
    }
}