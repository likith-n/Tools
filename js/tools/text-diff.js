class TextDiff extends ToolTemplate {
    constructor() {
        super('text-diff', 'Text Diff');
        this.originalText = null;
        this.modifiedText = null;
        this.compareBtn = null;
        this.clearBtn = null;
        this.diffOutput = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.originalText = document.getElementById('originalText');
        this.modifiedText = document.getElementById('modifiedText');
        this.compareBtn = document.getElementById('compareBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.diffOutput = document.getElementById('diffOutput');

        // Add event listeners
        this.compareBtn.addEventListener('click', this.compareDiff.bind(this));
        this.clearBtn.addEventListener('click', this.clearTexts.bind(this));

        // Enable paste from clipboard
        [this.originalText, this.modifiedText].forEach(textarea => {
            textarea.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text');
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
            });
        });
    }

    compareDiff() {
        const original = this.originalText.value.trim();
        const modified = this.modifiedText.value.trim();

        if (!original || !modified) {
            this.showNotification('Please enter both original and modified texts', 'error');
            return;
        }

        try {
            // Create diff patch
            const diff = Diff.createPatch('text', original, modified, '', '');
            
            // Convert to HTML with diff2html
            const diffHtml = Diff2Html.html(diff, {
                drawFileList: false,
                matching: 'lines',
                outputFormat: 'side-by-side'
            });

            // Display the diff
            this.diffOutput.innerHTML = diffHtml;
            
            // Scroll to diff output
            this.diffOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            this.showNotification('Comparison completed successfully!');
        } catch (error) {
            this.showNotification('Error comparing texts: ' + error.message, 'error');
        }
    }

    clearTexts() {
        this.originalText.value = '';
        this.modifiedText.value = '';
        this.diffOutput.innerHTML = '<p class="text-muted text-center">Differences will appear here after comparison</p>';
        this.showNotification('Texts cleared successfully');
    }

    showNotification(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 end-0 m-3`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }
}

// Initialize the tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextDiff();
}); 