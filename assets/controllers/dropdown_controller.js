import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['menu'];
    static values = {
        autoOpen: { type: Boolean, default: false },
        persistent: { type: Boolean, default: false },
    };

    connect() {
        if (!this.persistentValue) {
            this._onClickOutside = (e) => {
                if (!this.element.contains(e.target)) {
                    this.close();
                }
            };
            this._onKeydown = (e) => {
                if (e.key === 'Escape') this.close();
            };
            document.addEventListener('click', this._onClickOutside);
            document.addEventListener('keydown', this._onKeydown);
        }

        // Auto-open if a child link is active (for sidebar nav groups)
        if (this.autoOpenValue && this.hasMenuTarget) {
            const hasActiveChild = this.menuTarget.querySelector('[data-active-item]');
            if (hasActiveChild) {
                this.menuTarget.classList.remove('hidden');
                this._rotateChevron(true);
            }
        }
    }

    disconnect() {
        if (this._onClickOutside) {
            document.removeEventListener('click', this._onClickOutside);
        }
        if (this._onKeydown) {
            document.removeEventListener('keydown', this._onKeydown);
        }
    }

    toggle() {
        const isHidden = this.menuTarget.classList.toggle('hidden');
        this._rotateChevron(!isHidden);
    }

    close() {
        this.menuTarget.classList.add('hidden');
        this._rotateChevron(false);
    }

    _rotateChevron(open) {
        const chevron = this.element.querySelector('[data-chevron]');
        if (chevron) {
            chevron.classList.toggle('rotate-180', open);
        }
    }
}
