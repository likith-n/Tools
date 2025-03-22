class PercentageCalculator extends ToolTemplate {
    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        // Percentage of a number
        document.getElementById('calculateBtn').addEventListener('click', () => {
            const percentage = parseFloat(document.getElementById('percentageValue').value);
            const total = parseFloat(document.getElementById('totalValue').value);
            this.calculatePercentage(percentage, total);
        });

        // Percentage change
        document.getElementById('calculateChangeBtn').addEventListener('click', () => {
            const original = parseFloat(document.getElementById('originalValue').value);
            const newVal = parseFloat(document.getElementById('newValue').value);
            this.calculateChange(original, newVal);
        });

        // Find original number
        document.getElementById('calculateOriginalBtn').addEventListener('click', () => {
            const result = parseFloat(document.getElementById('resultValue').value);
            const percentage = parseFloat(document.getElementById('percentageOfOriginal').value);
            this.calculateOriginal(result, percentage);
        });

        // Common percentage buttons
        document.querySelectorAll('[data-percentage]').forEach(button => {
            button.addEventListener('click', (e) => {
                document.getElementById('percentageValue').value = e.target.dataset.percentage;
            });
        });
    }

    calculatePercentage(percentage, total) {
        if (isNaN(percentage) || isNaN(total)) {
            this.showNotification('Please enter valid numbers in both fields', 'danger');
            return;
        }
        
        const result = (percentage / 100) * total;
        const resultElement = document.getElementById('percentageResult');
        resultElement.classList.remove('d-none');
        resultElement.innerHTML = `Result: <strong>${percentage}% of ${total} = ${result.toFixed(2)}</strong>`;
    }

    calculateChange(original, newVal) {
        if (isNaN(original) || isNaN(newVal)) {
            this.showNotification('Please enter valid numbers in both fields', 'danger');
            return;
        }
        
        const change = ((newVal - original) / Math.abs(original)) * 100;
        const resultElement = document.getElementById('changeResult');
        resultElement.classList.remove('d-none');
        resultElement.innerHTML = `Result: <strong>${change.toFixed(2)}% ${change > 0 ? 'increase' : 'decrease'}</strong>`;
    }

    calculateOriginal(result, percentage) {
        if (isNaN(result) || isNaN(percentage) || percentage === 0) {
            this.showNotification('Please enter valid numbers (percentage cannot be zero)', 'danger');
            return;
        }
        
        const original = (result * 100) / percentage;
        const resultElement = document.getElementById('originalResult');
        resultElement.classList.remove('d-none');
        resultElement.innerHTML = `Result: <strong>${result} is ${percentage}% of ${original.toFixed(2)}</strong>`;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PercentageCalculator();
});