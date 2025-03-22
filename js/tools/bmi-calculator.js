class BMICalculator {
    constructor() {
        this.form = null;
        this.weightInput = null;
        this.heightInput = null;
        this.unitSystem = null;
        this.resultCard = null;
        this.bmiValue = null;
        this.bmiCategory = null;
        this.bmiDescription = null;
        this.weightUnit = null;
        this.heightUnit = null;
        this.setupToolElements();
    }

    setupToolElements() {
        // Get DOM elements
        this.form = document.getElementById('bmiForm');
        this.weightInput = document.getElementById('weight');
        this.heightInput = document.getElementById('height');
        this.resultCard = document.getElementById('resultCard');
        this.bmiValue = document.getElementById('bmiValue');
        this.bmiCategory = document.getElementById('bmiCategory');
        this.bmiDescription = document.getElementById('bmiDescription');
        this.weightUnit = document.querySelector('.unit-weight');
        this.heightUnit = document.querySelector('.unit-height');

        // Add event listeners
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateBMI();
        });

        // Add unit system change listeners
        document.querySelectorAll('input[name="unitSystem"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateUnits(radio.value);
                this.convertValues(radio.value);
            });
        });

        // Add input validation
        this.weightInput.addEventListener('input', () => this.validateInput(this.weightInput));
        this.heightInput.addEventListener('input', () => this.validateInput(this.heightInput));
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        if (value <= 0) {
            input.value = '';
            this.showNotification('Please enter a positive number', 'error');
        }
    }

    updateUnits(system) {
        if (system === 'metric') {
            this.weightUnit.textContent = 'kg';
            this.heightUnit.textContent = 'cm';
        } else {
            this.weightUnit.textContent = 'lb';
            this.heightUnit.textContent = 'in';
        }
    }

    convertValues(newSystem) {
        const weight = parseFloat(this.weightInput.value);
        const height = parseFloat(this.heightInput.value);

        if (!isNaN(weight)) {
            this.weightInput.value = newSystem === 'metric' 
                ? (weight * 0.453592).toFixed(1)  // lb to kg
                : (weight * 2.20462).toFixed(1);  // kg to lb
        }

        if (!isNaN(height)) {
            this.heightInput.value = newSystem === 'metric'
                ? (height * 2.54).toFixed(1)      // in to cm
                : (height / 2.54).toFixed(1);     // cm to in
        }
    }

    calculateBMI() {
        try {
            let weight = parseFloat(this.weightInput.value);
            let height = parseFloat(this.heightInput.value);
            const system = document.querySelector('input[name="unitSystem"]:checked').value;

            if (isNaN(weight) || isNaN(height)) {
                throw new Error('Please enter valid numbers for weight and height');
            }

            if (weight <= 0 || height <= 0) {
                throw new Error('Weight and height must be positive numbers');
            }

            let bmi;
            if (system === 'metric') {
                // Convert cm to m for height
                height = height / 100;
                bmi = weight / (height * height);
            } else {
                // Imperial formula: (weight in pounds * 703) / (height in inches * height in inches)
                bmi = (weight * 703) / (height * height);
            }

            this.displayResult(bmi);
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    displayResult(bmi) {
        // Round BMI to 1 decimal place
        const roundedBMI = Math.round(bmi * 10) / 10;

        // Update BMI value
        this.bmiValue.textContent = roundedBMI;

        // Determine BMI category and description
        let category, description;
        if (bmi < 18.5) {
            category = 'Underweight';
            description = 'You are in the underweight range. Consider consulting with a healthcare provider about achieving a healthy weight.';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            description = 'You are in a healthy weight range. Maintain a balanced diet and regular physical activity.';
        } else if (bmi < 30) {
            category = 'Overweight';
            description = 'You are in the overweight range. Consider healthy lifestyle changes and consult with a healthcare provider.';
        } else {
            category = 'Obese';
            description = 'You are in the obese range. It is recommended to consult with a healthcare provider about healthy weight management strategies.';
        }

        // Update the display
        this.bmiCategory.textContent = category;
        this.bmiDescription.textContent = description;
        this.resultCard.classList.remove('d-none');

        // Update BMI chart highlighting
        document.querySelectorAll('.bmi-category').forEach(el => {
            el.classList.remove('active-category');
        });
        const categoryElement = document.querySelector(`.bmi-category.${category.toLowerCase().replace(' ', '-')}`);
        if (categoryElement) {
            categoryElement.classList.add('active-category');
        }

        // Show success notification
        this.showNotification('BMI calculated successfully!');
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
    new BMICalculator();
});