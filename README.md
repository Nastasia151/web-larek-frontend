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

### Архитектура

```
interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description?: string;
}

interface IProductInBasket {
   title: string;
   price: number | null;
}

interface IPaymentForm {
    paymentType: 'online' | 'onReceipt' | null;
    address: string;
}

interface IContact {
    email: string;
    phone: string;
}
```

- class UIConfig = {} - класс конфигурации CSS 

Модели

- class CatalogModel - модель каталога товаров
  - Свойства
    - items: IProduct [] - массив товаров
  - Методы
    - getItems(): IProduct [] - вернуть массив товаров

- class ProductCardModel - попап с карточкой товара
  - Свойства
    - product: IProduct - товар в карточке
  - Методы
    - addItem(item: IProduct): void - добавить товар в корзину

- class BasketModel - модель Корзины
  - Свойства
    - items: IProductInBasket [] - массив товаров в корзине
  - Методы
    - addItem(item: IProduct): void - добавить товар в корзину
    - removeItem(index: number): void - удалить товар из корзины
    - getItems(): IProductInBasket[] - вернуть массив товаров
    - get summ(): number | null - посчитать сумму заказа
   
- class PaymentModel - модель формы с выбора способа оплаты и вводом адреса доставки
  - Свойства
    - pamentInfo: IPaymentForm - объект с данными пользователя
  - Методы
    - setPaymentType(paymentType: 'online' | 'onReceipt') - установить тип оплаты
    - setAddress(address: string) - установить адрес
    - isValid: boolean - валидация форм

- class Contacts - модель формы ввода контактов
  - Свойства
    - contacts: IContact
  - Методы
    - setEmail(email: string) - установить Email
    - setPhone(phone: string) - установить телефон
    - isValidEmail(): boolean - валидация инпута Email
    - isValidPhone(): boolean - валидация инпута Phone
    - isValid(): boolean - валидация формы
    - getContacts(): IContact - вернуть контактные данные

- class orderResult - модель оформленного заказа
  - Свойства
    - summ: number
  - Методы
    - getSumm() - посчитать сумму списания

Презентеры

- class CatalogPresenter - презентер каталога товаров
  - Cвойства
    - model: CatalogModel; - ссылка на модель каталога
  - Методы
    - getProducts(): IProduct [] - получить список товаров из модели
   
- class ProductCardPresenter - презентер карточки товара
  - Свойства
    - model: ProductCardModel - ссылка на модель
    - basketPresenter: BasketPresenter 
  - Методы
    - addProduct(product: IProduct): void - обработать добавление товара через BasketPresenter

- class BasketPresenter - презентер корзины
  - Свойства
    - model: BasketModel
  - Методы
    - addProduct(product: IProduct): void - обработать добавление товара
    - removeProduct(index:number): void - обработать удаление товара
    - getProducts(): IProductInBasket[] - получить список товаров в корзине
    - get summ(): number | null - получить сумму заказа

- class PaymentPresenter - презентер формы выбора типа оплата и ввода адреса
  - Свойства
    - model: PaymentModel - ссылка на модель
  - Методы
    - setPaymentType(paymentType: 'online' | 'onReceipt') - отправить тип оплаты
    - setAddress(address: string) - отправить адрес
    - checkValid: boolean - проверить валидацию для управления активацией кнопки

- class ContactsPresener - презентер формы ввода контактов
  - Свойства
    - model: Contacts
  - Методы
    - setEmail(email: string) - передать Email
    - setPhone(phone: string) - передать телефон
    - checkValid: boolean - проверить валидацию для управления активацией кнопки
    - getContacts(): IContact - получить контактные данные
    - handleFormSubmit() - отправить данные 

- class orderResultPresenter - презентер оформленного заказа
  - Свойства
    - model: orderResult - ссылка на модель
    - view: orderResultView - ссылка на view
  - Методы
    - handleContinueShopping() - закрыть view
    - getSumm() - получить сумму списания

Отображение

- class CatalogView - каталог
  - Свойства
    - presentor: CatalogPresenter - ссылка на презентер каталога
    - config: UIConfig; - настройки селекторов и тегов
    - root: HTMLElement - DOM-элемент
  - Методы
    - render() - рендеринг страницы
    - addListeners(root: HTMLElement): void - слушатели событий

- class ProductCardView - карточка товара (попап)
  - Свойства
    - presenter: ProductCardPresenter - ссылка на презентер
    - config: UIConfig; - настройки селекторов и тегов
    - root: HTMLElement - DOM-элемент
  - Методы
   - render() - рендеринг окна
   - addListeners(root: HTMLElement): void - слушатели событий

- class BasketView - корзина
  - Свойства
   - presentor: BasketPresenter - ссылка на презентер каталога
   - config: UIConfig; - настройки селекторов и тегов
   - root: HTMLElement - DOM-элемент
 - Методы
   - render() - рендеринг окна
   - addListeners(root: HTMLElement): void - слушатели событий

- class PaymentView - форма выбора типа оплаты и адреса доставки
  - Свойства
    - presenter: PaymentPresenter - ссылка на презентер
    - config: UIConfig; - настройки селекторов и тегов
    - root: HTMLElement - DOM-элемент
  - Методы
   - render() - рендеринг окна
   - addListeners(root: HTMLElement): void - слушатели событий
   - toggleSubmitButton() - переключение кнопки в зависимости от валидности данных
   - reset() - очистить данные после оформления заказа

- class ContactsView
  - Свойства
    - presenter: ContactsPresener - ссылка на презентер
    - config: UIConfig; - настройки селекторов и тегов
    - root: HTMLElement - DOM-элемент
  - Методы
    - render() - рендеринг окна
    - addListeners(root: HTMLElement): void - слушатели событий
    - toggleSubmitButton() - переключение кнопки в зависимости от валидности данных
    - reset() - очистить данные после оформления заказа

- class orderResultView
  - Свойства
    - presenter: orderResultPresenter - ссылка на презентер
    - config: UIConfig; - настройки селекторов и тегов
    - root: HTMLElement - DOM-элемент
  - Методы
    - render() - рендеринг окна
    - addListeners(root: HTMLElement): void - слушатели событий
    