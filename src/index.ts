import { Component } from './components/base/component';
import { IProduct, IBasketModel } from './types/index'
import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { WebLarekAPI } from './components/ProductsApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsModel } from './components/model/products'
import { Page } from './components/view/page';

 

class BasketModel {
    

    
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
interface IProductCard {
	title: string;
	description?: string;
	image: string;
	price: string;
	category: string;
}

class ProductCard extends Component<IProductCard> {
    protected productTitle: HTMLElement;
    protected productImage: HTMLImageElement;
    protected productPrice: HTMLElement;
    protected productCategory: HTMLElement;
    protected productId: number;
    protected productDescription: HTMLElement;
    protected addButton: HTMLButtonElement;
    protected productAdded: boolean;

    
    constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents) {
        super(container);
        this.productTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.productImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.productPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.productCategory = ensureElement<HTMLElement>('.card__category', this.container);
        // this.productDescription = ensureElement<HTMLElement>('.card__text', this.container);
        // this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
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

     set description(value: string) {
        this.setText(this.productDescription, value);
    }
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

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

class Presenter {
    private productsModel: ProductsModel;
    private page;

    constructor (private events: IEventEmiter & IEvents)  {
        
        this.productsModel = new ProductsModel(this.events);
        this.page = new Page(document.querySelector('.page__wrapper'), this.events);
    }

    updateCatalog(data: IProduct[]) {
	    this.productsModel.setItems(data);
}

    showCard(products: IProduct[]) {
		this.page.gallery = this.createCardsFromProducts(products);
	}

    createCardsFromProducts (products: IProduct[]): HTMLElement[] {
		const cards: HTMLElement[] = [];
		products.forEach((product) => {
			const container = cloneTemplate<HTMLElement>('#card-catalog');
			const card = new ProductCard(container, product, this.events);
			card.category = product.category;
			card.title = product.title;
			card.price = product.price;
			card.image = product.image;
			cards.push(container);
		});

		return cards;
	}
}

const eventss = new EventEmitter();

const presenter = new Presenter(eventss)
const itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement

api.getProductList()
  .then(data => 
    presenter.updateCatalog(data))
  .catch((err) => console.error(err))


eventss.on('products_update', (data: IProduct[]) => {
	presenter.showCard(data);
});

//    events.on('products_update', () => {
//      const itemsHTMLArray = productModel.getItems().map(item => new Item(cloneTemplate(itemTemplate), events).render(item))
//      page.render({
//          toDoList: itemsHTMLArray,
//          tasksTotal: toDoModel.getTotal(),
//         tasksDone: toDoModel.getDone()
//     }
//      )
// })

