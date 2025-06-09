import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface ISuccessOrder {
    totalPrice: number;
    close: string;
}

export class SuccessOrder extends Component<ISuccessOrder> {
    protected total: HTMLElement;
    close: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    }

     set totalPrice(total: number) {
        this.setText(this.total, `Списано ${total} синапсов`);
    }
}