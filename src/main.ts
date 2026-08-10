import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, EVENTS } from './utils/constants';
import { AppApi } from './components/AppApi';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Page } from './components/view/Page';
import { Modal } from './components/view/Modal';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { OrderSuccess } from './components/view/OrderSuccess';
import { IProduct, IOrder, TPayment } from './types';
import { cloneTemplate, formatPrice } from './utils/utils';

// Инициализация слоёв
const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);

// Модели данных
const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Шаблоны
const templates = {
    cardCatalog: document.getElementById('card-catalog') as HTMLTemplateElement,
    cardPreview: document.getElementById('card-preview') as HTMLTemplateElement,
    basket: document.getElementById('basket') as HTMLTemplateElement,
    order: document.getElementById('order') as HTMLTemplateElement,
    contacts: document.getElementById('contacts') as HTMLTemplateElement,
    success: document.getElementById('success') as HTMLTemplateElement,
};

// Глобальные компоненты
const page = new Page(document.querySelector('.page')!, events);
const modal = new Modal(document.getElementById('modal-container')!, events);

// Храним, какое представление сейчас в модальном окне
let currentView: string | null = null;

// Сброс текущего представления при закрытии модального окна
events.on(EVENTS.MODAL_CLOSE, () => {
    currentView = null;
});

// --- Подписки на события ---

// Изменение каталога — отрисовка галереи
events.on(EVENTS.CATALOG_CHANGED, (data: { items: IProduct[] }) => {
    const cards = data.items.map(item => {
        const card = new CardCatalog(templates.cardCatalog, events);
        return card.render({
            id: item.id,
            title: item.title,
            price: formatPrice(item.price),
            category: item.category,
            image: item.image,
        });
    });
    page.gallery = cards;
});

// Выбор товара в галерее — открытие превью
events.on(EVENTS.CARD_SELECT, (data: { id: string }) => {
    const item = catalog.getItem(data.id);
    if (item) {
        catalog.setPreview(item);
    }
});

// Изменение превью — отображаем в модалке
events.on(EVENTS.PREVIEW_CHANGED, (data: { preview: IProduct }) => {
    const preview = new CardPreview(templates.cardPreview, events);
    const inBasket = cart.contains(data.preview.id);
    modal.content = preview.render({
        id: data.preview.id,
        title: data.preview.title,
        price: formatPrice(data.preview.price),
        category: data.preview.category,
        image: data.preview.image,
        description: data.preview.description,
        inBasket,
    });
    currentView = 'preview';
    modal.open();
});

// Кнопка "Купить"/"Удалить" в превью
events.on(EVENTS.CARD_TOGGLE, (data: { id: string }) => {
    const item = catalog.getItem(data.id);
    if (!item) return;
    if (cart.contains(data.id)) {
        cart.remove(data.id);
    } else {
        cart.add(item);
    }
    modal.close();
});

// Открытие корзины
events.on(EVENTS.CART_OPEN, () => {
    showBasket();
    modal.open();
});

// Изменение корзины – обновляем счётчик и, если открыта корзина, перерисовываем её
events.on(EVENTS.CART_CHANGED, () => {
    page.counter = cart.getCount();
    if (currentView === 'basket') {
        showBasket();
    }
});

// Удаление из корзины (кнопка внутри карточки товара корзины)
events.on(EVENTS.CART_REMOVE, (data: { id: string }) => {
    cart.remove(data.id);
});

// Начало оформления заказа — первая форма
events.on(EVENTS.ORDER_OPEN, () => {
    const orderForm = new OrderForm(templates.order, events);
    modal.content = orderForm.render({
        payment: buyer.getData().payment as TPayment,
        address: buyer.getData().address,
    });
    currentView = 'order';

    // Валидация первой формы – только поля payment и address
    const handleOrderErrors = (formData: { payment?: TPayment; address?: string }) => {
        buyer.setData({ payment: formData.payment, address: formData.address });
        const errors = buyer.validate();
        // Показываем только ошибки, относящиеся к первому шагу
        const orderErrors: string[] = [];
        if (errors.payment) orderErrors.push(errors.payment);
        if (errors.address) orderErrors.push(errors.address);
        orderForm.valid = orderErrors.length === 0;
        orderForm.errors = orderErrors.join('. ');
    };
    events.on(EVENTS.FORM_ERRORS, handleOrderErrors);

    // Переход к контактам
    const handleOrderSubmit = () => {
        events.off(EVENTS.FORM_ERRORS, handleOrderErrors);
        events.off(EVENTS.ORDER_SUBMIT, handleOrderSubmit);
        openContactsForm();
    };
    events.on(EVENTS.ORDER_SUBMIT, handleOrderSubmit);
});

// Вторая форма — контакты
function openContactsForm() {
    const contactsForm = new ContactsForm(templates.contacts, events);
    modal.content = contactsForm.render({
        email: buyer.getData().email,
        phone: buyer.getData().phone,
    });
    currentView = 'contacts';

    const handleContactErrors = (formData: { email?: string; phone?: string }) => {
        buyer.setData({ email: formData.email, phone: formData.phone });
        const errors = buyer.validate();
        // Показываем только ошибки второго шага
        const contactErrors: string[] = [];
        if (errors.email) contactErrors.push(errors.email);
        if (errors.phone) contactErrors.push(errors.phone);
        contactsForm.valid = contactErrors.length === 0;
        contactsForm.errors = contactErrors.join('. ');
    };
    events.on(EVENTS.FORM_ERRORS, handleContactErrors);

    // Отправка заказа
    const handleContactsSubmit = () => {
        events.off(EVENTS.FORM_ERRORS, handleContactErrors);
        events.off(EVENTS.CONTACTS_SUBMIT, handleContactsSubmit);
        placeOrder();
    };
    events.on(EVENTS.CONTACTS_SUBMIT, handleContactsSubmit);
}

// Отправка заказа
function placeOrder() {
    const order: IOrder = {
        payment: buyer.getData().payment as TPayment,
        address: buyer.getData().address,
        email: buyer.getData().email,
        phone: buyer.getData().phone,
        items: cart.getItems().map(i => i.id),
        total: cart.getTotal(),
    };
    appApi.postOrder(order)
        .then(response => {
            cart.clear();
            buyer.clear();
            const success = new OrderSuccess(templates.success, () => modal.close());
            success.total = response.total;
            modal.content = success.render();
            currentView = 'success';
        })
        .catch(err => console.error('Ошибка оформления заказа', err));
}

// Вспомогательная функция для показа корзины
function showBasket() {
    const basketView = new Basket(cloneTemplate(templates.basket), events);
    basketView.items = cart.getItems();
    basketView.total = cart.getTotal();
    modal.content = basketView.render({ items: cart.getItems(), total: cart.getTotal() });
    currentView = 'basket';
}

// Первоначальная загрузка каталога
appApi.getProducts()
    .then(data => catalog.setItems(data.items))
    .catch(err => console.error('Ошибка загрузки каталога', err));