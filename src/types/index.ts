interface IProduct {
    id: string;
    title: string;
    price: number | null;
    category: string;
    image: string;
    description?: string;
}

interface IProductInBasket {
   title: string;
   price: number | null;
}

interface IPaymentForm {
    paymentType: 'online' | 'onReceipt' | null;
    address: string;
}

interface IContact {
    email: string;
    phone: string;
}