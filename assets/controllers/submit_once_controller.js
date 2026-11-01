import { Controller } from '@hotwired/stimulus';

/*
 * Put on a submit button: once its form is submitted, the button is disabled (no double submit),
 * marked aria-busy and shows a spinner. The button stays enabled until the request starts.
 *
 * <button type="submit" data-controller="submit-once">Save</button>
 */
export default class extends Controller {
    connect() {
        this._form = this.element.form;
        if (!this._form) return;
        this._onSubmit = () => {
            // Disable after the submit event so that the button value is still sent.
            setTimeout(() => {
                this.element.disabled = true;
                this.element.setAttribute('aria-busy', 'true');
                this.element.insertAdjacentHTML('afterbegin',
                    '<svg class="w-4 h-4 animate-spin motion-reduce:animate-none" data-submit-once-spinner fill="none" viewBox="0 0 24 24" aria-hidden="true">'
                    + '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>'
                    + '<path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3"/></svg>');
            }, 0);
        };
        this._form.addEventListener('submit', this._onSubmit);
        // Turbo restores pages from cache: re-enable the button.
        this._reset = () => this.reset();
        document.addEventListener('turbo:load', this._reset);
    }

    // Only undo what this controller did: a button disabled for another reason stays disabled.
    reset() {
        if (this.element.getAttribute('aria-busy') !== 'true') return;
        this.element.disabled = false;
        this.element.removeAttribute('aria-busy');
        this.element.querySelector('[data-submit-once-spinner]')?.remove();
    }

    disconnect() {
        this._form?.removeEventListener('submit', this._onSubmit);
        document.removeEventListener('turbo:load', this._reset);
    }
}
