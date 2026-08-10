import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    protected constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.submitButton = container.querySelector('.button')!;
        this.errorsContainer = container.querySelector('.form__errors') || container;

        container.addEventListener('submit', (ev) => {
            ev.preventDefault();
            this.onSubmit();
        });
    }

    protected abstract onSubmit(): void;

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
}