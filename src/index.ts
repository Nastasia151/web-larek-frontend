import { Component } from './components/base/component';
import { IProduct, IBasketModel } from './types/index'
import './scss/styles.scss';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { WebLarekAPI } from './components/ProductsApi';
import { API_URL, CDN_URL } from './utils/constants';
import { ProductsModel } from './components/model/products'
import { Page } from './components/view/page';
import { Modal } from './components/view/modal';
import { GalleryCard, PreviewCard } from './components/view/cards';
import { BasketModel } from './components/model/basketModel';

 




class UserContactsModel {
    constructor(){}

    choosePayment(paymentType: 'online' | 'onReceipt'){}

    setAddress(address: string){}  // - отправить адрес

    setEmail(email: string) {} // - отправить email

    setPhone(phone: string) {} // - отправить номер телефона

    // isValid () {}

    // toggleButton
}



interface IBasketList{
    productsList: IProduct[];
    index: number;
    title: string;
    price: string;

}

class BasketList extends Component<IBasketList> {
    protected productsContainer: HTMLElement;
    protected productIndex: HTMLElement;
    protected productTitle: HTMLElement;
    protected productPrice: HTMLElement;
    protected deleteProductButton: HTMLButtonElement;
    

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.productsContainer = ensureElement<HTMLElement>('#card-basket', this.container);
        this.productIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.productTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.productPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteProductButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
        this.deleteProductButton.addEventListener('click', () => {
            this.events.emit('basketList: delete');
        });
    }

    set productList(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set index(value: number) {
        this.setText(this.productIndex, value)
    }

    set title(value: string) {
        this.setText(this.productTitle, value);
    }

    set price(value: string) {
        this.setText(this.productPrice, `${value} синапсисов`);
    }
} 

interface IBasketView {
    basketList: IBasketList[];
    totalPrice: number;
    locked: boolean;
}

class BasketView extends Component<IBasketView> {
    private itemsList: HTMLElement;
    private basketPrice: HTMLElement;
    private orderButton: HTMLButtonElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.itemsList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    }

    set basketList(items: IBasketList[]) {
        if (items.length > 0) {
        // Для каждого товара создаём элемент BasketList и добавляем в DOM
        items.forEach((item, idx) => {
            // Клонируем шаблон товара в корзине
            const container = cloneTemplate<HTMLElement>('#card-basket');
            const basketItem = new BasketList(container, this.events);

            // Устанавливаем данные товара
            basketItem.index = idx + 1;
            basketItem.title = item.title;
            basketItem.price = item.price;

            // Добавляем элемент в список
            this.itemsList.replaceChildren(basketItem.render());
        }) 
    } else {
        this.itemsList.replaceChildren(
				createElement<HTMLElement>('p', {
					textContent: 'Корзина пуста',
			})
		);
    }
}

    set totalPrice(value: number) {
        this.setText(this.basketPrice, `${value} синапсисов`);
    }

    set locked(items: IBasketList[]) {
        if(items.length) {
            this.setDisabled(this.orderButton, false);
        } else {
            this.setDisabled(this.orderButton, true);
        }
    }
}

// protected orderSumm: HTMLElement;
//     protected makeOrder: HTMLButtonElement;
const api = new WebLarekAPI(CDN_URL, API_URL);

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

class Presenter {
    private productsModel: ProductsModel;
    private page;
    private modal;
    private basketModel: BasketModel;
    private basket;
	

    constructor (private events: IEventEmiter & IEvents)  {
        
        this.productsModel = new ProductsModel(this.events);
        this.page = new Page(document.querySelector('.page__wrapper'), this.events);
        this.modal = new Modal(document.querySelector('.modal'), this.events)
        this.basketModel = new BasketModel(this.events);

        const basketContainer = cloneTemplate<HTMLElement>('#basket');
        this.basket = new BasketView(basketContainer, this.events);


    }

    updateCatalog(data: IProduct[]) {
	    this.productsModel.setItems(data);
}

    showCard(products: IProduct[]) {
		this.page.gallery = this.createCardsCatalog(products);
	}
    // подумать как переписать
    createCardsCatalog (items: IProduct[]): HTMLElement[] {
		const cards: HTMLElement[] = [];
		items.forEach((item) => {
			const container = cloneTemplate<HTMLElement>('#card-catalog');
			const card = new GalleryCard(container, item, this.events);
			card.category = item.category;
			card.title = item.title;
			card.price = item.price;
			card.image = item.image;
			cards.push(container);
		});

		return cards;
	}

    openCardPreview (item: IProduct) {
        const container = cloneTemplate<HTMLElement>('#card-preview');
        const card = new PreviewCard(container, item, this.events)
        card.category = item.category;
		card.title = item.title;
		card.price = item.price;
		card.image = item.image;
        card.description = item.description;
        card.addedInBasket = this.basketModel.isItemAdded(item.id);
        this.modal.render({modalContent: card.render()});
    }

    scrollLock() {
		this.page.locked = true;
	}

	scrollUnlock() {
		this.page.locked = false;
	}

    addInBasket(product: IProduct) {
		this.basketModel.addItem(product.id);
	}

	deleteFromBasket(product: IProduct) {
		this.basketModel.deleteItem(product.id);
	}

	UpdateBasketCount() {
		this.page.counter = this.basketModel.counterItemsInBasket();
	}
}

const eventss = new EventEmitter();

const presenter = new Presenter(eventss)


api.getProductList()
  .then(data => 
    presenter.updateCatalog(data))
  .catch((err) => console.error(err))


eventss.on('products: update', (data: IProduct[]) => {
	presenter.showCard(data);
});

eventss.on('card: open', (card: IProduct) => {
	presenter.openCardPreview(card);
});

eventss.on('modal:open', () => {
	presenter.scrollLock();
});
eventss.on('modal:close', () => {
	presenter.scrollUnlock();
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

