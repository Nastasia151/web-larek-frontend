import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IPage {
    gallery: IProduct[];
    counter: number;
    locked: boolean;
}

export class Page extends Component<IPage> {
   protected productsContainer: HTMLElement;
   protected basketCounter: HTMLElement;
   protected pageWrapper: HTMLElement;
   protected openBasketButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this.productsContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.openBasketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container)

        this.openBasketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set gallery(items: HTMLElement[]) {
        this.productsContainer.replaceChildren(...items);
    }

    set counter(value: number) {
        this.setText(this.basketCounter, value);
    }

    set locked(value: boolean) {
        if (value) {
            this.pageWrapper.classList.add('page__wrapper_locked');
        } else {
            this.pageWrapper.classList.remove('page__wrapper_locked');
        }
    }
}