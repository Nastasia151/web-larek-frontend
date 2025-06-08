import { paymentType } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/form";

export interface IPaymentForm {
    payment: paymentType;
    address: string;
}

export class Payment extends Form<IPaymentForm> {
    protected choosePayButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
        this.choosePayButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);

        this.choosePayButtons.forEach((button) =>
            button.addEventListener('click', () =>
                this.events.emit('payment:change', { payment: button.name })
            ));
    }

    set payment(value: paymentType) {
        this.choosePayButtons.forEach((button) => {
            if (button.name === value) {
                this.toggleClass(button, 'button_alt-active', true);
            } else {
                this.toggleClass(button, 'button_alt-active', false);
            }
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}