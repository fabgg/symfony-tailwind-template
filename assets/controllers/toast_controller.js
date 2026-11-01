import { Controller } from '@hotwired/stimulus';

/*
 * Toast (see Toast/Region.html.twig): auto-dismiss after `duration` ms (0 = persistent),
 * paused while hovered or focused so the user has time to read.
 */
export default class extends Controller {
    static values = { duration: { type: Number, default: 5000 } };

    connect() {
        this._remaining = this.durationValue;
        this.resume();
    }

    disconnect() {
        clearTimeout(this._timer);
    }

    pause() {
        if (!this._timer) return;
        clearTimeout(this._timer);
        this._timer = null;
        this._remaining -= Date.now() - this._startedAt;
    }

    resume() {
        if (this.durationValue <= 0 || this._timer || this.element.contains(document.activeElement)) return;
        this._startedAt = Date.now();
        this._timer = setTimeout(() => this.dismiss(), Math.max(this._remaining, 1000));
    }

    dismiss() {
        clearTimeout(this._timer);
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            this.element.remove();
            return;
        }
        this.element.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out';
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateY(0.5rem)';
        setTimeout(() => this.element.remove(), 150);
    }
}
