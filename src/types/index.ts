import { Component } from "../components/base/component";

export interface IApiProductsResponse {
    total: number;
    items: IProduct[];
}

export type paymentType = 'online' | 'onReceipt';

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

export interface IBasketModel {
    items: IProduct[];
    totalSumm: number;
    canCheckOut: boolean;
}

export interface IContact {
    payment: paymentType;
    address: string;
    email: string;
    phone: string;
}

export interface IValidationResult {
    isValid: boolean;
    message: string;
}

export interface IOrderResult {
    id: string;
}

export interface IOrder {
    items: string[];
    total: number;
    payment: paymentType;
    address: string;
	email: string;
	phone: string;
}