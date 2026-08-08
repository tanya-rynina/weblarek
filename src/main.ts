import './scss/styles.scss';
import { ProductCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

// ---------- Создание экземпляров моделей ----------
const productCatalog = new ProductCatalog();
const cart = new Cart();
const buyer = new Buyer();

// ---------- Тестирование моделей на тестовых данных ----------
console.log('--- Тестирование ProductCatalog ---');
productCatalog.setItems(apiProducts.items);
console.log('Товары в каталоге:', productCatalog.getItems());
console.log('Товар по id:', productCatalog.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
const previewItem = apiProducts.items[0];
productCatalog.setPreview(previewItem);
console.log('Товар для предпросмотра:', productCatalog.getPreview());

console.log('--- Тестирование Cart ---');
const product1 = apiProducts.items[0];
const product2 = apiProducts.items[1];
cart.add(product1);
cart.add(product2);
cart.add(product1); // повторное добавление не должно дублировать
console.log('Содержимое корзины:', cart.getItems());
console.log('Количество товаров:', cart.getCount());
console.log('Общая стоимость:', cart.getTotal());
console.log('Наличие товара (id1):', cart.contains(product1.id));
cart.remove(product2.id);
console.log('После удаления товара 2:', cart.getItems());
cart.clear();
console.log('После очистки корзины:', cart.getItems(), 'Количество:', cart.getCount());

console.log('--- Тестирование Buyer ---');
buyer.setData({ payment: 'card', address: 'ул. Пушкина' });
console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());
buyer.setData({ email: 'test@test.com', phone: '+79991234567' });
console.log('Данные после дополнения:', buyer.getData());
console.log('Ошибки валидации:', buyer.validate());
buyer.clear();
console.log('После очистки:', buyer.getData(), 'Ошибки:', buyer.validate());

// ---------- Подключение к серверу ----------
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

appApi.getProducts()
    .then((data) => {
        console.log('Ответ сервера (каталог):', data);
        productCatalog.setItems(data.items);
        console.log('Товары сохранены в модель каталога:', productCatalog.getItems());
    })
    .catch((err) => {
        console.error('Ошибка получения каталога:', err);
    });