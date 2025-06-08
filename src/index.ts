import { Component } from './components/base/component';
import { IProduct, IBasketModel, paymentType } from './types/index'
import './scss/styles.scss';
import { cloneTemplate, createElement, ensureAllElements, ensureElement } from './utils/utils';
import { EventEmitter, IEvents } from './components/base/events';
import { WebLarekAPI } from './components/ProductsApi';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { ProductsModel } from './components/model/products'
import { Page } from './components/view/page';
import { Modal } from './components/view/modal';
import { GalleryCard, PreviewCard } from './components/view/cards';
import { BasketModel } from './components/model/basketModel';
import { Basket } from './components/view/basket';
import { IContact } from './types/index';
import { UserContactsModel } from './components/model/UserContactsModel';
import { Form } from './components/base/form';
import { Payment } from './components/view/payment';
import { ContactForm } from './components/view/contacts';

const api = new WebLarekAPI(CDN_URL, API_URL);

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

interface ISuccessOrder {
    totalPrice: number;
}

class SuccessOrder extends Component<ISuccessOrder> {
    protected total: HTMLElement;
    protected close: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    }
}

class Presenter {
    private productsModel: ProductsModel;
    private page;
    private modal;
    private basketModel: BasketModel;
    private basketView;
    private userContactsModel: UserContactsModel;
    private paymentForm;
    private contactForm;


    constructor (private events: IEventEmiter & IEvents)  {
        
        this.productsModel = new ProductsModel(this.events);
        this.page = new Page(document.querySelector('.page__wrapper'), this.events);
        this.modal = new Modal(document.querySelector('.modal'), this.events)
        this.basketModel = new BasketModel(this.events);
        this.userContactsModel = new UserContactsModel();
        const paymentFormContainer = cloneTemplate<HTMLFormElement>('#order');
        this.paymentForm = new Payment(paymentFormContainer, this.events);
        const contactFormContainer = cloneTemplate<HTMLFormElement>('#contacts');
        this.contactForm = new ContactForm(contactFormContainer, this.events);

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
        price: product.price 
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

    openPayForm() {
    const validation = this.userContactsModel.isValidPaymentForm();
    this.modal.render({
        modalContent: this.paymentForm.render({
            payment: this.userContactsModel.payment,
            address: this.userContactsModel.address,
            valid: validation.isValid,
            errors: [validation.message],
        }),
    });
}

updatePaymentInfo(data: paymentType) {
    this.userContactsModel.payment = data;
    const validation = this.userContactsModel.isValidPaymentForm();
    this.paymentForm.payment = this.userContactsModel.payment;
    this.paymentForm.valid = validation.isValid;
    this.paymentForm.errors = validation.message;
}

updateAddressInfo(data: string) {
    this.userContactsModel.address = data;
    const validation = this.userContactsModel.isValidPaymentForm();
    this.paymentForm.valid = validation.isValid;
    this.paymentForm.errors = validation.message;
}

    openContactForm() {
        const validation = this.userContactsModel.isValidContact();
        this.modal.render({
            modalContent: this.contactForm.render({
                email: this.userContactsModel.email,
                phone: this.userContactsModel.phone,
                valid: validation.isValid,
                errors: [validation.message]
            })
        });
    }

    // Обработчики обновления полей
    updateEmailInfo(data: string) {
        this.userContactsModel.email = data;
        const validation = this.userContactsModel.isValidContact();
        this.contactForm.valid = validation.isValid;
        this.contactForm.errors = validation.message;
    }

    updatePhoneInfo(data: string) {
        this.userContactsModel.phone = data;
        const validation = this.userContactsModel.isValidContact();
        this.contactForm.valid = validation.isValid;
        this.contactForm.errors = validation.message;
    }
}

const eventss = new EventEmitter();

const presenter = new Presenter(eventss)

eventss.on('payment:change', (data: { payment: paymentType }) => {
	presenter.updatePaymentInfo(data.payment);
});
eventss.on('order.address:change', (data: {field: string, value: string}) => {
    presenter.updateAddressInfo(data.value);});

eventss.on('order:submit', () => {
    presenter.openContactForm();
});

eventss.on('contacts.email:change', (data: { value: string }) => {
    presenter.updateEmailInfo(data.value);
});

eventss.on('contacts.phone:change', (data: { value: string }) => {
    presenter.updatePhoneInfo(data.value);
});

api.getProductList()
  .then(data => 
    presenter.updateCatalog(data))
  .catch((err) => console.error(err))


eventss.on('products:update', (data: IProduct[]) => {
	presenter.showCard(data);
});

eventss.on('card:open', (card: IProduct) => {
	presenter.openCardPreview(card);
});

eventss.on('modal:open', () => {
	presenter.scrollLock();
});
eventss.on('modal:close', () => {
	presenter.scrollUnlock();
});

eventss.on('product:add', (product: IProduct) => {
    presenter.addInBasket(product);
    
});

eventss.on('basket:delete', (product: IProduct) => {
    presenter.deleteFromBasket(product);
    presenter.openBasket();
})

eventss.on('basket:changed', () => {
	presenter.UpdateBasketCount();
});

eventss.on('basket:open', () => {
    presenter.openBasket();
});

eventss.on('order:open', () => {
	presenter.openPayForm();
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

