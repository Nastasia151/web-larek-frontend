import { cloneTemplate, createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export interface IBasketItem {
    index: number;
    title: string;
    price: number;
    id: string;
}
export class Basket extends Component<IBasketItem> {
    private itemsList: HTMLElement;
    private basketPrice: HTMLElement;
    private orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.itemsList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('order:open');
        });
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
             this.events.emit('basket:delete', item); // item.index-1
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
