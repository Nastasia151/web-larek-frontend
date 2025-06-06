import { Component } from "../components/base/component";

export interface IApiProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description: string;
} 

export interface IProductsModel {
    items: IProduct[];
    getItem(id: string): IProduct;
}

// interface IProductInBasket {
//    title: string;
//    price: number | null;
// }

export interface IBasketModel {
    items: IProduct[];
    totalSumm: number;
    canCheckOut: boolean;
}

interface IPaymentForm {
    
}

interface IContact {
    paymentType: 'online' | 'onReceipt' | null;
    address: string;
    email: string;
    phone: string;
}

// model 
