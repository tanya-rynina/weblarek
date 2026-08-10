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

let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;
let currentView: string | null = null; // 'preview', 'basket', 'order', 'contacts', 'success'

events.on(EVENTS.MODAL_CLOSE, () => {
  currentView = null;
  currentOrderForm = null;
  currentContactsForm = null;
});

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

  currentView = "preview";
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
  showBasket();
  modal.open();
});

events.on(EVENTS.CART_CHANGED, () => {
  page.counter = cart.getCount();
  if (currentView === "basket") {
    showBasket();
  }
});

events.on(EVENTS.CART_REMOVE, (data: { id: string }) => {
  cart.remove(data.id);
});

events.on(EVENTS.ORDER_OPEN, () => {
  currentOrderForm = new OrderForm(templates.order, events);
  modal.content = currentOrderForm.render();
  currentView = "order";
  updateFormsFromBuyer();
});

events.on(EVENTS.ORDER_SUBMIT, () => {
  currentContactsForm = new ContactsForm(templates.contacts, events);
  modal.content = currentContactsForm.render();
  currentView = "contacts";
  updateFormsFromBuyer();
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
      const success = new OrderSuccess(templates.success, () => modal.close());
      success.total = response.total;
      modal.content = success.render();
      currentView = "success";
    })
    .catch((err) => console.error("Ошибка оформления заказа", err));
});

events.on(EVENTS.FORM_CHANGE, (data: { field: string; value: string }) => {
  buyer.setData({ [data.field]: data.value });
});

events.on(EVENTS.BUYER_CHANGED, () => {
  const buyerData = buyer.getData();
  const errors = buyer.validate();

  if (currentOrderForm) {
    currentOrderForm.payment = buyerData.payment as TPayment;
    currentOrderForm.address = buyerData.address;

    const orderErrors = [errors.payment, errors.address]
      .filter(Boolean)
      .join(". ");
    currentOrderForm.valid = !errors.payment && !errors.address;
    currentOrderForm.errors = orderErrors;
  }

  if (currentContactsForm) {
    currentContactsForm.email = buyerData.email;
    currentContactsForm.phone = buyerData.phone;
    const contactsErrors = [errors.email, errors.phone]
      .filter(Boolean)
      .join(". ");
    currentContactsForm.valid = !errors.email && !errors.phone;
    currentContactsForm.errors = contactsErrors;
  }
});

function updateFormsFromBuyer() {
  events.emit(EVENTS.BUYER_CHANGED);
}

function showBasket() {
  const basketView = new Basket(cloneTemplate(templates.basket), events);
  basketView.items = cart.getItems();
  basketView.total = cart.getTotal();
  modal.content = basketView.render({
    items: cart.getItems(),
    total: cart.getTotal(),
  });
  currentView = "basket";
}

appApi
  .getProducts()
  .then((data) => catalog.setItems(data.items))
  .catch((err) => console.error("Ошибка загрузки каталога", err));
