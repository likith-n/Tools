class ImageCompressor extends ToolTemplate {
    constructor() {
        super('image-compressor', 'Image Compressor');
        this.imageInput = null;
        this.dropZone = null;
        this.inputPreview = null;
        this.outputPreview = null;
        this.qualityRange = null;
        this.qualityValue = null;
        this.maxWidthInput = null;
        this.maxHeightInput = null;
        this.compressBtn = null;
        this.downloadBtn = null;
        this.inputSize = null;
        this.outputSize = null;
        this.compressionRatio = null;
        this.placeholderText = null;
        this.currentFile = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.imageInput = document.getElementById('imageInput');
        this.dropZone = document.getElementById('dropZone');
        this.inputPreview = document.getElementById('inputPreview');
        this.outputPreview = document.getElementById('outputPreview');
        this.qualityRange = document.getElementById('qualityRange');
        this.qualityValue = document.getElementById('qualityValue');
        this.maxWidthInput = document.getElementById('maxWidthInput');
        this.maxHeightInput = document.getElementById('maxHeightInput');
        this.compressBtn = document.getElementById('compressBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.inputSize = document.getElementById('inputSize');
        this.outputSize = document.getElementById('outputSize');
        this.compressionRatio = document.getElementById('compressionRatio');
        this.placeholderText = document.getElementById('placeholderText');

        // Add event listeners
        this.imageInput.addEventListener('change', this.handleFileInput.bind(this));
        this.qualityRange.addEventListener('input', this.updateQualityValue.bind(this));
        this.compressBtn.addEventListener('click', this.compressImage.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));

        // Setup drag and drop
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

    updateQualityValue() {
        this.qualityValue.textContent = `${this.qualityRange.value}%`;
    }

    handleFileInput() {
        const file = this.imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            this.currentFile = file;
            this.compressBtn.disabled = false;
            this.showPreview(file);
            this.updateInputSize(file.size);
        } else {
            this.showNotification('Please select a valid image file', 'error');
        }
    }

    showPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.inputPreview.src = e.target.result;
            this.inputPreview.classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }

    updateInputSize(size) {
        const sizeInKB = size / 1024;
        this.inputSize.textContent = sizeInKB < 1024 
            ? `${sizeInKB.toFixed(2)} KB` 
            : `${(sizeInKB / 1024).toFixed(2)} MB`;
    }

    async compressImage() {
        try {
            this.compressBtn.disabled = true;
            this.compressBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Compressing...';

            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: Math.max(
                    parseInt(this.maxWidthInput.value) || 1920,
                    parseInt(this.maxHeightInput.value) || 1080
                ),
                useWebWorker: true,
                quality: this.qualityRange.value / 100
            };

            const compressedFile = await imageCompression(this.currentFile, options);
            const url = URL.createObjectURL(compressedFile);
            
            this.outputPreview.src = url;
            this.outputPreview.classList.remove('d-none');
            this.placeholderText.classList.add('d-none');
            this.downloadBtn.disabled = false;

            // Update size information
            const outputSizeKB = compressedFile.size / 1024;
            this.outputSize.textContent = outputSizeKB < 1024 
                ? `${outputSizeKB.toFixed(2)} KB` 
                : `${(outputSizeKB / 1024).toFixed(2)} MB`;

            // Calculate and display compression ratio
            const ratio = ((1 - (compressedFile.size / this.currentFile.size)) * 100).toFixed(1);
            this.compressionRatio.textContent = `${ratio}%`;

            this.showNotification('Image compressed successfully!');
        } catch (error) {
            this.showNotification('Error compressing image: ' + error.message, 'error');
        } finally {
            this.compressBtn.disabled = false;
            this.compressBtn.innerHTML = '<i class="fas fa-compress-alt me-2"></i>Compress Image';
        }
    }

    downloadImage() {
        const link = document.createElement('a');
        const extension = this.currentFile.name.split('.').pop();
        link.download = `compressed-image.${extension}`;
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
    new ImageCompressor();
}); 