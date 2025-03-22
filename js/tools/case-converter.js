import ToolTemplate from '../tool-template.js';

class CaseConverter extends ToolTemplate {
    constructor() {
        super('case-converter', 'Case Converter');
    }

    setupToolElements() {
        // Add case converter specific elements
        const inputContainer = document.getElementById('input-container');
        inputContainer.innerHTML = `
            <div class="mb-3">
                <label for="text-input" class="form-label">Enter Text</label>
                <textarea class="form-control" id="text-input" rows="5" placeholder="Enter your text here..."></textarea>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="uppercase" value="uppercase">
                        <label class="form-check-label" for="uppercase">UPPERCASE</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="lowercase" value="lowercase">
                        <label class="form-check-label" for="lowercase">lowercase</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="titlecase" value="titlecase">
                        <label class="form-check-label" for="titlecase">Title Case</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="sentencecase" value="sentencecase">
                        <label class="form-check-label" for="sentencecase">Sentence case</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="alternating" value="alternating">
                        <label class="form-check-label" for="alternating">aLtErNaTiNg</label>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="case-type" id="inverse" value="inverse">
                        <label class="form-check-label" for="inverse">InVeRsE</label>
                    </div>
                </div>
            </div>
        `;

        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = `
            <div class="mb-3">
                <label for="text-output" class="form-label">Converted Text</label>
                <textarea class="form-control" id="text-output" rows="5" readonly></textarea>
            </div>
        `;

        // Get the new elements
        this.caseInputs = document.querySelectorAll('input[name="case-type"]');
    }

    handleTextInput() {
        this.convertCase();
    }

    handleConvert() {
        this.convertCase();
    }

    convertCase() {
        const text = this.textInput.value;
        const selectedCase = document.querySelector('input[name="case-type"]:checked')?.value || 'uppercase';
        
        let convertedText = '';
        
        switch (selectedCase) {
            case 'uppercase':
                convertedText = text.toUpperCase();
                break;
            case 'lowercase':
                convertedText = text.toLowerCase();
                break;
            case 'titlecase':
                convertedText = text.toLowerCase().replace(/(?:^|\s)\S/g, char => char.toUpperCase());
                break;
            case 'sentencecase':
                convertedText = text.toLowerCase().replace(/(^\w|\.\s+\w)/gm, char => char.toUpperCase());
                break;
            case 'alternating':
                convertedText = text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
                break;
            case 'inverse':
                convertedText = text.split('').map(char => char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()).join('');
                break;
        }

        this.textOutput.value = convertedText;
    }

    addEventListeners() {
        super.addEventListeners();
        
        // Add case type change listener
        this.caseInputs.forEach(input => {
            input.addEventListener('change', () => this.convertCase());
        });
    }
}

// Initialize the tool
document.addEventListener('DOMContentLoaded', () => {
    new CaseConverter();
}); 