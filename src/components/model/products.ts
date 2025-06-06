import { IProduct } from "../../types";
import { IEvents } from "../base/events";

export interface IProductsModel {
	items: IProduct[];
	getItem(id: string): IProduct;
}

export class ProductsModel implements IProductsModel {
    items: IProduct[] = [];  // - массив продуктов

    constructor(protected events: IEvents) {
        this.items = [];
    }
    
    getItems(): IProduct[] {
        return this.items
    } // - вернуть список товаров

    getItem(id: string): IProduct {
        return this.items.find(item => item.id === id);
    } // - вернуть товар по id

    setItems (items: IProduct[]){
        this.items = items;
        this.events.emit('products_update', items);
    } //???
}
