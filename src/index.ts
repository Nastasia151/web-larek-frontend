import { Component } from './components/base/component';
import { IProduct } from './types/index'
import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/events';

// класс для хранения всех продуктов
class ProductModel {
    protected items: IProduct[] = [];  // - массив продуктов

    constructor() {}  // - не принимает никаких параметров
    
    getItems(): IProduct[] {
        return this.items
    } // - вернуть список товаров

    getItem(id: string): IProduct {
        return this.items.find(item => item.id === id);
    } // - вернуть товар по id

    addItemInBasket(id: string) {} // - добавить в корзину

    deleteItemfromBasket(id: string) {} // - удалить товар из корзины

    getBasketItemsSumm(id: string) {} // - по id находим товары в корзине и считаем сумму заказа

    setItems (){} //???

    counterItemsInBasket (id: string) {}  // кол-во продуктов, добавленных в корзину??

    getIndexItem (id: string) {} // вернуть порядковый номер товара в корзине
}

class UserContactsModel {
    constructor(){}

    choosePayment(paymentType: 'online' | 'onReceipt'){}

    setAddress(address: string){}  // - отправить адрес

    setEmail(email: string) {} // - отправить email

    setPhone(phone: string) {} // - отправить номер телефона

    // isValid () {}

    // toggleButton
}

interface IPage {
    productGallery: IProduct[];
    basketCounter: number;
}

class Page extends Component<IPage> {
   protected productsContainer: HTMLElement;
   protected basketItems: HTMLElement;

    constructor(container: HTMLElement) {
        super(container)

        this.productsContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketItems = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    }

    set productGallery(items: HTMLElement[]) {
        this.productGallery.push(...items);
    }

    set basketCounter(value: number) {
        this.setText(this.basketItems, value);
    }
}

class ProductPreview extends Component<IProduct> {
    protected productTitle: HTMLElement;
    protected productImage: HTMLImageElement;
    protected productPrice: HTMLElement;
    protected productCategory: HTMLElement;
    protected productId: number;

    
    constructor(protected readonly container: HTMLElement) {
        super(container);
        this.productTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.productImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.productPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.productCategory = ensureElement<HTMLElement>('.card__category', this.container);
    }

    set title(value: string) {
        this.setText(this.productTitle, value);
    }

    set image(value: string) {
        this.setImage(this.productImage, value, this.title)
    }

    set price(value: number | null) {
        if(value === null) {
          this.setText(this.productPrice, `Бесценно`);
        } else {
            this.setText(this.productPrice, `${value} синапсисов`);
        }
    }

    set category(value: string) {
        this.setText(this.productCategory, value);
    }

    set id(value: number) {
        this.productId = value;
    }
}

class ProductCard extends ProductPreview {
    protected productDescription: HTMLElement;
    protected addButton: HTMLButtonElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected readonly container: HTMLElement) {
        super(container);

        this.productDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    }

    set description(value: string) {
        this.setText(this.productDescription, value);
    }

    // управление кнопкой
}

interface IBasketView extends IProduct{
    itemIndex: number;
    summTotal: number;
}

class BasketView extends Component<IBasketView> {
    protected basketItemIndex: HTMLElement;
    protected productTitle: HTMLElement;
    protected productPrice: HTMLElement;
    protected deleteItemButton: HTMLButtonElement;
    protected closeButton:HTMLButtonElement;
    protected orderSumm: HTMLElement;
    protected makeOrder: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);

        this.basketItemIndex = ensureElement<HTMLElement>('.basket__item-index', this.container)
    }
}