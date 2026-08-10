# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются следующие интерфейсы данных:

### Товар
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

### Покупатель
interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

### Тип оплаты
type TPayment = 'card' | 'cash';

### Заказ (отправка на сервер)
interface IOrder {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

### Ответ сервера со списком товаров
interface IProductListResponse {
    total: number;
    items: IProduct[];
}

### Ответ сервера при успешном оформлении заказа
interface IOrderResponse {
    id: string;
    total: number;
}

## Модели данных

### ProductCatalog (каталог товаров)
Назначение: Хранение списка всех товаров и товара для предпросмотра.
Конструктор: не принимает параметров.
#### Поля:

_items: IProduct[] — массив товаров

_preview: IProduct | null — товар для детального отображения

#### Методы:

setItems(items: IProduct[]): void — сохраняет массив товаров

getItems(): IProduct[] — возвращает все товары

getItem(id: string): IProduct | undefined — возвращает товар по id

setPreview(item: IProduct): void — устанавливает товар для предпросмотра

getPreview(): IProduct | null — возвращает товар для предпросмотра

### Cart (корзина)
Назначение: Хранение товаров, выбранных пользователем для покупки.
Конструктор: не принимает параметров.
#### Поля:

_items: IProduct[] — массив товаров в корзине

#### Методы:

getItems(): IProduct[] — возвращает список товаров

add(item: IProduct): void — добавляет товар, если его нет в корзине

remove(id: string): void — удаляет товар по id

clear(): void — очищает корзину

getTotal(): number — суммарная стоимость товаров

getCount(): number — количество товаров

contains(id: string): boolean — проверяет наличие товара по id

### Buyer (покупатель)
Назначение: Хранение и валидация данных покупателя.
Конструктор: не принимает параметров, все поля инициализируются пустыми строками.
#### Приватные поля:

payment: TPayment | '' — способ оплаты

email: string — электронная почта

phone: string — телефон

address: string — адрес доставки

#### Методы:

setData(data: Partial<IBuyer>): void — обновляет переданные поля (можно передать только часть данных)

getData(): IBuyer — возвращает все данные покупателя

clear(): void — сбрасывает все поля

validate(): ValidationErrors — возвращает объект с сообщениями об ошибках для незаполненных полей. Если ошибок нет, объект пустой.

### Слой коммуникации
#### AppApi
Назначение: Выполнение HTTP-запросов к API магазина. Использует композицию – принимает экземпляр, реализующий интерфейс IApi.
Конструктор:

constructor(baseApi: IApi) — получает объект для выполнения запросов

Приватные поля:

baseApi: IApi — экземпляр API для запросов

Методы:

getProducts(): Promise<IProductListResponse> — GET-запрос на эндпоинт /product, возвращает список товаров

postOrder(order: IOrder): Promise<IOrderResponse> — POST-запрос на эндпоинт /order, отправляет заказ и возвращает подтверждение

#### Утилиты
function formatPrice(price: number | null): string

Преобразует числовую цену в строку для отображения: "N синапсов" или "Бесценно", если цена null.

#### Представление (View)

Page
Главный компонент страницы, управляет галереей карточек и счётчиком корзины.

Конструктор: constructor(container: HTMLElement, events: IEvents)

Приватные поля:

basketButton: HTMLElement — кнопка открытия корзины

basketCounter: HTMLElement — счётчик товаров

galleryContainer: HTMLElement — контейнер для карточек

Сеттеры:

counter(value: number) — обновляет счётчик

gallery(items: HTMLElement[]) — заменяет содержимое галереи

Card<T>
Базовый дженерик-компонент карточки товара. Отвечает за отображение названия, цены, категории, изображения и кнопки.
Параметр типа T должен расширять ICommonCard (см. ниже).

Конструктор: constructor(container: HTMLElement)

Защищённые поля:

titleElement, priceElement, categoryElement?, imageElement?, buttonElement?

Сеттеры: title, price, category, image, buttonText, disableButton

Метод render: принимает Partial<T>, возвращает корневой элемент.

Вспомогательный интерфейс ICommonCard

interface ICommonCard {
    id: string;
    title: string;
    price: string;   // готовая строка для отображения
    category: string;
    image: string;
}
CardCatalog (наследует Card<ICatalogCard>)
Карточка для галереи. При клике генерирует событие card:select с id товара.

Конструктор: constructor(template: HTMLTemplateElement, events: IEvents)

Метод render: принимает Partial<ICatalogCard>, где ICatalogCard — это Pick<IProduct, 'id'|'title'|'category'|'image'> и строка price.

CardPreview (наследует Card<IPreviewCard>)
Карточка для подробного просмотра в модальном окне. Показывает описание и кнопку «Купить»/«Удалить».

Конструктор: constructor(template: HTMLTemplateElement, events: IEvents)

Дополнительные сеттеры: description

Метод render: принимает Partial<IPreviewCard>, где IPreviewCard расширяет ICommonCard полями description: string и inBasket: boolean.

CardBasket (наследует Card<IBasketCard>)
Карточка товара в корзине. Содержит индекс и кнопку удаления.

Конструктор: constructor(template: HTMLTemplateElement, events: IEvents)

Сеттер: index

Метод render: принимает Partial<IBasketCard>, где IBasketCard расширяет ICommonCard полем index: number.

Modal
Управляет отображением модального окна. Вставляет контент, обрабатывает закрытие по крестику/оверлею.

Конструктор: constructor(container: HTMLElement, private events: IEvents)

Свойство content — записывает переданный DOM-элемент в modal__content.

Методы: open(), close() – управляют классами modal_active и генерируют события modal:open / modal:close.

Form<T> (абстрактный)
Базовая форма, содержит кнопку сабмита и вывод ошибок.

Конструктор: protected constructor(container: HTMLFormElement, protected events: IEvents)

Абстрактный метод: onSubmit()

Сеттеры: valid (блокирует/разблокирует кнопку), errors (устанавливает текст ошибок).

OrderForm (наследует Form<IOrderForm>)
Форма первого шага оформления: выбор способа оплаты (подсветка кнопки) и адрес.

Конструктор: constructor(template: HTMLTemplateElement, events: IEvents)

При изменении полей эмитит form:errors с текущими значениями payment и address.

Метод render: принимает Partial<IOrderForm> для предзаполнения.

ContactsForm (наследует Form<IContactsForm>)
Форма второго шага: email и телефон.

При изменении полей эмитит form:errors с текущими значениями email и phone.

Метод render: принимает Partial<IContactsForm> для предзаполнения.

Basket
Отображает список товаров корзины и общую стоимость, кнопку «Оформить».

Конструктор: constructor(container: HTMLElement, events: IEvents)

Сеттеры: items (массив IProduct) – создаёт карточки CardBasket, total – обновляет текстовую сумму.

При нажатии на кнопку «Оформить» генерирует order:open.

OrderSuccess
Компонент уведомления об успешном заказе.

Конструктор: constructor(template: HTMLTemplateElement, onClose: () => void)

Сеттер: total – выводит сообщение «Списано N синапсов».

Кнопка закрытия вызывает переданный колбэк onClose.

## События приложения

| Событие                | Источник        | Описание                                 |
|------------------------|-----------------|------------------------------------------|
| `catalog:changed`      | ProductCatalog  | Изменился каталог товаров                |
| `preview:changed`      | ProductCatalog  | Выбран товар для просмотра               |
| `cart:changed`         | Cart            | Изменилось содержимое корзины           |
| `buyer:changed`        | Buyer           | Изменились данные покупателя            |
| `card:select`          | CardCatalog     | Клик по карточке в галерее (id)         |
| `cart:open`            | Page (кнопка)   | Открыть корзину                          |
| `cart:remove`          | CardBasket      | Удалить товар из корзины (id)           |
| `order:open`           | Basket (кнопка) | Начало оформления заказа                 |
| `order:submit`         | OrderForm       | Переход ко второй форме                  |
| `contacts:submit`      | ContactsForm    | Отправка заказа                          |
| `form:errors`          | OrderForm, ContactsForm | Изменение данных в форме (для валидации) |
| `modal:open`           | Modal           | Модальное окно открыто                   |
| `modal:close`          | Modal           | Модальное окно закрыто                   |
| `card:toggle`          | CardPreview     | Нажатие кнопки «Купить» или «Удалить»    |


Презентер
Код презентера реализован в src/main.ts. Он связывает модели и представления через события:

При загрузке страницы получает каталог товаров через AppApi и сохраняет в ProductCatalog. Модель генерирует catalog:changed, презентер перехватывает его и заполняет галерею (Page.gallery) карточками CardCatalog.

Клик по карточке товара → событие card:select, презентер получает id, вызывает ProductCatalog.setPreview(), что вызывает preview:changed. Презентер создаёт CardPreview с данными, включая признак inBasket, и передаёт в Modal.

В CardPreview кнопка «Купить»/«Удалить» генерирует card:toggle. Презентер добавляет товар в корзину или удаляет его, после чего закрывает модальное окно.

Кнопка корзины (в Page) → cart:open → презентер создаёт Basket, устанавливает items и total, открывает модалку.

Удаление из корзины (cart:remove) → Cart.remove() → модель генерирует cart:changed, презентер обновляет счётчик в Page. Если открыта корзина, перерисовывает её содержимое.

Кнопка «Оформить» (в Basket) → order:open → презентер показывает OrderForm, подписывается на form:errors, валидирует первую часть данных через Buyer.validate() и управляет активностью кнопки «Далее» (показывает только ошибки, относящиеся к первому шагу).

При order:submit переключает на ContactsForm, снова обрабатывает form:errors, валидирует вторую часть (показывает только ошибки email и телефона).

При contacts:submit презентер формирует IOrder, отправляет его через AppApi.postOrder(). В случае успеха очищает корзину и данные покупателя, показывает OrderSuccess с суммой заказа, закрытие по кнопке вызывает Modal.close().