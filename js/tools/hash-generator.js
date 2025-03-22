class HashGenerator extends ToolTemplate {
    constructor() {
        super('hash-generator', 'Hash Generator');
        
        // Initialize properties
        this.algorithm = null;
        this.inputText = null;
        this.outputText = null;
        this.fileInput = null;
        this.generateBtn = null;
        this.copyBtn = null;
        this.clearBtn = null;
        this.fileHashBtn = null;
        
        this.setupToolElements();
    }

    setupToolElements() {
        // Get form elements
        this.algorithm = document.getElementById('algorithm');
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.fileInput = document.getElementById('fileInput');
        
        // Get buttons
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.fileHashBtn = document.getElementById('fileHashBtn');
        
        // Add event listeners
        this.generateBtn.addEventListener('click', () => this.generateHash());
        this.copyBtn.addEventListener('click', () => this.copyHash());
        this.clearBtn.addEventListener('click', () => this.clearFields());
        this.fileHashBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Add input event listener for real-time hashing
        this.inputText.addEventListener('input', () => this.generateHash());
        this.algorithm.addEventListener('change', () => this.generateHash());
    }



    
    generateHash() {
        const text = this.inputText.value;
        if (!text) {
            this.outputText.value = '';
            return;
        }

        try {
            let hash;
            switch (this.algorithm.value) {
                case 'MD5':
                    hash = CryptoJS.MD5(text);
                    break;
                case 'SHA1':
                    hash = CryptoJS.SHA1(text);
                    break;
                case 'SHA256':
                    hash = CryptoJS.SHA256(text);
                    break;
                case 'SHA512':
                    hash = CryptoJS.SHA512(text);
                    break;
                case 'SHA3':
                    hash = CryptoJS.SHA3(text);
                    break;
                case 'RIPEMD160':
                    hash = CryptoJS.RIPEMD160(text);
                    break;
                default:
                    throw new Error('Invalid algorithm selected');
            }

            this.outputText.value = hash.toString();
        } catch (error) {
            this.showNotification('Error generating hash', 'error');
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            let hash;

            try {
                switch (this.algorithm.value) {
                    case 'MD5':
                        hash = CryptoJS.MD5(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    case 'SHA1':
                        hash = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    case 'SHA256':
                        hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    case 'SHA512':
                        hash = CryptoJS.SHA512(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    case 'SHA3':
                        hash = CryptoJS.SHA3(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    case 'RIPEMD160':
                        hash = CryptoJS.RIPEMD160(CryptoJS.lib.WordArray.create(fileContent));
                        break;
                    default:
                        throw new Error('Invalid algorithm selected');
                }

                this.outputText.value = hash.toString();
                this.showNotification('File hash generated successfully', 'success');
            } catch (error) {
                this.showNotification('Error generating file hash', 'error');
            }
        };

        reader.onerror = () => {
            this.showNotification('Error reading file', 'error');
        };

        reader.readAsArrayBuffer(file);
        this.fileInput.value = ''; // Reset file input
    }

    copyHash() {
        if (!this.outputText.value) {
            this.showNotification('No hash to copy', 'error');
            return;
        }

        navigator.clipboard.writeText(this.outputText.value)
            .then(() => this.showNotification('Hash copied to clipboard', 'success'))
            .catch(() => this.showNotification('Failed to copy hash', 'error'));
    }

    clearFields() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.showNotification('Fields cleared', 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HashGenerator();
}); 