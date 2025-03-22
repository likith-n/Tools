class ImageConverter extends ToolTemplate {
    constructor() {
        super('image-converter', 'Image Converter');
        this.imageInput = null;
        this.formatSelect = null;
        this.qualityRange = null;
        this.qualityValue = null;
        this.convertBtn = null;
        this.outputImage = null;
        this.downloadBtn = null;
        this.outputSize = null;
        this.placeholderText = null;
        this.currentFile = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.imageInput = document.getElementById('imageInput');
        this.formatSelect = document.getElementById('formatSelect');
        this.qualityRange = document.getElementById('qualityRange');
        this.qualityValue = document.getElementById('qualityValue');
        this.convertBtn = document.getElementById('convertBtn');
        this.outputImage = document.getElementById('outputImage');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.outputSize = document.getElementById('outputSize');
        this.placeholderText = document.getElementById('placeholderText');

        // Add event listeners
        this.imageInput.addEventListener('change', this.handleFileInput.bind(this));
        this.qualityRange.addEventListener('input', this.updateQualityValue.bind(this));
        this.convertBtn.addEventListener('click', this.convertImage.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));

        // Setup drag and drop
        const dropZone = document.querySelector('.card');
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.imageInput.files = e.dataTransfer.files;
                this.handleFileInput();
            }
        });
    }

    updateQualityValue() {
        this.qualityValue.textContent = `${this.qualityRange.value}%`;
    }

    handleFileInput() {
        const file = this.imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            this.currentFile = file;
            this.convertBtn.disabled = false;
            this.showPreview(file);
        } else {
            this.showNotification('Please select a valid image file', 'error');
        }
    }

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.outputImage.src = e.target.result;
            this.outputImage.classList.remove('d-none');
            this.placeholderText.classList.add('d-none');
        };
        reader.readAsDataURL(file);
    }

    async convertImage() {
        try {
            this.convertBtn.disabled = true;
            this.convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Converting...';

            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: 2048,
                useWebWorker: true,
                fileType: `image/${this.formatSelect.value}`,
                quality: this.qualityRange.value / 100
            };

            const compressedFile = await imageCompression(this.currentFile, options);
            const url = URL.createObjectURL(compressedFile);
            
            this.outputImage.src = url;
            this.outputImage.classList.remove('d-none');
            this.placeholderText.classList.add('d-none');
            this.downloadBtn.disabled = false;

            // Update size information
            const size = compressedFile.size / 1024; // Convert to KB
            this.outputSize.textContent = size < 1024 
                ? `${size.toFixed(2)} KB` 
                : `${(size / 1024).toFixed(2)} MB`;

            this.showNotification('Image converted successfully!');
        } catch (error) {
            this.showNotification('Error converting image: ' + error.message, 'error');
        } finally {
            this.convertBtn.disabled = false;
            this.convertBtn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Convert';
        }
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = `converted-image.${this.formatSelect.value}`;
        link.href = this.outputImage.src;
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
    new ImageConverter();
}); 