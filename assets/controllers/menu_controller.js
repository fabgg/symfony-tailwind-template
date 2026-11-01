import { Controller } from '@hotwired/stimulus';

/*
 * WAI-ARIA menu button (see ActionMenu.html.twig): roving focus between [role=menuitem] items.
 */
export default class extends Controller {
    static targets = ['button', 'menu', 'item'];

    connect() {
        this._onClickOutside = (e) => {
            if (this._isOpen() && !this.element.contains(e.target)) this.close(false);
        };
        document.addEventListener('click', this._onClickOutside);
    }

    disconnect() {
        document.removeEventListener('click', this._onClickOutside);
    }

    toggle() {
        this._isOpen() ? this.close() : this.open(0);
    }

    open(focusIndex = 0) {
        this.menuTarget.classList.remove('hidden');
        this.buttonTarget.setAttribute('aria-expanded', 'true');
        this._focusItem(focusIndex);
    }

    // Closing after an item activation does not steal focus from a dialog opened by that item.
    close(returnFocus = true) {
        if (!this._isOpen()) return;
        this.menuTarget.classList.add('hidden');
        this.buttonTarget.setAttribute('aria-expanded', 'false');
        if (returnFocus === true && this.menuTarget.contains(document.activeElement)) {
            this.buttonTarget.focus();
        }
    }

    buttonKeydown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.open(0);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.open(this.itemTargets.length - 1);
        }
    }

    menuKeydown(e) {
        const items = this.itemTargets;
        const index = items.indexOf(document.activeElement);
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this._focusItem((index + 1) % items.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this._focusItem((index - 1 + items.length) % items.length);
                break;
            case 'Home':
                e.preventDefault();
                this._focusItem(0);
                break;
            case 'End':
                e.preventDefault();
                this._focusItem(items.length - 1);
                break;
            case 'Escape':
                e.preventDefault();
                e.stopPropagation(); // do not close an enclosing modal
                this.close();
                break;
            case 'Tab':
                this.close(false);
                break;
            default:
                // Type-ahead: focus the next item starting with the typed character.
                if (e.key.length === 1 && /\S/.test(e.key)) {
                    const start = index + 1;
                    const ordered = [...items.slice(start), ...items.slice(0, start)];
                    const match = ordered.find((el) => el.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));
                    if (match) match.focus();
                }
        }
    }

    _focusItem(index) {
        this.itemTargets[index]?.focus();
    }

    _isOpen() {
        return !this.menuTarget.classList.contains('hidden');
    }
}
