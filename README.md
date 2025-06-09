# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

### Описание проекта
#### Проект состоит из:
- Основная страницы: каталог товаров, кнопка корзины и счетчик товаров в корзине.
- Карточка товара: категория товара, наименование, изображение, описание, цена и кнопка добавления товара в корзину «В корзину».
- Корзина: список товаров в корзине (порядковый номер, наименования, цена, кнопка удаления товара из корзины), общая стоимость заказа, кнопка оформления заказа «Оформить».
- Форма выбора типа оплаты: кнопки выбора типа оплаты, поле ввода адреса доставки и кнопка «Далее»
- Форма ввода контактов: поля ввода Email и номера телефона, кнопка «Оплатить»
- Окно оформленного заказа: изображение успешно оформленного заказа, списанная сумма, кнопка «За новыми покупками!»
>
- Карточка товара, Корзина, формы выбора типа оплаты и ввода контактных данных, а также информирование об оформленном заказе располагаются в типовом модальном окне, которое состоит из контента и кнопки, закрывающей окно.

### Используемый архитектурный паттерн
> Проект выполнен на основе MVP-паттерна(Model-View-Presenter).

### Типы данных и интерфейсы
```
type paymentType = 'online' | 'onReceipt';

interface IApiProductsResponse {
    total: number;
    items: IProduct[];
}
interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description: string;
} 

interface IProductsModel {
    items: IProduct[];
    getItem(id: string): IProduct;
}

interface IBasketModel {
    items: IProduct[];
    totalSumm: number;
    canCheckOut: boolean;
}

interface IContact {
    payment: paymentType;
    address: string;
    email: string;
    phone: string;
}

interface IValidationResult {
    isValid: boolean;
    message: string;
}

interface IOrderResult {
    id: string;
}

interface IOrder {
    items: string[];
    total: number;
    payment: paymentType;
    address: string;
	email: string;
	phone: string;
}
```

### Базовые классы
#### Базовый класс api
  - Свойства
    - readonly baseUrl: string;
    - protected options: RequestInit;
  - Методы
    - constructor (baseUrl: string, options: RequestInit = {}) ;
    - protected handleResponse(response: Response): Promise ;
    - get(uri: string) ;
    - post(uri: string, data: object, method: ApiPostMethods)

#### Базовый класс component
  - Методы
	  - protected constructor(protected readonly container: HTMLElement)
	  - toggleClass(element: HTMLElement, className: string, force?: boolean)
	  - protected setText(element: HTMLElement, value: unknown)
	  - setDisabled(element: HTMLElement, state: boolean)
	  - protected setHidden(element: HTMLElement)
	  - protected setVisible(element: HTMLElement)
	  - protected setImage(element: HTMLImageElement, src: string, alt?: string)
	  - render(data?: Partial<T>): HTMLElement
      
#### Базовый класс EventEmitter
  - Свойства
	  - _events: Map<EventName, Set<Subscriber>>
  - Методы
	  - constructor()
	  - on<T extends object>(eventName: EventName, callback: (event: T) => void)
    - off(eventName: EventName, callback: Subscriber)
    - emit<T extends object>(eventName: string, data?: T)
    - onAll(callback: (event: EmitterEvent) => void)
    - offAll()
    - trigger<T extends object>(eventName: string, context?: Partial<T>)

#### Базовый класс Form<T>
  - Свойства
    - protected _submit: HTMLButtonElement;
    - protected _errors: HTMLElement;
  - Методы
	  - constructor(protected container: HTMLFormElement, protected events: IEvents)
    - protected onInputChange
    - set valid(value: boolean)
    - set errors(value: string)
    - render(state: Partial<T> & IFormState)

### Слой данных

### class ProductsModel – модель данных галереи товаров
  - Свойства
	  - items: IProduct[] – массив продуктов
  - Методы
	  - constructor(protected events: IEvents)
	  - getItems(): IProduct[] – вернуть список товаров
	  - getItem(id: string): IProduct – вернуть товар по id
	  - setItems (items: IProduct[]) – записать список товаров

### class BasketModel – модель данных для управления списком товаров корзины
  - Свойства
	  -protected items: string[];
  - Методы
	  - constructor(protected events: IEvents)
	  - addItem(id: string) – добавить товар в корзину
	  - getItemIndex (id: string) – вернуть индекс товара
	  - getItemNumber (id: string) – вернуть порядковый номер товара в корзине
	  - deleteItem(id: string) – удалить товар из корзины
	  - basketTotal(items: IProduct[]) – посчитать сумму корзины
	  - counterItemsInBasket (): number – посчитать количество товаров в корзине
	  - isItemAdded (id: string): boolean – проверить добавлен ли товар в корзину
	  - getItems(): string[] – вернуть список товаров в корзине
    - setItems (items: string[]) – записать список товаров в корзине
    - clearBasket() – очистить корзину

### class UserContactsModel – модель данных для хранения и обработки данных покупателя
  - Свойства
	  - private userPayment: paymentType;
    - private userAddress: string;
    - private userEmail: string;
    - private userPhone: string;
  - Методы
	  - constructor()
    - get payment(): paymentType  - вернуть тип оплаты
    - set payment(value: paymentType) – записать тип оплаты
  	- get address(): string – вернуть адрес доставки
    - set address(value: string) – записать адрес доставки
    - get email(): string – вернуть Email покупателя
  	- set email(value: string) – записать Email покупателя
    - get phone(): string – вернуть номер телефона покупателя
    - set phone(value: string) – записать номер телефона покупател
    - isValidPaymentForm(): IValidationResult – проверка валидности формы с выбором типа оплаты и ввода адреса доставки
    - isValidContact(): IValidationResult – проверка валидности форм с контактными данными
    - private validateEmail(email: string): boolean – валидация Email регулярным выражением
    - private validatePhone(phone: string): boolean - валидация телефона регулярным выражением
    - getContact(): IContact – вернуть список контактных данных
    - clearContact() – очистить формы
      
