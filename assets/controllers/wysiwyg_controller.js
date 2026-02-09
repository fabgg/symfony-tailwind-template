import { Controller } from '@hotwired/stimulus';
import 'trix/dist/trix.min.css';
import 'trix';

export default class extends Controller {
    static targets = ['editor', 'input'];

    connect() {
        // Hide file upload toolbar button
        this.element.addEventListener('trix-file-accept', (e) => {
            e.preventDefault();
        });

        // Sync content to hidden input
        this.element.addEventListener('trix-change', () => {
            if (this.hasInputTarget && this.hasEditorTarget) {
                this.inputTarget.value = this.editorTarget.innerHTML;
            }
        });
    }
}
