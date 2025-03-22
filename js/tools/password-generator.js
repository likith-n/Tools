import ToolTemplate from '../tool-template.js';

class PasswordGenerator extends ToolTemplate {
    constructor() {
        super('password-generator', 'Password Generator');
        
        // Initialize DOM elements
        this.lengthInput = document.getElementById('password-length');
        this.lengthValue = document.getElementById('length-value');
        this.textOutput = document.getElementById('text-output');
        this.strengthBar = document.getElementById('strength-bar');
        this.strengthText = document.getElementById('strength-text');
        
        // Set initial values
        this.lengthValue.textContent = this.lengthInput.value;
        
        // Initialize event listeners
        this.initializeEventListeners();
        this.generatePassword(); // Generate initial password
    }

    initializeEventListeners() {
        // Password length slider
        this.lengthInput.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthInput.value;
            this.generatePassword();
        });

        // Character type checkboxes
        ['uppercase', 'lowercase', 'numbers', 'symbols'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.generatePassword());
        });

        // Generate button
        document.getElementById('convert-button').addEventListener('click', () => this.generatePassword());
        
        // Copy button
        document.getElementById('copy-button').addEventListener('click', () => {
            if (this.textOutput.value) {
                this.copyToClipboard(this.textOutput.value);
            }
        });

        // Refresh button
        document.getElementById('refresh-button').addEventListener('click', () => this.generatePassword());
    }

    generatePassword() {
        try {
            const options = {
                uppercase: document.getElementById('uppercase').checked,
                lowercase: document.getElementById('lowercase').checked,
                numbers: document.getElementById('numbers').checked,
                symbols: document.getElementById('symbols').checked
            };

            // Validate at least one option selected
            if (!Object.values(options).some(v => v)) {
                this.showError('Please select at least one character type!');
                return;
            }

            const length = parseInt(this.lengthInput.value);
            const charset = this.getCharset(options);
            
            // Generate password
            let password = this.createPassword(length, charset);
            password = this.enforceCharacterRequirements(password, options);
            
            // Update UI
            this.textOutput.value = password;
            this.updateStrengthIndicator(password);
        } catch (error) {
            console.error('Password generation error:', error);
            this.showError('Failed to generate password');
        }
    }

    getCharset(options) {
        let charset = '';
        if (options.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (options.numbers) charset += '0123456789';
        if (options.symbols) charset += '!@#$%^&*';
        return charset;
    }

    createPassword(length, charset) {
        return Array.from({ length }, () => 
            charset[Math.floor(Math.random() * charset.length)]
        ).join('');
    }

    enforceCharacterRequirements(password, options) {
        const requirements = {
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            numbers: /[0-9]/,
            symbols: /[!@#$%^&*]/
        };

        Object.entries(options).forEach(([type, enabled]) => {
            if (enabled && !requirements[type].test(password)) {
                password = this.replaceRandomCharacter(password, type);
            }
        });

        return password;
    }

    replaceRandomCharacter(password, type) {
        const replacements = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*'
        };
        
        const index = Math.floor(Math.random() * password.length);
        return password.substring(0, index) + 
               replacements[type][Math.floor(Math.random() * replacements[type].length)] + 
               password.substring(index + 1);
    }

    updateStrengthIndicator(password) {
        let score = 0;
        // Length score (max 50 points)
        score += Math.min(password.length * 3, 50);
        
        // Complexity score (max 50 points)
        const typesUsed = [
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /[0-9]/.test(password),
            /[!@#$%^&*]/.test(password)
        ].filter(Boolean).length;

        score += typesUsed * 12.5;

        // Update progress bar
        const levels = [
            { min: 0, class: 'bg-danger', text: 'Very Weak' },
            { min: 35, class: 'bg-warning', text: 'Weak' },
            { min: 65, class: 'bg-info', text: 'Good' },
            { min: 85, class: 'bg-success', text: 'Strong' }
        ];

        const level = levels.reverse().find(l => score >= l.min);
        this.strengthBar.style.width = `${Math.min(score, 100)}%`;
        this.strengthBar.className = `progress-bar ${level.class}`;
        this.strengthText.textContent = `Password Strength: ${level.text}`;
    }

    showError(message) {
        this.textOutput.value = '';
        this.strengthBar.style.width = '0%';
        this.strengthText.textContent = message;
        this.strengthBar.className = 'progress-bar bg-danger';
    }
}

// Initialize the tool
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});