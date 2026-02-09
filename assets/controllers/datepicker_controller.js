import { Controller } from '@hotwired/stimulus';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';

export default class extends Controller {
    static targets = ['input'];
    static values = {
        format: { type: String, default: 'Y-m-d' },
        enableTime: { type: Boolean, default: false },
    };

    connect() {
        this._fp = flatpickr(this.inputTarget, {
            dateFormat: this.formatValue,
            enableTime: this.enableTimeValue,
            allowInput: true,
        });
    }

    disconnect() {
        if (this._fp) this._fp.destroy();
    }
}
