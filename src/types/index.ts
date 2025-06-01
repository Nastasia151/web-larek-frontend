import { Component } from "../components/base/component";

type ApiProductsResponse<T> = {
    total: number;
    items: T[];
}

export interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description: string;
} 

// interface IProductInBasket {
//    title: string;
//    price: number | null;
// }

export interface IProductsApi {
    getProducts: () => Promise<IProduct[]>
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

