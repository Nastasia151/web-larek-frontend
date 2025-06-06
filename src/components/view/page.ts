import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IPage {
    gallery: IProduct[];
    counter: number;
}

export class Page extends Component<IPage> {
   protected productsContainer: HTMLElement;
   protected basketCounter: HTMLElement;
   protected pageWrapper: HTMLElement;
   protected basketButton: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.productsContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)

        this.basketButton.addEventListener('click', () => {
            this.events.emit('open_basket');
        });
    }

    set gallery(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this.basketCounter, value);
    }
}