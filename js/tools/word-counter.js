import ToolTemplate from '../tool-template.js';

class WordCounter extends ToolTemplate {
    constructor() {
        super('word-counter', 'Word Counter');
    }

    setupToolElements() {
        // Add word counter specific elements
        const inputContainer = document.getElementById('input-container');
        inputContainer.innerHTML = `
            <div class="mb-3">
                <label for="text-input" class="form-label">Enter Text</label>
                <textarea class="form-control" id="text-input" rows="5" placeholder="Enter your text here..."></textarea>
            </div>
        `;

        const outputContainer = document.getElementById('output-container');
        outputContainer.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Statistics</h5>
                    <div class="row">
                        <div class="col-md-4">
                            <div class="text-center">
                                <h6>Words</h6>
                                <p id="word-count" class="h3 mb-0">0</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <h6>Characters</h6>
                                <p id="char-count" class="h3 mb-0">0</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="text-center">
                                <h6>Lines</h6>
                                <p id="line-count" class="h3 mb-0">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Get the new elements
        this.wordCount = document.getElementById('word-count');
        this.charCount = document.getElementById('char-count');
        this.lineCount = document.getElementById('line-count');
    }

    handleTextInput() {
        this.updateCounts();
    }

    handleConvert() {
        this.updateCounts();
    }

    updateCounts() {
        const text = this.textInput.value;
        
        // Count words (excluding empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount.textContent = words.length;

        // Count characters (including spaces)
        this.charCount.textContent = text.length;

        // Count lines (excluding empty lines)
        const lines = text.split('\n').filter(line => line.trim().length > 0);
        this.lineCount.textContent = lines.length;
    }
}

// Initialize the tool
document.addEventListener('DOMContentLoaded', () => {
    new WordCounter();
}); 