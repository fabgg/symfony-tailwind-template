import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['text', 'color', 'preview'];

    syncFromText() {
        const val = this.textTarget.value;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            this.colorTarget.value = val;
            this.previewTarget.style.backgroundColor = val;
        }
    }

    syncFromColor() {
        const val = this.colorTarget.value;
        this.textTarget.value = val;
        this.previewTarget.style.backgroundColor = val;
    }
}
