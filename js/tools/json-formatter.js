import ToolTemplate from '../tool-template.js';

class JsonFormatter extends ToolTemplate {
    constructor() {
        super('json-formatter', 'JSON Formatter');
    }

    setupToolElements() {
        const inputContainer = document.getElementById('input-container');
        inputContainer.innerHTML = `
            <div class="mb-3">
                <label for="text-input" class="form-label">Enter JSON</label>
                <textarea class="form-control" id="text-input" rows="5" placeholder="Paste your JSON here..."></textarea>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="format-type" id="pretty" value="pretty" checked>
                        <label class="form-check-label" for="pretty">Pretty Print</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="format-type" id="minify" value="minify">
                        <label class="form-check-label" for="minify">Minify</label>
                    </div>
                </div>
            </div>
        `;

        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = `
            <div class="mb-3">
                <label for="text-output" class="form-label">Formatted JSON</label>
                <textarea class="form-control" id="text-output" rows="5" readonly></textarea>
            </div>
            <div id="validation-result" class="alert d-none"></div>
        `;

        this.formatInputs = document.querySelectorAll('input[name="format-type"]');
        this.validationResult = document.getElementById('validation-result');
    }

    handleTextInput() {
        this.formatJson();
    }

    handleConvert() {
        this.formatJson();
    }

    formatJson() {
        try {
            const input = this.textInput.value.trim();
            if (!input) {
                this.textOutput.value = '';
                this.validationResult.classList.add('d-none');
                return;
            }

            // Try to parse the JSON to validate it
            const json = JSON.parse(input);
            const formatType = document.querySelector('input[name="format-type"]:checked')?.value || 'pretty';
            
            if (formatType === 'pretty') {
                this.textOutput.value = JSON.stringify(json, null, 2);
            } else {
                this.textOutput.value = JSON.stringify(json);
            }

            this.validationResult.className = 'alert alert-success';
            this.validationResult.textContent = 'Valid JSON!';
            this.validationResult.classList.remove('d-none');
        } catch (error) {
            this.textOutput.value = '';
            this.validationResult.className = 'alert alert-danger';
            this.validationResult.textContent = `Invalid JSON: ${error.message}`;
            this.validationResult.classList.remove('d-none');
        }
    }

    addEventListeners() {
        super.addEventListeners();
        
        // Add format type change listener
        this.formatInputs.forEach(input => {
            input.addEventListener('change', () => this.formatJson());
        });

        // Add paste event listener
        this.textInput.addEventListener('paste', () => {
            setTimeout(() => this.formatJson(), 0);
        });

        // Add drop event listener
        this.textInput.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.textInput.value = event.target.result;
                    this.formatJson();
                };
                reader.readAsText(file);
            }
        });
    }
}

// Initialize the tool
document.addEventListener('DOMContentLoaded', () => {
    new JsonFormatter();
}); 