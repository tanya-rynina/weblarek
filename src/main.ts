import "./scss/styles.scss";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL, EVENTS } from "./utils/constants";
import { AppApi } from "./components/AppApi";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Cart } from "./components/models/Cart";
import { Buyer } from "./components/models/Buyer";
import { Page } from "./components/view/Page";
import { Modal } from "./components/view/Modal";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { Basket } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { OrderSuccess } from "./components/view/OrderSuccess";
import { IProduct, IOrder, TPayment } from "./types";
import { cloneTemplate, formatPrice } from "./utils/utils";

const events = new EventEmitter();
const api = new Api(API_URL);
const appApi = new AppApi(api);

const catalog = new ProductCatalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const templates = {
  cardCatalog: document.getElementById("card-catalog") as HTMLTemplateElement,
  cardPreview: document.getElementById("card-preview") as HTMLTemplateElement,
  basket: document.getElementById("basket") as HTMLTemplateElement,
  order: document.getElementById("order") as HTMLTemplateElement,
  contacts: document.getElementById("contacts") as HTMLTemplateElement,
  success: document.getElementById("success") as HTMLTemplateElement,
};

const page = new Page(document.querySelector(".page")!, events);
const modal = new Modal(document.getElementById("modal-container")!, events);
const orderForm = new OrderForm(templates.order, events);
const contactsForm = new ContactsForm(templates.contacts, events);
const basketView = new Basket(cloneTemplate(templates.basket), events);
const orderSuccess = new OrderSuccess(templates.success, events);

events.on(EVENTS.CATALOG_CHANGED, (data: { items: IProduct[] }) => {
  const cards = data.items.map((item) => {
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

events.on(EVENTS.CARD_SELECT, (data: { id: string }) => {
  const item = catalog.getItem(data.id);
  if (item) {
    catalog.setPreview(item);
  }
});

events.on(EVENTS.PREVIEW_CHANGED, (data: { preview: IProduct }) => {
  const preview = new CardPreview(templates.cardPreview, events);
  const inBasket = cart.contains(data.preview.id);

  let buttonText: string;
  let buttonDisabled: boolean;
  if (data.preview.price === null) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (inBasket) {
    buttonText = "Удалить из корзины";
    buttonDisabled = false;
  } else {
    buttonText = "Купить";
    buttonDisabled = false;
  }

  modal.content = preview.render({
    id: data.preview.id,
    title: data.preview.title,
    price: formatPrice(data.preview.price),
    category: data.preview.category,
    image: data.preview.image,
    description: data.preview.description,
    inBasket,
  });
  preview.button = buttonText;
  preview.buttonDisabled = buttonDisabled;

  modal.open();
});

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

events.on(EVENTS.CART_OPEN, () => {
  basketView.items = cart.getItems();
  basketView.total = cart.getTotal();
  modal.content = basketView.element;
  modal.open();
});

events.on(EVENTS.CART_CHANGED, () => {
  page.counter = cart.getCount();
  if (modal.content?.firstElementChild === basketView.element) {
    basketView.items = cart.getItems();
    basketView.total = cart.getTotal();
  }
});

events.on(EVENTS.CART_REMOVE, (data: { id: string }) => {
  cart.remove(data.id);
});

events.on(EVENTS.ORDER_OPEN, () => {
  modal.content = orderForm.element;
  modal.open();
});

events.on(EVENTS.ORDER_SUBMIT, () => {
  modal.content = contactsForm.element;
});

events.on(EVENTS.CONTACTS_SUBMIT, () => {
  const order: IOrder = {
    payment: buyer.getData().payment as TPayment,
    address: buyer.getData().address,
    email: buyer.getData().email,
    phone: buyer.getData().phone,
    items: cart.getItems().map((i) => i.id),
    total: cart.getTotal(),
  };
  appApi
    .postOrder(order)
    .then((response) => {
      cart.clear();
      buyer.clear();
      orderSuccess.total = response.total;
      modal.content = orderSuccess.element;
    })
    .catch((err) => console.error("Ошибка оформления заказа", err));
});

events.on(EVENTS.FORM_CHANGE, (data: { field: string; value: string }) => {
  buyer.setData({ [data.field]: data.value });
});

events.on(EVENTS.BUYER_CHANGED, () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  orderForm.payment = buyerData.payment as TPayment;
  orderForm.address = buyerData.address;
  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join(". ");
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = orderErrors;

  contactsForm.email = buyerData.email;
  contactsForm.phone = buyerData.phone;
  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join(". ");
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = contactsErrors;
});

events.on(EVENTS.MODAL_CLOSE, () => {
  modal.close();
});

appApi
  .getProducts()
  .then((data) => catalog.setItems(data.items))
  .catch((err) => console.error("Ошибка загрузки каталога", err));
