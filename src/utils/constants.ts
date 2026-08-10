/* Константа для получения полного пути для сервера. Для выполнения запроса 
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

/* Константа для формирования полного пути к изображениям карточек. 
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const EVENTS = {
    // Модели
    CATALOG_CHANGED: 'catalog:changed',
    PREVIEW_CHANGED: 'preview:changed',
    CART_CHANGED: 'cart:changed',
    BUYER_CHANGED: 'buyer:changed',

    // Представление
    CARD_SELECT: 'card:select',
    CART_OPEN: 'cart:open',
    CART_REMOVE: 'cart:remove',
    ORDER_OPEN: 'order:open',
    ORDER_SUBMIT: 'order:submit',
    CONTACTS_SUBMIT: 'contacts:submit',
    FORM_ERRORS: 'form:errors',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    CARD_TOGGLE: 'card:toggle',   // новое событие для кнопки "Купить/Удалить"
} as const;

export const settings = {

};