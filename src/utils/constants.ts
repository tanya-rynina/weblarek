export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`; 

export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

export const categoryMap: Record<string, string> = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'кнопка': 'card__category_button',
  'дополнительное': 'card__category_additional',
  'другое': 'card__category_other',
};

export const EVENTS = {
    
    CATALOG_CHANGED: 'catalog:changed',
    PREVIEW_CHANGED: 'preview:changed',
    CART_CHANGED: 'cart:changed',
    BUYER_CHANGED: 'buyer:changed',

    
    CARD_SELECT: 'card:select',
    CART_OPEN: 'cart:open',
    CART_REMOVE: 'cart:remove',
    ORDER_OPEN: 'order:open',
    ORDER_SUBMIT: 'order:submit',
    CONTACTS_SUBMIT: 'contacts:submit',
    FORM_CHANGE: 'form:change',
    MODAL_OPEN: 'modal:open',
    MODAL_CLOSE: 'modal:close',
    CARD_TOGGLE: 'card:toggle',
} as const;

export const settings = {

};