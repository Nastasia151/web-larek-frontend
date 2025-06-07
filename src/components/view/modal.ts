import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IModalData {
    modalContent: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.content = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.content.addEventListener('click', (event) => event.stopPropagation());
    }

    set modalContent(value: HTMLElement) {
        this.content.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content.replaceChildren();
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}