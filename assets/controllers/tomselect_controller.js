import { Controller } from '@hotwired/stimulus';
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.default.min.css';

export default class extends Controller {
    static targets = ['select'];
    static values = {
        searchable: { type: Boolean, default: true },
        placeholder: { type: String, default: '' },
    };

    connect() {
        const options = {
            allowEmptyOption: true,
            plugins: [],
        };

        if (this.placeholderValue) {
            options.placeholder = this.placeholderValue;
        }

        if (this.selectTarget.multiple) {
            options.plugins.push('remove_button');
        }

        this._ts = new TomSelect(this.selectTarget, options);
    }

    disconnect() {
        if (this._ts) this._ts.destroy();
    }
}
