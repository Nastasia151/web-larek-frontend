import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/form";

export interface IContactForm {
    email: string;
    phone: string;
}

export class ContactForm extends Form<IContactForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);


        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`contacts:submit`); // contacts:submit
});
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }



}
