import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['tab', 'panel'];
    static values = {
        activeTab: String,
        orientation: { type: String, default: 'horizontal' },
    };

    connect() {
        this._buildLayout();

        if (!this.activeTabValue && this.tabTargets.length > 0) {
            this.activeTabValue = this.tabTargets[0].dataset.tabId;
        }
        this._apply();
    }

    select(e) {
        this.activeTabValue = e.currentTarget.dataset.tabId;
        this._apply();
    }

    _buildLayout() {
        const tabs = this.tabTargets;
        const panels = this.panelTargets;
        if (tabs.length === 0) return;

        // Create tablist wrapper
        const tablist = document.createElement('div');
        tablist.setAttribute('role', 'tablist');
        tablist.className = this.orientationValue === 'vertical'
            ? 'flex flex-row md:flex-col md:w-48 border-b md:border-b-0 md:border-r border-border'
            : 'flex border-b border-border';
        this.element.insertBefore(tablist, this.element.firstChild);
        tabs.forEach(tab => tablist.appendChild(tab));

        // Create panels wrapper
        if (panels.length > 0) {
            const panelsWrapper = document.createElement('div');
            panelsWrapper.className = this.orientationValue === 'vertical' ? 'flex-1' : 'mt-4';
            this.element.appendChild(panelsWrapper);
            panels.forEach(panel => panelsWrapper.appendChild(panel));
        }
    }

    _apply() {
        this.tabTargets.forEach(tab => {
            const isActive = tab.dataset.tabId === this.activeTabValue;
            tab.setAttribute('aria-selected', isActive);
            if (isActive) {
                tab.setAttribute('data-active', '');
            } else {
                tab.removeAttribute('data-active');
            }
        });

        this.panelTargets.forEach(panel => {
            const isActive = panel.dataset.tabId === this.activeTabValue;
            panel.classList.toggle('hidden', !isActive);
        });
    }
}
