// Tool Template Class
class ToolTemplate {
    constructor(containerId, pageTitle) {
        this.containerId = containerId;
        this.pageTitle = pageTitle;
        this.themeToggleBtn = document.querySelector('.theme-toggle');
        this.themeIcon = this.themeToggleBtn ? this.themeToggleBtn.querySelector('i') : null;
        
        this.initializeTheme();
        this.setupEventListeners();
    }

    initializeTheme() {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            this.updateThemeIcon(theme);
        }
    }

    setupEventListeners() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                const theme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                this.updateThemeIcon(theme);
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update the icon with animation
        this.themeToggleBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.updateThemeIcon(newTheme);
            this.themeToggleBtn.style.transform = 'rotate(0deg)';
        }, 200);
    }

    updateThemeIcon(theme) {
        if (this.themeIcon) {
            // Remove existing classes
            this.themeIcon.classList.remove('fa-sun', 'fa-moon');
            // Add appropriate icon
            this.themeIcon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
        }
    }

    setupToolElements() {
        // This method should be overridden by child classes
        console.warn('setupToolElements() not implemented');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Copied to clipboard!');
        }).catch(err => {
            this.showNotification('Failed to copy to clipboard', 'danger');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create instance for each page
    new ToolTemplate('main', document.title);
});

// Export the template
export default ToolTemplate; 