### Слой представления (view)

#### class Page – представление основной страницы сайта с галереей товаров. Наследуется от класса Component
  - Свойства
    - protected productsContainer: HTMLElement;
    - protected basketCounter: HTMLElement;
    - protected pageWrapper: HTMLElement;
    - protected openBasketButton: HTMLButtonElement;
  - Методы
	  - constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents)
	  - set gallery(items: HTMLElement[]) – отобразить элементы в галерее
	  - set counter(value: number) – отобразить количество товаров в корзине
	  - set locked(value: boolean) – блокировка скролла при открытии модальных окон

#### class GalleryCard – представление карточки товара в галерее. Наследуется от класса Component
  - Свойства
    - protected productTitle: HTMLElement;
    - protected productImage: HTMLImageElement;
    - protected productPrice: HTMLElement;
    - protected productCategory: HTMLElement;
    - protected productId: number;
    - protected openPreviewButton: HTMLElement;
  - Методы
    - constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents)
    - set title(value: string) – установить наименование товара
    - set image(value: string) – установить картинку товара
    - set price(value: number | null) – установить цену товара
    - set category(value: string) – установить категорию товара
    - set id(value: number) – сохранить id товара

#### class PreviewCard – представление карточки превью в модальном окне. Наследуется от класса GalleryCard
  - Свойства
    - protected productDescription: HTMLElement;
    - protected addButton: HTMLButtonElement;
    - protected productAdded: boolean;
  - Методы
    - constructor(protected readonly container: HTMLElement, item: IProduct, protected events: IEvents)
    - set description(value: string) – установить описание товара
    - set price(value: number | null) – установить цену, если null, то кнопка «В корзину» скрывается
    - set addedInBasket (value: boolean) – управление активностью кнопки при добавлении в корзину

#### class Modal – общий класс модального окна. Наследуется от Component
  - Свойства
    - protected closeButton: HTMLButtonElement;
    - protected content: HTMLElement;
  - Методы
    - constructor(container: HTMLElement, protected events: IEvents)
    - set modalContent – установить контент модального окна
    - open() – открыть модальное окно
    - close() – закрыть модальное окно
    - render(data: IModalData): HTMLElement – рендер модального окна

#### class Payment – представление формы выбора типа оплаты и ввода адреса доставки. Наследуется от Form
  - Свойства
    - protected choosePayButtons: HTMLButtonElement[];
    - protected addressInput: HTMLInputElement;
  - Методы
    - constructor(container: HTMLFormElement, events: IEvents)
    - set payment(value: paymentType) – установить выбранный тип оплаты
    - set address(value: string) – установить адрес доставки

#### class ContactForm – представление формы с контактами покупателя
  - Свойства
    - protected emailInput: HTMLInputElement;
    - protected phoneInput: HTMLInputElement;
  - Методы
    - constructor(container: HTMLFormElement, events: IEvents)
    - set email(value: string) – установить Email
    - set phone(value: string) – установить номер телефона

### Presenter
  - Свойства
    - private productsModel: ProductsModel;
    - private page;
    - private modal;
    - private basketModel: BasketModel;
    - private basketView;
    - private userContactsModel: UserContactsModel;
    - private paymentForm;
    - private contactForm;
    - private successOrderView;
  - Методы
    - constructor (private events: IEventEmiter & IEvents) 

|Метод presenter|Описание|Events name
|---------------|---------------------------|--------------|
updateCatalog(data: IProduct[])|Обновить каталог: из сервера в модель|-
createCard(products: IProduct[]) |	Передать карточки товаров в разметку |	products:update
openCardPreview (item: IProduct) |	Передать данные для рендеринга модального окна карточки |	card:open
scrollLock() |	Блокировка скролла страницы при открытии модального окна \ modal:open
scrollUnlock() |	Разблокировка скролла страницы при закрытии модального окна |	modal:close
openBasket() |Передать данные для рендеринга модального окна корзины, в т.ч. при обновлении корзины	| basket:open, basket:delete
addInBasket(product: IProduct) |	Передать данные о добавлении в корзину в модель |	product:add
deleteFromBasket(product: IProduct) |	Передать данные об удалении из корзины в модель |	basket:delete
UpdateBasketCount() |	Обновить количество товаров в корзине |	basket:changed
openPaymentForm() |	Передать данные для рендеринга формы выбора типа оплаты |	order:open
updatePayment(data: paymentType) |	Передать данные о выбранном типе оплаты |	payment:change
updateAddress(data: string) |	Передать данные о введенном адресе |	order.address:change
openContactForm() |	Передать данные для рендеринга формы ввода контактных данных |	order:submit
updateEmail(data: string) |	Передать данные о введенном Email |	contacts.email:change
updatePhone(data: string) |	Передать данные о введенном номере телефона |	contacts.phone:change
handleContactSubmit() |	Отправка контактных данных и суммы заказа на сервер |	contacts:submit
openSuccessOrder(totalPrice: number) |	Передать данные для рендеринга формы оформленного заказ |	order:success

