import { IProduct } from "../../types";
import { IEvents } from "../base/events";


export class BasketModel {
    protected items: string[];

    constructor(protected events: IEvents) {
        this.items = [];
    }

    addItem(id: string) {
        this.items.push(id);
        this.events.emit('basket: changed');
    } // - добавить в корзину

    getItemIndex (id: string) {
        return this.items.indexOf(id);
    } // вернуть индекс товара в корзине

    getItemNumber (id: string) {
        this.events.emit('basket: changed');
        const itemIndex = this.getItemIndex(id); 
        return itemIndex + 1;
    }

    deleteItem(id: string) {
        const itemIndex = this.getItemIndex(id);
		if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
        }
        this.events.emit('basket: changed');
	} // - удалить товар из корзины

    basketTotal(items: IProduct[]) {
        this.events.emit('basket: changed');
        return items.reduce((total, item) => {
            return total + item.price;
    }, 0);
    } // - считаем сумму заказа

    counterItemsInBasket (): number {
        return this.items.length;
    }  // кол-во продуктов, добавленных в корзину??

    isItemAdded (id: string): boolean {
        return this.items.includes(id);
    }

    getItems(): string[] {
		return this.items;
	}

    clearBasket() {
        this.items = [];
    }

    setItems (items: string[]){
        this.items = items;
        this.events.emit('products: update', items);
    }
}
