import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['sidebar', 'overlay', 'content', 'logo', 'logoSmall'];
    static values = { collapsed: { type: Boolean, default: false } };

    connect() {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
            this.collapsedValue = saved === 'true';
        }
        this._apply();
        this._onResize = () => this._handleResize();
        window.addEventListener('resize', this._onResize);
    }

    disconnect() {
        window.removeEventListener('resize', this._onResize);
    }

    toggle() {
        if (this._isMobile()) {
            this._toggleMobile();
        } else {
            this.collapsedValue = !this.collapsedValue;
            localStorage.setItem('sidebar-collapsed', this.collapsedValue);
            this._apply();
        }
    }

    closeOverlay() {
        if (this._isMobile()) {
            this.sidebarTarget.classList.add('-translate-x-full');
            this.overlayTarget.classList.add('hidden');
        }
    }

    _toggleMobile() {
        const isHidden = this.sidebarTarget.classList.contains('-translate-x-full');
        if (isHidden) {
            this.sidebarTarget.classList.remove('-translate-x-full');
            this.overlayTarget.classList.remove('hidden');
        } else {
            this.sidebarTarget.classList.add('-translate-x-full');
            this.overlayTarget.classList.add('hidden');
        }
    }

    _apply() {
        if (this._isMobile()) return;
        const sidebar = this.sidebarTarget;
        const content = this.contentTarget;
        if (this.collapsedValue) {
            sidebar.classList.remove('w-64');
            sidebar.classList.add('w-16');
            content.classList.remove('lg:ml-64');
            content.classList.add('lg:ml-16');
            sidebar.querySelectorAll('[data-sidebar-label]').forEach(el => el.classList.add('lg:hidden'));
            if (this.hasLogoTarget) this.logoTarget.classList.add('lg:hidden');
            if (this.hasLogoSmallTarget) this.logoSmallTarget.classList.remove('lg:hidden');
        } else {
            sidebar.classList.remove('w-16');
            sidebar.classList.add('w-64');
            content.classList.remove('lg:ml-16');
            content.classList.add('lg:ml-64');
            sidebar.querySelectorAll('[data-sidebar-label]').forEach(el => el.classList.remove('lg:hidden'));
            if (this.hasLogoTarget) this.logoTarget.classList.remove('lg:hidden');
            if (this.hasLogoSmallTarget) this.logoSmallTarget.classList.add('lg:hidden');
        }
    }

    _handleResize() {
        if (this._isMobile()) {
            this.sidebarTarget.classList.add('-translate-x-full');
            this.overlayTarget.classList.add('hidden');
        } else {
            this.sidebarTarget.classList.remove('-translate-x-full');
            this.overlayTarget.classList.add('hidden');
            this._apply();
        }
    }

    _isMobile() {
        return window.innerWidth < 1024;
    }
}
