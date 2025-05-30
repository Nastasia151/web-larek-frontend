import { Component } from './components/base/component';
import { IProduct } from './types/index'
import './scss/styles.scss';

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
    items: IProduct[];
}

class Page extends Component<IPage> {
   protected productsList = HTMLElement;
   protected basketCounter = HTMLElement;

    constructor(container: HTMLElement) {
        super(container)

    }
}