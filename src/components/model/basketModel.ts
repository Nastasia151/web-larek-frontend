import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel {
    protected items: string[];

    constructor(protected events: IEvents) {
        this.items = [];
    }

    addItem(id: string) {
        this.items.push(id);
    } // - добавить в корзину

    getItemIndex (id: string) {
        return this.items.indexOf(id);
    } // вернуть порядковый номер товара в корзине

    deleteItem(id: string) {
        const itemIndex = this.getItemIndex(id);
		if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
        }
	} // - удалить товар из корзины

    basketTotal(items: IProduct[]) {
        return items.reduce((total, item) => {
            return total + item.price;
    }, 0);
    } // - считаем сумму заказа

    counterItemsInBasket (id: string) {}  // кол-во продуктов, добавленных в корзину??

    isItemAdded (id: string): boolean {
        return this.items.includes(id);
    }

    getItems(): string[] {
		return this.items;
	}

    clearBasket() {
        this.items = [];
    }

}
