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
import { Presenter } from './components/Presenter';

const api = new WebLarekAPI(CDN_URL, API_URL);

export interface IEventEmiter {
	emit: (event: string, data: unknown) => void;
}

const events = new EventEmitter();

const presenter = new Presenter(events)

api.getProductList()
  .then(data => 
    presenter.updateCatalog(data))
  .catch((err) => console.error(err))

events.on('order:success', (data: { totalPrice: number }) => {
    presenter.openSuccessOrder(data.totalPrice);
});

events.on('payment:change', (data: { payment: paymentType }) => {
	presenter.updatePayment(data.payment);
});
events.on('order.address:change', (data: {field: string, value: string}) => {
    presenter.updateAddress(data.value);});

events.on('order:submit', () => {
    presenter.openContactForm();
});

events.on('contacts.email:change', (data: { value: string }) => {
    presenter.updateEmail(data.value);
});

events.on('contacts.phone:change', (data: { value: string }) => {
    presenter.updatePhone(data.value);
});

events.on('products:update', (data: IProduct[]) => {
	presenter.createCard(data);
});

events.on('card:open', (card: IProduct) => {
	presenter.openCardPreview(card);
});

events.on('modal:open', () => {
	presenter.scrollLock();
});
events.on('modal:close', () => {
	presenter.scrollUnlock();
});

events.on('product:add', (product: IProduct) => {
    presenter.addInBasket(product);
    
});

events.on('basket:delete', (product: IProduct) => {
    presenter.deleteFromBasket(product);
    presenter.openBasket();
})

events.on('basket:changed', () => {
	presenter.UpdateBasketCount();
});

events.on('basket:open', () => {
    presenter.openBasket();
});

events.on('order:open', () => {
	presenter.openPaymentForm();
});

events.on('contacts:submit', () => {
    presenter.handleContactSubmit();
});


