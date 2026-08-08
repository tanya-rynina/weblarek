import { IProduct } from '../../types';

/**
 * Модель корзины.
 * Хранит товары, выбранные пользователем для покупки.
 */
export class Cart {
    private _items: IProduct[] = [];

    /** Вернуть список товаров в корзине */
    getItems(): IProduct[] {
        return this._items;
    }

    /** Добавить товар в корзину (если его ещё нет) */
    add(item: IProduct): void {
        if (!this.contains(item.id)) {
            this._items.push(item);
        }
    }

    /** Удалить товар из корзины по id */
    remove(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    /** Очистить корзину */
    clear(): void {
        this._items = [];
    }

    /** Получить общую стоимость товаров в корзине */
    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    /** Получить количество товаров в корзине */
    getCount(): number {
        return this._items.length;
    }

    /** Проверить, есть ли товар с указанным id в корзине */
    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}