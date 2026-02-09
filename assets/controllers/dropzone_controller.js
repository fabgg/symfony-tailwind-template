import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['input', 'preview', 'placeholder'];
    static values = {
        maxFileSize: { type: Number, default: 5 },
        acceptedTypes: { type: String, default: '' },
        multiple: { type: Boolean, default: false },
    };

    browse() {
        this.inputTarget.click();
    }

    dragover(e) {
        e.preventDefault();
        e.currentTarget.classList.add('border-primary-500', 'bg-primary-50/50');
    }

    dragleave(e) {
        e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50/50');
    }

    drop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('border-primary-500', 'bg-primary-50/50');
        const files = e.dataTransfer.files;
        this._handleFiles(files);
    }

    inputChanged() {
        this._handleFiles(this.inputTarget.files);
    }

    connect() {
        this.inputTarget.addEventListener('change', () => this.inputChanged());
    }

    _handleFiles(files) {
        this.previewTarget.innerHTML = '';
        this.previewTarget.classList.remove('hidden');
        this.placeholderTarget.classList.add('hidden');

        Array.from(files).forEach(file => {
            // Validate size
            if (file.size > this.maxFileSizeValue * 1024 * 1024) {
                this._addError(`${file.name} exceeds the maximum size (${this.maxFileSizeValue} MB)`);
                return;
            }

            const item = document.createElement('div');
            item.className = 'flex items-center gap-3 p-2 bg-surface-alt rounded-lg';

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.className = 'w-10 h-10 object-cover rounded';
                img.src = URL.createObjectURL(file);
                item.appendChild(img);
            } else {
                const icon = document.createElement('div');
                icon.className = 'w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded flex items-center justify-center text-primary-600';
                icon.innerHTML = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>';
                item.appendChild(icon);
            }

            const info = document.createElement('div');
            info.className = 'flex-1 min-w-0';
            info.innerHTML = `<p class="text-sm font-medium text-text-primary truncate">${file.name}</p><p class="text-xs text-text-muted">${this._formatSize(file.size)}</p>`;
            item.appendChild(info);

            this.previewTarget.appendChild(item);
        });
    }

    _addError(message) {
        const el = document.createElement('p');
        el.className = 'text-sm text-danger-600';
        el.textContent = message;
        this.previewTarget.appendChild(el);
    }

    _formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
}
