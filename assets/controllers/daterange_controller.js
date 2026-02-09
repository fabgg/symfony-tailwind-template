import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['start', 'end'];

    connect() {
        // The actual flatpickr instances are managed by child datepicker controllers.
        // We observe changes to sync min/max.
        this.element.addEventListener('change', this._sync.bind(this));
    }

    _sync(e) {
        const target = e.target;
        if (!target || !target._flatpickr) return;

        const startInput = this.element.querySelector('[data-datepicker-target="input"]');
        const inputs = this.element.querySelectorAll('[data-datepicker-target="input"]');
        if (inputs.length < 2) return;

        const startFp = inputs[0]._flatpickr;
        const endFp = inputs[1]._flatpickr;

        if (target === inputs[0] && endFp) {
            endFp.set('minDate', target.value);
        }
        if (target === inputs[1] && startFp) {
            startFp.set('maxDate', target.value);
        }
    }
}
