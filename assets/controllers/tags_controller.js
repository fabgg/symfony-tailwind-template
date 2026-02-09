import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';

export default class extends Controller {
    static targets = ['input'];
    static values = {
        maxItems: { type: Number, default: 0 },
        delimiter: { type: String, default: ',' },
    };

    connect() {
        const options = {
            create: true,
            delimiter: this.delimiterValue,
            persist: false,
            plugins: ['remove_button'],
        };
        if (this.maxItemsValue > 0) {
            options.maxItems = this.maxItemsValue;
        }

        this._ts = new TomSelect(this.inputTarget, options);
    }

    disconnect() {
        if (this._ts) this._ts.destroy();
    }
}
