import ToolTemplate from '../tool-template.js';

class Base64Converter extends ToolTemplate {
    constructor() {
        super('base64-converter', 'Base64 Converter');
        
        // Force light theme
        document.documentElement.setAttribute('data-bs-theme', 'light');
        localStorage.setItem('theme', 'light');
        
        // Initialize elements
        this.textInput = document.getElementById('text-input');
        this.fileInput = document.getElementById('file-input');
        this.textOutput = document.getElementById('text-output');
        this.validationResult = document.getElementById('validation-result');
        
        // Initialize event listeners immediately
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Text input handler
        this.textInput.addEventListener('input', () => this.convertBase64());
        
        // File input handler
        this.fileInput.addEventListener('change', (e) => this.handleFileInput(e));
        
        // Operation change handler
        document.querySelectorAll('input[name="operation"]').forEach(input => {
            input.addEventListener('change', () => this.convertBase64());
        });

        // Button handlers
        document.getElementById('convert-button').addEventListener('click', (e) => {
            e.preventDefault();
            this.convertBase64();
        });
        
        document.getElementById('copy-button').addEventListener('click', () => this.handleCopy());
        document.getElementById('download-button').addEventListener('click', () => this.handleDownload());
    }

    handleFileInput(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            const bytes = new Uint8Array(arrayBuffer);
            this.textInput.value = this.arrayToBase64(bytes);
            this.convertBase64();
        };
        reader.onerror = (error) => {
            this.showValidation('Error reading file', 'danger');
        };
        reader.readAsArrayBuffer(file);
    }

    arrayToBase64(bytes) {
        let binary = '';
        bytes.forEach(b => binary += String.fromCharCode(b));
        return btoa(binary);
    }

    base64ToArray(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    convertBase64() {
        try {
            const input = this.textInput.value.trim();
            const operation = document.querySelector('input[name="operation"]:checked').value;

            if (!input) {
                this.textOutput.value = '';
                this.validationResult.classList.add('d-none');
                return;
            }

            if (operation === 'encode') {
                // Convert text to UTF-8 bytes
                const encoder = new TextEncoder();
                const encoded = encoder.encode(input);
                this.textOutput.value = this.arrayToBase64(encoded);
                this.showValidation('Encoded successfully!', 'success');
            } else {
                try {
                    const decodedBytes = this.base64ToArray(input);
                    const decoder = new TextDecoder();
                    this.textOutput.value = decoder.decode(decodedBytes);
                    this.showValidation('Decoded successfully!', 'success');
                } catch (error) {
                    this.showValidation('Invalid Base64 input', 'danger');
                }
            }
        } catch (error) {
            this.showValidation(`Error: ${error.message}`, 'danger');
        }
    }

    showValidation(message, type) {
        this.validationResult.textContent = message;
        this.validationResult.className = `alert alert-${type}`;
        this.validationResult.classList.remove('d-none');
    }

    handleCopy() {
        if (this.textOutput.value) {
            navigator.clipboard.writeText(this.textOutput.value)
                .then(() => this.showValidation('Copied to clipboard!', 'success'))
                .catch(() => this.showValidation('Failed to copy', 'danger'));
        } else {
            this.showValidation('No content to copy', 'warning');
        }
    }

    handleDownload() {
        if (!this.textOutput.value) {
            this.showValidation('No content to download', 'warning');
            return;
        }

        const blob = new Blob([this.textOutput.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `base64-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize the converter
document.addEventListener('DOMContentLoaded', () => {
    new Base64Converter();
});