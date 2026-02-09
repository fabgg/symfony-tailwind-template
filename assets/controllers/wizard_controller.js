import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['step', 'panel', 'prevButton', 'nextButton', 'indicator', 'label', 'connector', 'progressBar', 'progressText'];
    static values = {
        currentStep: { type: Number, default: 1 },
        totalSteps: Number,
        linear: { type: Boolean, default: true },
        variant: { type: String, default: 'steps' },
    };

    connect() {
        this._buildLayout();
        this.totalStepsValue = this.panelTargets.length;
        this._apply();
    }

    next() {
        const currentPanel = this.panelTargets.find(p => parseInt(p.dataset.step) === this.currentStepValue);
        if (currentPanel && this.linearValue) {
            const inputs = currentPanel.querySelectorAll('input, select, textarea');
            for (const input of inputs) {
                if (!input.reportValidity()) return;
            }
        }
        if (this.currentStepValue < this.totalStepsValue) {
            this.currentStepValue++;
            this._apply();
        }
    }

    prev() {
        if (this.currentStepValue > 1) {
            this.currentStepValue--;
            this._apply();
        }
    }

    goTo(e) {
        const step = parseInt(e.currentTarget.dataset.step);
        if (!this.linearValue || step <= this.currentStepValue) {
            this.currentStepValue = step;
            this._apply();
        }
    }

    _buildLayout() {
        if (this.variantValue === 'progress') {
            this._buildProgressLayout();
        } else {
            this._buildStepsLayout();
        }
    }

    _buildStepsLayout() {
        const steps = this.stepTargets;
        if (steps.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'flex items-center justify-center mb-8';
        this.element.insertBefore(wrapper, this.element.firstChild);
        steps.forEach(step => wrapper.appendChild(step));
    }

    _buildProgressLayout() {
        const steps = this.stepTargets;
        steps.forEach(step => step.classList.add('hidden'));

        const totalPanels = this.element.querySelectorAll('[data-wizard-target="panel"]').length;

        // Collect labels from Step components
        const labels = [];
        for (let i = 1; i <= totalPanels; i++) {
            const stepEl = steps.find ? steps.find(s => parseInt(s.dataset.step) === i) : null;
            const label = stepEl ? stepEl.querySelector('[data-wizard-target="label"]')?.textContent || `Step ${i}` : `Step ${i}`;
            labels.push(label);
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'wizard-progress mb-8';

        // Header: step counter + percentage
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-6';
        header.innerHTML = `
            <span class="text-sm font-medium text-text-primary" data-wizard-target="progressText"></span>
            <span class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700" data-wizard-target="progressPercent"></span>
        `;
        wrapper.appendChild(header);

        // Track with dots
        const track = document.createElement('div');
        track.className = 'relative flex items-center justify-between';

        // Background track line
        const bgLine = document.createElement('div');
        bgLine.className = 'absolute top-5 left-0 right-0 h-0.5 bg-border';
        track.appendChild(bgLine);

        // Filled track line
        const filledLine = document.createElement('div');
        filledLine.className = 'absolute top-5 left-0 h-0.5 bg-primary-600 transition-all duration-500 ease-out';
        filledLine.setAttribute('data-wizard-target', 'progressBar');
        filledLine.style.width = '0%';
        track.appendChild(filledLine);

        // Step dots
        for (let i = 0; i < totalPanels; i++) {
            const stepNum = i + 1;
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.dataset.step = stepNum;
            dot.dataset.action = 'wizard#goTo';
            dot.className = 'wizard-progress-step relative z-10 flex flex-col items-center gap-2 group';
            dot.innerHTML = `
                <div class="wizard-progress-ring w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-border bg-surface text-text-muted transition-all duration-300" data-wizard-target="progressDot">
                    ${stepNum}
                </div>
                <span class="text-xs font-medium text-text-muted transition-colors duration-300 hidden sm:inline" data-wizard-target="progressLabel">${labels[i]}</span>
            `;
            track.appendChild(dot);
        }

        wrapper.appendChild(track);
        this.element.insertBefore(wrapper, this.element.firstChild);
    }

    _apply() {
        this.panelTargets.forEach(panel => {
            panel.classList.toggle('hidden', parseInt(panel.dataset.step) !== this.currentStepValue);
        });

        if (this.variantValue === 'progress') {
            this._applyProgress();
        } else {
            this._applySteps();
        }

        this.prevButtonTargets.forEach(btn => {
            btn.classList.toggle('invisible', this.currentStepValue === 1);
        });

        this.nextButtonTargets.forEach(btn => {
            if (this.currentStepValue === this.totalStepsValue) {
                btn.textContent = 'Submit';
                btn.setAttribute('type', 'submit');
            } else {
                btn.textContent = 'Next';
                btn.setAttribute('type', 'button');
            }
        });
    }

    _applySteps() {
        this.indicatorTargets.forEach(indicator => {
            const step = parseInt(indicator.closest('[data-step]').dataset.step);
            indicator.classList.remove('border-primary-600', 'bg-primary-600', 'text-white', 'border-success-500', 'bg-success-500');
            if (step < this.currentStepValue) {
                indicator.classList.add('border-success-500', 'bg-success-500', 'text-white');
                indicator.innerHTML = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>';
            } else if (step === this.currentStepValue) {
                indicator.classList.add('border-primary-600', 'bg-primary-600', 'text-white');
                indicator.textContent = step;
            } else {
                indicator.textContent = step;
            }
        });

        this.connectorTargets.forEach(connector => {
            const stepEl = connector.closest('[data-step]');
            const step = parseInt(stepEl.dataset.step);
            connector.classList.toggle('bg-success-500', step <= this.currentStepValue);
            connector.classList.toggle('bg-border', step > this.currentStepValue);
        });
    }

    _applyProgress() {
        const percent = Math.round(((this.currentStepValue - 1) / (this.totalStepsValue - 1)) * 100);

        // Progress bar width
        if (this.hasProgressBarTarget) {
            this.progressBarTarget.style.width = `${percent}%`;
        }

        // Header text
        if (this.hasProgressTextTarget) {
            this.progressTextTarget.textContent = `Step ${this.currentStepValue} of ${this.totalStepsValue}`;
        }

        // Percentage badge
        const percentEl = this.element.querySelector('[data-wizard-target="progressPercent"]');
        if (percentEl) {
            percentEl.textContent = `${percent}%`;
        }

        // Step dots
        const dots = this.element.querySelectorAll('[data-wizard-target="progressDot"]');
        const labels = this.element.querySelectorAll('[data-wizard-target="progressLabel"]');
        const checkSvg = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>';

        dots.forEach((dot, index) => {
            const step = index + 1;
            const label = labels[index];

            // Reset
            dot.className = 'wizard-progress-ring w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300';

            if (step < this.currentStepValue) {
                // Completed
                dot.className += ' border-success-500 bg-success-500 text-white shadow-sm';
                dot.innerHTML = checkSvg;
                if (label) { label.className = 'text-xs font-medium text-success-600 transition-colors duration-300 hidden sm:inline'; }
            } else if (step === this.currentStepValue) {
                // Active
                dot.className += ' border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-600/30 ring-4 ring-primary-100';
                dot.textContent = step;
                if (label) { label.className = 'text-xs font-semibold text-primary-600 transition-colors duration-300 hidden sm:inline'; }
            } else {
                // Future
                dot.className += ' border-border bg-surface text-text-muted';
                dot.textContent = step;
                if (label) { label.className = 'text-xs font-medium text-text-muted transition-colors duration-300 hidden sm:inline'; }
            }
        });
    }
}
