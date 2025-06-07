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



// interface IBasketList{
//     productsList: IProduct[];
//     index: number;
//     title: string;
//     price: string;

// }

// class B extends Component<IBasketList> {
//     protected productsContainer: HTMLElement;
//     protected productIndex: HTMLElement;
//     protected productTitle: HTMLElement;
//     protected productPrice: HTMLElement;
//     protected deleteProductButton: HTMLButtonElement;
    

//     constructor(container: HTMLElement, protected events: IEvents) {
//         super(container);

//         this.productsContainer = ensureElement<HTMLElement>('#card-basket', this.container);
//         this.productIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
//         this.productTitle = ensureElement<HTMLElement>('.card__title', this.container);
//         this.productPrice = ensureElement<HTMLElement>('.card__price', this.container);
//         this.deleteProductButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    
//         this.deleteProductButton.addEventListener('click', () => {
//             this.events.emit('basketList: delete');
//         });
//     }

//     set productList(items: HTMLElement[]) {
//         this.productsContainer.replaceChildren(...items);
//     }

//     set index(value: number) {
//         this.setText(this.productIndex, value)
//     }

//     set title(value: string) {
//         this.setText(this.productTitle, value);
//     }

//     set price(value: string) {
//         this.setText(this.productPrice, `${value} синапсисов`);
//     }
// } 

// interface IBasketView {
//     basketList: IBasketList[];
//     totalPrice: number;
//     locked: boolean;
// }

// class B extends Component<IBasketView> {
//     private itemsList: HTMLElement;
//     private basketPrice: HTMLElement;
//     private orderButton: HTMLButtonElement;


//     constructor(container: HTMLElement, protected events: IEvents) {
//         super(container);

//         this.itemsList = ensureElement<HTMLElement>('.basket__list', this.container);
//         this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
//         this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
//     }

// //     

// set basketList(items: IBasketList[]) {
//     if (!items || items.length === 0) {
//         this.itemsList.replaceChildren(
//             createElement<HTMLElement>('p', {
//                 textContent: 'Корзина пуста',
//             })
//         );
//         return;
//     }

//     const elements = items.map((item, idx) => {
//         const container = cloneTemplate<HTMLElement>('#card-basket');
//         const basketItem = new BasketList(container, this.events);
        
//         basketItem.index = idx + 1;
//         basketItem.title = item.title;
//         basketItem.price = item.price;

//         return basketItem.render();
//     });

//     this.itemsList.replaceChildren(...elements);
// }


//     set totalPrice(value: number) {
//         this.setText(this.basketPrice, `${value} синапсисов`);
//     }

//     set locked(items: IBasketList[]) {
//     this.setDisabled(this.orderButton, items.length === 0);
// }
// }

interface IBasketItem {
    index: number;
    title: string;
    price: number;
    id: string;
}
class Basket extends Component<IBasketItem> {
    private itemsList: HTMLElement;
    private basketPrice: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.itemsList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    }

    // Единый метод для управления элементами корзины
    set basketList(items: IBasketItem[]) {
        if (!items || items.length === 0) {
            this.showEmptyState();
            return;
        }

        const elements = items.map((item) => 
            this.createBasketItem(item)
        );

        this.itemsList.replaceChildren(...elements);
        this.updateOrderButton(items.length > 0);
    }

    private createBasketItem(item: IBasketItem): HTMLElement {
        const container = cloneTemplate<HTMLElement>('#card-basket');
        
        // Установка данных элемента
        this.setText(ensureElement('.basket__item-index', container), item.index);
        this.setText(ensureElement('.card__title', container), item.title);
        this.setText(
            ensureElement('.card__price', container), 
            `${item.price} синапсов` // Форматирование при отображении
        );

        // Обработка удаления
         const deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
         deleteButton.addEventListener('click', () => {
             this.events.emit('basket: delete', item); // item.index-1
         });

        return container;
    }

    private showEmptyState() {
        this.itemsList.replaceChildren(
            createElement<HTMLElement>('p', {
                textContent: 'Корзина пуста',
            })
        );
        this.updateOrderButton(false);
    }

    set totalPrice(value: number) {
        this.setText(this.basketPrice, `${value} синапсов`);
    }

    private updateOrderButton(state: boolean) {
        this.setDisabled(this.orderButton, !state);
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
    private basketView;


    constructor (private events: IEventEmiter & IEvents)  {
        
        this.productsModel = new ProductsModel(this.events);
        this.page = new Page(document.querySelector('.page__wrapper'), this.events);
        this.modal = new Modal(document.querySelector('.modal'), this.events)
        this.basketModel = new BasketModel(this.events);

        const basketContainer = cloneTemplate<HTMLElement>('#basket');
        this.basketView = new Basket(basketContainer, this.events);


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

    
    openBasket() {
    const products = this.basketModel.getItems()
        .map(id => this.productsModel.getItem(id))
        .filter(Boolean);

    this.basketView.basketList = products.map((product, idx) => ({
        id: product.id,
        index: idx + 1,
        title: product.title,
        price: product.price // Используем числовое значение
    }));
    
    this.basketView.totalPrice = products.reduce((sum, p) => sum + p.price, 0);

    this.modal.render({modalContent: this.basketView.render()});
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

eventss.on('product: add', (product: IProduct) => {
    presenter.addInBasket(product);
    
});

eventss.on('basket: delete', (product: IProduct) => {
    presenter.deleteFromBasket(product);
    presenter.openBasket();
})

eventss.on('basket: changed', () => {
	presenter.UpdateBasketCount();
});

eventss.on('basket: open', () => {
    presenter.openBasket();
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

