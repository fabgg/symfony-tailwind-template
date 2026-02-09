import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['dialog'];
    static values = { open: { type: Boolean, default: false } };

    connect() {
        this._onKeydown = (e) => {
            if (e.key === 'Escape' && this.openValue) this.close();
        };
        document.addEventListener('keydown', this._onKeydown);

        // Listen for clicks on trigger buttons targeting this modal
        this._onTriggerClick = (e) => {
            const trigger = e.target.closest('[data-modal-trigger]');
            if (trigger && trigger.dataset.modalTrigger === this.element.id) {
                e.preventDefault();
                this.open();
            }
        };
        document.addEventListener('click', this._onTriggerClick);
    }

    disconnect() {
        document.removeEventListener('keydown', this._onKeydown);
        document.removeEventListener('click', this._onTriggerClick);
    }

    open() {
        this.openValue = true;
        this.element.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this._trapFocus();
    }

    close() {
        this.openValue = false;
        this.element.classList.add('hidden');
        document.body.style.overflow = '';
    }

    closeOnOverlay(e) {
        if (e.target === e.currentTarget) this.close();
    }

    _trapFocus() {
        if (!this.hasDialogTarget) return;
        const focusable = this.dialogTarget.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length) focusable[0].focus();
    }
}
