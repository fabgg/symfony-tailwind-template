import { Controller } from '@hotwired/stimulus';

/*
 * Submits the form when a control changes (filters, page size selector).
 * Text inputs: debounced (data-autosubmit-delay-value, default 300 ms).
 * Empty fields are not sent, so the URL only holds the active criteria (?q=agen, not ?q=agen&status=&city=).
 *
 * <form data-controller="autosubmit">
 *   <select data-action="autosubmit#submit">…</select>
 *   <input type="search" data-action="input->autosubmit#debouncedSubmit">
 * </form>
 */
export default class extends Controller {
    static values = { delay: { type: Number, default: 300 } };

    connect() {
        this._onSubmit = () => this._skipEmptyFields();
        this.element.addEventListener('submit', this._onSubmit);
        // Turbo may restore the page from cache: re-enable the fields.
        this._onLoad = () => this._restoreFields();
        document.addEventListener('turbo:load', this._onLoad);
    }

    submit() {
        clearTimeout(this._timer);
        this.element.requestSubmit();
    }

    debouncedSubmit() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this.submit(), this.delayValue);
    }

    disconnect() {
        clearTimeout(this._timer);
        this.element.removeEventListener('submit', this._onSubmit);
        document.removeEventListener('turbo:load', this._onLoad);
    }

    // Only for GET forms (filters): a disabled field is not submitted.
    _skipEmptyFields() {
        if ((this.element.method || 'get').toLowerCase() !== 'get') return;
        this._skipped = [...this.element.elements].filter((el) => el.name && !el.disabled && el.value === '' && el.type !== 'submit');
        this._skipped.forEach((el) => { el.disabled = true; });
        // Re-enable right after the browser has built the request.
        setTimeout(() => this._restoreFields(), 0);
    }

    _restoreFields() {
        (this._skipped ?? []).forEach((el) => { el.disabled = false; });
        this._skipped = [];
    }
}
