import { IEventEmiter } from "..";
import { IProduct, paymentType } from "../types";
import { cloneTemplate } from "../utils/utils";
import { IEvents } from "./base/events";
import { BasketModel } from "./model/basketModel";
import { ProductsModel } from "./model/products";
import { UserContactsModel } from "./model/UserContactsModel";
import { Basket } from "./view/basket";
import { GalleryCard, PreviewCard } from "./view/cards";
import { ContactForm } from "./view/contacts";
import { Modal } from "./view/modal";
import { Page } from "./view/page";
import { Payment } from "./view/payment";
import { SuccessOrder } from "./view/success";

export class Presenter {
    private productsModel: ProductsModel;
    private page;
    private modal;
    private basketModel: BasketModel;
    private basketView;
    private userContactsModel: UserContactsModel;
    private paymentForm;
    private contactForm;
    private successOrderView;


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

        const successOrderContainer = cloneTemplate<HTMLElement>('#success');
        this.successOrderView = new SuccessOrder(successOrderContainer, this.events);
    }

    updateCatalog(data: IProduct[]) {
        this.productsModel.setItems(data);
}

    showCard(products: IProduct[]) {
        this.page.gallery = this.setProductsGallery(products);
    }
    
    // подумать как переписать
    setProductsGallery (items: IProduct[]): HTMLElement[] {
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
    
    this.basketView.totalPrice = this.basketModel.basketTotal(products);
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

        openSuccessOrder(totalPrice: number) {
    this.successOrderView.totalPrice = totalPrice;
    
    this.successOrderView.close.addEventListener('click', () => {
        this.modal.close();
        this.basketModel.clearBasket();
        this.userContactsModel.clearContact();
        this.UpdateBasketCount();
    });

    this.modal.render({ modalContent: this.successOrderView.render() });
}

handleContactSubmit() {
    if (this.userContactsModel.isValidContact().isValid) {
        const total = this.basketModel.basketTotal(
            this.basketModel.getItems().map(id => this.productsModel.getItem(id))
        );
        this.modal.close();
        this.openSuccessOrder(total);
    }
}
}