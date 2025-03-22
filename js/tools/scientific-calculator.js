class ScientificCalculator extends ToolTemplate {
    constructor() {
        super('scientific-calculator', 'Scientific Calculator');
        this.display = null;
        this.history = null;
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.lastResult = null;
        this.isInRadians = true;
    }

    setupToolElements() {
        this.display = document.getElementById('calcDisplay');
        this.history = document.getElementById('calcHistory');

        // Add event listeners for number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.dataset.number));
        });

        // Add event listeners for operator buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => this.handleAction(button.dataset.action));
        });

        // Add keyboard support
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentValue = '';
            this.shouldResetDisplay = false;
        }
        if (this.currentValue === '0' && number !== '.') {
            this.currentValue = '';
        }
        if (number === '.' && this.currentValue.includes('.')) return;
        this.currentValue += number;
        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.handleOperator(action);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'clear':
                this.clear();
                break;
            case 'clearEntry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'decimal':
                this.appendNumber('.');
                break;
            case 'toggleSign':
                this.toggleSign();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                this.handleTrigonometry(action);
                break;
            case 'sqrt':
                this.handleSquareRoot();
                break;
            case 'pow2':
                this.handlePower(2);
                break;
            case 'pow':
                this.handleOperator('pow');
                break;
            case 'log':
                this.handleLogarithm(10);
                break;
            case 'ln':
                this.handleLogarithm(Math.E);
                break;
            case 'exp':
                this.appendNumber(Math.E.toString());
                break;
            case 'pi':
                this.appendNumber(Math.PI.toString());
                break;
            case 'fact':
                this.handleFactorial();
                break;
            case 'inv':
                this.handleInverse();
                break;
        }
    }

    handleOperator(operator) {
        if (this.operation !== null) {
            this.calculate();
        }
        this.previousValue = this.currentValue;
        this.operation = operator;
        this.shouldResetDisplay = true;
        this.updateHistory();
    }

    calculate() {
        if (!this.operation || !this.previousValue) return;

        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        try {
            switch (this.operation) {
                case 'add':
                    result = prev + current;
                    break;
                case 'subtract':
                    result = prev - current;
                    break;
                case 'multiply':
                    result = prev * current;
                    break;
                case 'divide':
                    if (current === 0) throw new Error('Cannot divide by zero');
                    result = prev / current;
                    break;
                case 'pow':
                    result = Math.pow(prev, current);
                    break;
            }

            this.lastResult = result;
            this.currentValue = this.formatResult(result);
            this.updateHistory(`${this.previousValue} ${this.getOperatorSymbol(this.operation)} ${this.currentValue} =`);
            this.operation = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.clear();
        }
    }

    handleTrigonometry(func) {
        const value = parseFloat(this.currentValue);
        let result;

        try {
            const radians = this.isInRadians ? value : (value * Math.PI / 180);
            switch (func) {
                case 'sin':
                    result = Math.sin(radians);
                    break;
                case 'cos':
                    result = Math.cos(radians);
                    break;
                case 'tan':
                    result = Math.tan(radians);
                    break;
            }

            this.updateHistory(`${func}(${this.currentValue}) =`);
            this.currentValue = this.formatResult(result);
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } catch (error) {
            this.showNotification('Invalid input for ' + func, 'error');
        }
    }

    handleSquareRoot() {
        const value = parseFloat(this.currentValue);
        if (value < 0) {
            this.showNotification('Cannot calculate square root of negative number', 'error');
            return;
        }
        this.updateHistory(`√(${this.currentValue}) =`);
        this.currentValue = this.formatResult(Math.sqrt(value));
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handlePower(power) {
        const value = parseFloat(this.currentValue);
        this.updateHistory(`${this.currentValue}^${power} =`);
        this.currentValue = this.formatResult(Math.pow(value, power));
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleLogarithm(base) {
        const value = parseFloat(this.currentValue);
        if (value <= 0) {
            this.showNotification('Invalid input for logarithm', 'error');
            return;
        }
        const result = base === Math.E ? Math.log(value) : Math.log10(value);
        this.updateHistory(`log${base === Math.E ? 'e' : '10'}(${this.currentValue}) =`);
        this.currentValue = this.formatResult(result);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleFactorial() {
        const value = parseInt(this.currentValue);
        if (value < 0 || !Number.isInteger(value)) {
            this.showNotification('Invalid input for factorial', 'error');
            return;
        }
        try {
            let result = 1;
            for (let i = 2; i <= value; i++) result *= i;
            this.updateHistory(`${this.currentValue}! =`);
            this.currentValue = this.formatResult(result);
            this.shouldResetDisplay = true;
            this.updateDisplay();
        } catch (error) {
            this.showNotification('Number too large', 'error');
        }
    }

    handleInverse() {
        const value = parseFloat(this.currentValue);
        if (value === 0) {
            this.showNotification('Cannot divide by zero', 'error');
            return;
        }
        this.updateHistory(`1/(${this.currentValue}) =`);
        this.currentValue = this.formatResult(1 / value);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    toggleSign() {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.lastResult = null;
        this.updateDisplay();
        this.updateHistory('');
    }

    clearEntry() {
        this.currentValue = '0';
        this.updateDisplay();
    }

    backspace() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.slice(0, -1) || '0';
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.textContent = this.currentValue;
    }

    updateHistory(text) {
        this.history.textContent = text || '';
    }

    formatResult(number) {
        if (Math.abs(number) < 1e-10) return '0';
        const formatted = number.toPrecision(10).replace(/\.?0+$/, '');
        return formatted.length > 15 ? number.toExponential(9) : formatted;
    }

    getOperatorSymbol(operator) {
        const symbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷',
            pow: '^'
        };
        return symbols[operator] || operator;
    }

    handleKeyboard(event) {
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if (!/^F\d+$/.test(key)) {
            event.preventDefault();
        }

        // Numbers
        if (/^[0-9]$/.test(key)) {
            this.appendNumber(key);
        }
        // Operators
        else if (['+', '-', '*', '/', '^'].includes(key)) {
            const actions = {
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide',
                '^': 'pow'
            };
            this.handleAction(actions[key]);
        }
        // Other controls
        else {
            const actions = {
                'Enter': 'equals',
                '=': 'equals',
                'Backspace': 'backspace',
                'Delete': 'clear',
                '.': 'decimal',
                'Escape': 'clear'
            };
            if (actions[key]) {
                this.handleAction(actions[key]);
            }
        }
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

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
}); 