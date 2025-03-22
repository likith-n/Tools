class SocialPreviewGenerator extends ToolTemplate {
    constructor() {
        super('social-preview-generator', 'Social Preview Generator');
        this.form = null;
        this.platform = null;
        this.title = null;
        this.description = null;
        this.url = null;
        this.image = null;
        this.titleCount = null;
        this.descriptionCount = null;
        this.previewImage = null;
        this.previewTitle = null;
        this.previewDescription = null;
        this.previewUrl = null;
        this.metaTags = null;
        this.copyMetaBtn = null;
        this.imageUrl = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.form = document.getElementById('previewForm');
        this.platform = document.getElementById('platform');
        this.title = document.getElementById('title');
        this.description = document.getElementById('description');
        this.url = document.getElementById('url');
        this.image = document.getElementById('image');
        this.titleCount = document.getElementById('titleCount');
        this.descriptionCount = document.getElementById('descriptionCount');
        this.previewImage = document.getElementById('previewImage');
        this.previewTitle = document.getElementById('previewTitle');
        this.previewDescription = document.getElementById('previewDescription');
        this.previewUrl = document.getElementById('previewUrl');
        this.metaTags = document.getElementById('metaTags');
        this.copyMetaBtn = document.getElementById('copyMetaBtn');

        // Add event listeners
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePreview();
        });

        this.platform.addEventListener('change', () => this.updatePlatformSpecifics());
        this.title.addEventListener('input', () => this.updateCharacterCount(this.title, this.titleCount));
        this.description.addEventListener('input', () => this.updateCharacterCount(this.description, this.descriptionCount));
        this.url.addEventListener('input', () => this.updatePreviewUrl());
        this.image.addEventListener('change', () => this.handleImageUpload());
        this.copyMetaBtn.addEventListener('click', () => this.copyMetaTags());

        // Initialize character counts
        this.updateCharacterCount(this.title, this.titleCount);
        this.updateCharacterCount(this.description, this.descriptionCount);
    }

    updatePlatformSpecifics() {
        // Update platform-specific elements visibility
        document.querySelectorAll('.platform-specific').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelector(`.platform-specific.${this.platform.value}`).classList.add('active');

        // Update preview if form is filled
        if (this.form.checkValidity()) {
            this.generatePreview();
        }
    }

    updateCharacterCount(input, counter) {
        counter.textContent = input.value.length;
        this.updatePreview();
    }

    updatePreviewUrl() {
        try {
            const url = new URL(this.url.value);
            this.previewUrl.textContent = url.hostname;
        } catch {
            this.previewUrl.textContent = 'example.com';
        }
    }

    async handleImageUpload() {
        const file = this.image.files[0];
        if (file && file.type.startsWith('image/')) {
            try {
                // Create object URL for the image
                this.imageUrl = URL.createObjectURL(file);
                this.previewImage.src = this.imageUrl;

                // Check image dimensions
                const dimensions = await this.getImageDimensions(this.imageUrl);
                this.validateImageDimensions(dimensions);
            } catch (error) {
                this.showNotification(error.message, 'error');
            }
        }
    }

    getImageDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    }

    validateImageDimensions(dimensions) {
        const platform = this.platform.value;
        const recommendations = {
            facebook: { width: 1200, height: 630 },
            twitter: { width: 1200, height: 600 },
            linkedin: { width: 1200, height: 627 }
        };

        const recommended = recommendations[platform];
        if (dimensions.width < recommended.width || dimensions.height < recommended.height) {
            this.showNotification(`Image is smaller than recommended size (${recommended.width}x${recommended.height}px)`, 'warning');
        }
    }

    updatePreview() {
        this.previewTitle.textContent = this.title.value || 'Your title will appear here';
        this.previewDescription.textContent = this.description.value || 'Your description will appear here';
    }

    generatePreview() {
        this.updatePreview();
        this.generateMetaTags();
        this.showNotification('Preview generated successfully!');
    }

    generateMetaTags() {
        const platform = this.platform.value;
        let tags = '';

        // Common meta tags
        tags += `<!-- Common Meta Tags -->\n`;
        tags += `<meta property="og:title" content="${this.escapeHtml(this.title.value)}">\n`;
        tags += `<meta property="og:description" content="${this.escapeHtml(this.description.value)}">\n`;
        tags += `<meta property="og:url" content="${this.escapeHtml(this.url.value)}">\n`;
        tags += `<meta property="og:image" content="${this.escapeHtml(this.imageUrl || '')}">\n\n`;

        // Platform-specific meta tags
        if (platform === 'twitter') {
            tags += `<!-- Twitter Meta Tags -->\n`;
            tags += `<meta name="twitter:card" content="summary_large_image">\n`;
            tags += `<meta name="twitter:title" content="${this.escapeHtml(this.title.value)}">\n`;
            tags += `<meta name="twitter:description" content="${this.escapeHtml(this.description.value)}">\n`;
            tags += `<meta name="twitter:image" content="${this.escapeHtml(this.imageUrl || '')}">\n`;
        } else if (platform === 'linkedin') {
            tags += `<!-- LinkedIn Meta Tags -->\n`;
            tags += `<meta property="og:type" content="article">\n`;
            tags += `<meta property="og:site_name" content="Your Site Name">\n`;
        } else {
            tags += `<!-- Facebook Meta Tags -->\n`;
            tags += `<meta property="og:type" content="website">\n`;
            tags += `<meta property="og:site_name" content="Your Site Name">\n`;
        }

        this.metaTags.value = tags;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async copyMetaTags() {
        try {
            await navigator.clipboard.writeText(this.metaTags.value);
            this.showNotification('Meta tags copied to clipboard!');
        } catch (error) {
            this.showNotification('Failed to copy meta tags', 'error');
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

// Initialize the tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SocialPreviewGenerator();
}); 