import { Controller } from '@hotwired/stimulus';

/*
 * SearchInput behaviour: clear button, and a global shortcut (default « / ») that focuses the field
 * unless the user is already typing somewhere.
 */
export default class extends Controller {
    static targets = ['input', 'clear'];
    static values = { shortcut: { type: String, default: '/' } };

    connect() {
        if (!this.shortcutValue) return;
        this._onKeydown = (e) => {
            if (e.key !== this.shortcutValue || e.ctrlKey || e.metaKey || e.altKey) return;
            const el = document.activeElement;
            if (el && (el.isContentEditable || el.matches('input, textarea, select'))) return;
            e.preventDefault();
            this.inputTarget.focus();
            this.inputTarget.select();
        };
        document.addEventListener('keydown', this._onKeydown);
    }

    disconnect() {
        if (this._onKeydown) document.removeEventListener('keydown', this._onKeydown);
    }

    toggleClear() {
        this.clearTarget.classList.toggle('hidden', this.inputTarget.value === '');
    }

    clear() {
        this.inputTarget.value = '';
        this.toggleClear();
        this.inputTarget.focus();
        this.inputTarget.form?.requestSubmit();
    }
}
