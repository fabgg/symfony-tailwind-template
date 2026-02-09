import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['item', 'content', 'trigger'];
    static values = {
        multiple: { type: Boolean, default: false },
        openItems: { type: Array, default: [] },
    };

    connect() {
        this._apply();
    }

    toggle(e) {
        const trigger = e.currentTarget;
        if (trigger.disabled) return;
        const itemId = trigger.dataset.itemId;
        const isOpen = this.openItemsValue.includes(itemId);

        if (isOpen) {
            this.openItemsValue = this.openItemsValue.filter(id => id !== itemId);
        } else {
            if (this.multipleValue) {
                this.openItemsValue = [...this.openItemsValue, itemId];
            } else {
                this.openItemsValue = [itemId];
            }
        }
        this._apply();
    }

    _apply() {
        this.contentTargets.forEach(content => {
            const item = content.closest('[data-item-id]');
            if (!item) return;
            const itemId = item.dataset.itemId;
            const isOpen = this.openItemsValue.includes(itemId);

            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }

            // Update chevron
            const trigger = item.querySelector('[data-accordion-target="trigger"]');
            if (trigger) {
                const chevron = trigger.querySelector('svg');
                if (chevron) {
                    chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    }
}
