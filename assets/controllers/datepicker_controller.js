import { Controller } from '@hotwired/stimulus';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';

// Add other locales here (php bin/console importmap:require flatpickr/dist/l10n/<code>.js).
const LOCALES = { fr: French };

/*
 * format:    value submitted to the server (default ISO Y-m-d, matches DatePickerType 'format').
 * altFormat: value displayed to the user (e.g. d/m/Y); empty = same as format.
 * locale:    flatpickr locale code (month/day names, first day of week).
 */
export default class extends Controller {
    static targets = ['input'];
    static values = {
        format: { type: String, default: 'Y-m-d' },
        altFormat: { type: String, default: '' },
        locale: { type: String, default: '' },
        enableTime: { type: Boolean, default: false },
    };

    connect() {
        const options = {
            dateFormat: this.formatValue,
            enableTime: this.enableTimeValue,
            allowInput: true,
        };
        if (this.altFormatValue) {
            options.altInput = true;
            options.altFormat = this.altFormatValue;
            // keep the label and validation state on the visible input
            options.altInputClass = this.inputTarget.className;
        }
        if (LOCALES[this.localeValue]) {
            options.locale = LOCALES[this.localeValue];
        }
        this._fp = flatpickr(this.inputTarget, options);

        // The visible input must keep the id so that <label for> still works.
        if (this._fp.altInput) {
            const id = this.inputTarget.id;
            this.inputTarget.removeAttribute('id');
            this._fp.altInput.id = id;
            ['aria-describedby', 'aria-invalid', 'required'].forEach((attr) => {
                if (this.inputTarget.hasAttribute(attr)) {
                    this._fp.altInput.setAttribute(attr, this.inputTarget.getAttribute(attr));
                }
            });
            this._originalId = id;
        }
    }

    disconnect() {
        if (this._originalId) this.inputTarget.id = this._originalId;
        if (this._fp) this._fp.destroy();
    }
}
