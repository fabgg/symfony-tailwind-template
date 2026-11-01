import { Controller } from '@hotwired/stimulus';

/*
 * Submits the form when a control changes (filters, page size selector).
 * Text inputs: debounced (data-autosubmit-delay-value, default 300 ms).
 *
 * <form data-controller="autosubmit">
 *   <select data-action="autosubmit#submit">…</select>
 *   <input type="search" data-action="input->autosubmit#debouncedSubmit">
 * </form>
 */
export default class extends Controller {
    static values = { delay: { type: Number, default: 300 } };

    submit() {
        this.element.requestSubmit();
    }

    debouncedSubmit() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this.submit(), this.delayValue);
    }

    disconnect() {
        clearTimeout(this._timer);
    }
}
