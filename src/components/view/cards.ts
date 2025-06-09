import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IProductCard {
    title: string;
    description?: string;
    image: string;
    price: string;
    category: string;
}

export class GalleryCard extends Component<IProductCard> {
    protected productTitle: HTMLElement;
    protected productImage: HTMLImageElement;
    protected productPrice: HTMLElement;
    protected productCategory: HTMLElement;
    protected productId: number;
    protected openPreviewButton: HTMLElement;

    
    constructor(protected readonly container: HTMLElement, items: IProduct, protected events: IEvents) {
        super(container);
        this.productTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.productImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.productPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.productCategory = ensureElement<HTMLElement>('.card__category', this.container);

        this.openPreviewButton = this.container as HTMLButtonElement;

        this.openPreviewButton.addEventListener('click', () => {
            this.events.emit('card:open', items);
        });
    }

    set title(value: string) {
        this.setText(this.productTitle, value);
    }

    set image(value: string) {
        this.setImage(this.productImage, value, this.title)
    }

    set price(value: number | null) {
        if(value === null) {
          this.setText(this.productPrice, `Бесценно`);
        } else {
            this.setText(this.productPrice, `${value} синапсисов`);
        }
    }

    set category(value: string) {
        this.setText(this.productCategory, value);
    }

    set id(value: number) {
        this.productId = value;
    }

     
}

export class PreviewCard extends GalleryCard {
    protected productDescription: HTMLElement;
    protected addButton: HTMLButtonElement;
    protected productAdded: boolean;

    constructor(protected readonly container: HTMLElement, item: IProduct, protected events: IEvents) {
        super(container, item, events);
        this.productDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.addButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        if (this.addButton) {
			this.addButton.addEventListener('click', () => {
					this.events.emit('product:add', item);
			});
		}
    }

    set description(value: string) {
        this.setText(this.productDescription, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setHidden(this.addButton);
        } else {
            this.setVisible(this.addButton);
            super.price = value;
        }
    }

    set addedInBasket (value: boolean) {
        this.productAdded = value;
        if (value) {
            this.setDisabled(this.addButton, true);
        } else {
            this.setDisabled(this.addButton, false);
        }
    }
}
