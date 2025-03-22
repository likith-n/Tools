class ImageResizer extends ToolTemplate {
    constructor() {
        super('image-resizer', 'Image Resizer');
        this.imageInput = null;
        this.dropZone = null;
        this.inputPreview = null;
        this.outputPreview = null;
        this.widthInput = null;
        this.heightInput = null;
        this.qualityRange = null;
        this.qualityValue = null;
        this.resizeBtn = null;
        this.downloadBtn = null;
        this.aspectRatioLock = null;
        this.originalDimensions = null;
        this.newDimensions = null;
        this.placeholderText = null;
        this.currentFile = null;
        this.aspectRatio = 1;
        this.isAspectRatioLocked = true;
    }

    setupToolElements() {
        // Get DOM elements
        this.imageInput = document.getElementById('imageInput');
        this.dropZone = document.getElementById('dropZone');
        this.inputPreview = document.getElementById('inputPreview');
        this.outputPreview = document.getElementById('outputPreview');
        this.widthInput = document.getElementById('widthInput');
        this.heightInput = document.getElementById('heightInput');
        this.qualityRange = document.getElementById('qualityRange');
        this.qualityValue = document.getElementById('qualityValue');
        this.resizeBtn = document.getElementById('resizeBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.aspectRatioLock = document.getElementById('aspectRatioLock');
        this.originalDimensions = document.getElementById('originalDimensions');
        this.newDimensions = document.getElementById('newDimensions');
        this.placeholderText = document.getElementById('placeholderText');

        // Add event listeners
        this.imageInput.addEventListener('change', this.handleFileInput.bind(this));
        this.qualityRange.addEventListener('input', this.updateQualityValue.bind(this));
        this.resizeBtn.addEventListener('click', this.resizeImage.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));
        this.aspectRatioLock.addEventListener('click', this.toggleAspectRatio.bind(this));
        this.widthInput.addEventListener('input', () => this.handleDimensionChange('width'));
        this.heightInput.addEventListener('input', () => this.handleDimensionChange('height'));

        // Add preset size buttons event listeners
        document.querySelectorAll('[data-preset]').forEach(button => {
            button.addEventListener('click', () => this.applyPreset(button.dataset.preset));
        });

        // Setup drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.imageInput.files = e.dataTransfer.files;
                this.handleFileInput();
            }
        });
    }

    handleFileInput() {
        const file = this.imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            this.currentFile = file;
            this.resizeBtn.disabled = false;
            this.loadImagePreview(file);
        } else {
            this.showNotification('Please select a valid image file', 'error');
        }
    }

    loadImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.aspectRatio = img.width / img.height;
                this.widthInput.value = img.width;
                this.heightInput.value = img.height;
                this.originalDimensions.textContent = `${img.width}×${img.height}`;
                this.inputPreview.src = e.target.result;
                this.inputPreview.classList.remove('d-none');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    handleDimensionChange(dimension) {
        if (!this.isAspectRatioLocked) return;

        const value = parseInt(dimension === 'width' ? this.widthInput.value : this.heightInput.value);
        if (!value) return;

        if (dimension === 'width') {
            this.heightInput.value = Math.round(value / this.aspectRatio);
        } else {
            this.widthInput.value = Math.round(value * this.aspectRatio);
        }
    }

    toggleAspectRatio() {
        this.isAspectRatioLocked = !this.isAspectRatioLocked;
        const icon = this.aspectRatioLock.querySelector('i');
        icon.className = this.isAspectRatioLocked ? 'fas fa-lock' : 'fas fa-lock-open';
        this.aspectRatioLock.classList.toggle('locked', this.isAspectRatioLocked);
    }

    applyPreset(preset) {
        const presets = {
            'hd': { width: 1280, height: 720 },
            'fullhd': { width: 1920, height: 1080 },
            '4k': { width: 3840, height: 2160 }
        };

        if (presets[preset]) {
            this.widthInput.value = presets[preset].width;
            this.heightInput.value = presets[preset].height;
        }
    }

    updateQualityValue() {
        this.qualityValue.textContent = `${this.qualityRange.value}%`;
    }

    async resizeImage() {
        try {
            this.resizeBtn.disabled = true;
            this.resizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Resizing...';

            const width = parseInt(this.widthInput.value);
            const height = parseInt(this.heightInput.value);
            const quality = parseInt(this.qualityRange.value) / 100;

            if (!width || !height) {
                throw new Error('Please enter valid dimensions');
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.src = this.inputPreview.src;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const resizedImage = canvas.toDataURL(this.currentFile.type, quality);
            this.outputPreview.src = resizedImage;
            this.outputPreview.classList.remove('d-none');
            this.placeholderText.classList.add('d-none');
            this.downloadBtn.disabled = false;
            this.newDimensions.textContent = `${width}×${height}`;

            this.showNotification('Image resized successfully!');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.resizeBtn.disabled = false;
            this.resizeBtn.innerHTML = '<i class="fas fa-expand-arrows-alt me-2"></i>Resize Image';
        }
    }

    downloadImage() {
        const link = document.createElement('a');
        const extension = this.currentFile.name.split('.').pop();
        link.download = `resized-image.${extension}`;
        link.href = this.outputPreview.src;
        link.click();
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
    new ImageResizer();
}); 