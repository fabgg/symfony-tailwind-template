import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['icon'];
    static values = { mode: { type: String, default: 'auto' } };

    connect() {
        const saved = localStorage.getItem('darkmode');
        if (saved) {
            this.modeValue = saved;
        }
        this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._onSystemChange = () => this._apply();
        this._mediaQuery.addEventListener('change', this._onSystemChange);
        this._apply();
    }

    disconnect() {
        this._mediaQuery.removeEventListener('change', this._onSystemChange);
    }

    toggle() {
        const cycle = { auto: 'dark', dark: 'light', light: 'auto' };
        this.modeValue = cycle[this.modeValue] || 'auto';
        localStorage.setItem('darkmode', this.modeValue);
        this._apply();
    }

    _apply() {
        const html = document.documentElement;
        let isDark;
        if (this.modeValue === 'dark') {
            isDark = true;
        } else if (this.modeValue === 'light') {
            isDark = false;
        } else {
            isDark = this._mediaQuery.matches;
        }
        html.classList.toggle('dark', isDark);
        this._updateIcon();
    }

    _updateIcon() {
        if (!this.hasIconTarget) return;
        const icons = {
            auto: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>`,
            light: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
            dark: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        };
        this.iconTarget.innerHTML = icons[this.modeValue] || icons.auto;
    }
}
