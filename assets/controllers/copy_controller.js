import { Controller } from '@hotwired/stimulus';

// CopyButton: copies a value and announces the confirmation (screen readers + short visual title change).
export default class extends Controller {
    static targets = ['status'];
    static values = { value: String, message: String };

    async copy() {
        try {
            await navigator.clipboard.writeText(this.valueValue);
            this.statusTarget.textContent = this.messageValue;
            this.element.title = this.messageValue;
            setTimeout(() => { this.statusTarget.textContent = ''; }, 2000);
        } catch {
            this.statusTarget.textContent = 'Copy failed.';
        }
    }
}
