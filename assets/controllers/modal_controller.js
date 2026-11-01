import { Controller } from '@hotwired/stimulus';

const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

/*
 * Accessible modal: role="dialog" + aria-modal on the dialog element (see Modal.html.twig),
 * focus trapped while open, focus returned to the trigger on close, Escape closes.
 * Open: any element with data-modal-trigger="<modal id>", or dispatch "modal:open" on the element.
 * The trigger may name the field to focus with data-modal-focus="<field id>" (e.g. a « Complete » link).
 */
export default class extends Controller {
    static targets = ['dialog'];
    static values = { open: { type: Boolean, default: false } };

    connect() {
        this._onKeydown = (e) => {
            if (!this.openValue) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            } else if (e.key === 'Tab') {
                this._keepFocusInside(e);
            }
        };
        document.addEventListener('keydown', this._onKeydown);

        this._onTriggerClick = (e) => {
            const trigger = e.target.closest('[data-modal-trigger]');
            if (trigger && trigger.dataset.modalTrigger === this.element.id) {
                e.preventDefault();
                this.open(trigger);
            }
        };
        document.addEventListener('click', this._onTriggerClick);

        this._onOpenEvent = () => this.open();
        this.element.addEventListener('modal:open', this._onOpenEvent);
    }

    disconnect() {
        document.removeEventListener('keydown', this._onKeydown);
        document.removeEventListener('click', this._onTriggerClick);
        this.element.removeEventListener('modal:open', this._onOpenEvent);
        if (this.openValue) document.body.style.overflow = '';
    }

    open(trigger = null) {
        this._returnFocusTo = trigger instanceof HTMLElement ? trigger : document.activeElement;
        this.openValue = true;
        this.element.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this._focusFirst(trigger instanceof HTMLElement ? trigger.dataset.modalFocus : null);
        window.dispatchEvent(new CustomEvent('modal:opened', { detail: { id: this.element.id } }));
    }

    close() {
        if (!this.openValue) return;
        this.openValue = false;
        this.element.classList.add('hidden');
        document.body.style.overflow = '';
        this._restoreFocus();
        window.dispatchEvent(new CustomEvent('modal:closed', { detail: { id: this.element.id } }));
    }

    // Return focus to the trigger; if it is no longer visible (e.g. an item of a closed ActionMenu),
    // to the button of its menu.
    _restoreFocus() {
        let target = this._returnFocusTo;
        if (!target || !document.contains(target)) return;
        if (target.getClientRects().length === 0) {
            target = target.closest('[data-controller~="menu"]')?.querySelector('[data-menu-target="button"]') ?? null;
        }
        target?.focus();
    }

    closeOnOverlay(e) {
        if (e.target === e.currentTarget) this.close();
    }

    _focusables() {
        if (!this.hasDialogTarget) return [];
        return [...this.dialogTarget.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
    }

    // Focus order: [autofocus] / [data-modal-initial-focus], else the first form field,
    // else the first focusable element after the close button.
    _focusFirst(fieldId = null) {
        const items = this._focusables();
        const requested = fieldId ? this.element.querySelector(`#${CSS.escape(fieldId)}`) : null;
        const preferred = requested || this.dialogTarget?.querySelector('[autofocus], [data-modal-initial-focus]');
        const firstField = items.find((el) => el.matches('input, select, textarea'));
        (preferred || firstField || items[1] || items[0])?.focus();
    }

    _keepFocusInside(e) {
        const items = this._focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!this.dialogTarget.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}
