import { Component } from './components/base/component';
import { IProduct, IBasketModel } from './types/index'
import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { WebLarekAPI } from './components/ProductsApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsModel } from './components/model/products'

 

class BasketModel {
    

    addItem(id: string) {} // - добавить в корзину

    deleteItemfromBasket(id: string) {} // - удалить товар из корзины

    getBasketItemsSumm(id: string) {} // - по id находим товары в корзине и считаем сумму заказа

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
    gallery: IProduct[];
    counter: number;
}

class Page extends Component<IPage> {
   protected productsContainer: HTMLElement;
   protected basketCounter: HTMLElement;
   protected pageWrapper: HTMLElement;
   protected basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.productsContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)

        this.basketButton.addEventListener('click', () => {
			this.events.emit('open_basket');
		});
    }

    set gallery(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this.basketCounter, value);
    }
}

class CardCatalog extends Component<IProduct> {
    protected productTitle: HTMLElement;
    protected productImage: HTMLImageElement;
    protected productPrice: HTMLElement;
    protected productCategory: HTMLElement;
    protected productId: number;

    
    constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents) {
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

class ProductCard extends Component<IProduct>{
    protected productDescription: HTMLElement;
    protected addButton: HTMLButtonElement;
    protected closeButton: HTMLButtonElement;

    constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents) {
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
const api = new WebLarekAPI(CDN_URL, API_URL);

const events = new EventEmitter();
const productModel = new ProductsModel(events);

const itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement

api.getProductList()
  .then(data => 
    productModel.setItems(data))
  .catch((err) => console.error(err))

//    events.on('products_update', () => {
//      const itemsHTMLArray = productModel.getItems().map(item => new Item(cloneTemplate(itemTemplate), events).render(item))
//      page.render({
//          toDoList: itemsHTMLArray,
//          tasksTotal: toDoModel.getTotal(),
//         tasksDone: toDoModel.getDone()
//     }
//      )
// })

function createCardsFromProducts (products: IProduct[]): HTMLElement[] {
		const cards: HTMLElement[] = [];
		products.forEach((product) => {
			const container = cloneTemplate<HTMLElement>('#card-catalog');
			const card = new CardCatalog(container, product, this.events);
			card.category = product.category;
			card.title = product.title;
			card.price = product.price;
			card.image = product.image;
			cards.push(container);
		});

		return cards;
	}



  function showCard(products: IProduct[]) {
		this.page.catalog = this.createCardsFromProducts(products);
	}

