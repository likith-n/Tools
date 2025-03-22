class ImageCropper extends ToolTemplate {
    constructor() {
        super('image-cropper', 'Image Cropper');
        this.imageInput = null;
        this.dropZone = null;
        this.image = null;
        this.preview = null;
        this.cropBtn = null;
        this.downloadBtn = null;
        this.cropper = null;
        this.currentFile = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.imageInput = document.getElementById('imageInput');
        this.dropZone = document.getElementById('dropZone');
        this.image = document.getElementById('image');
        this.preview = document.querySelector('.preview');
        this.cropBtn = document.getElementById('cropBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        // Add event listeners
        this.imageInput.addEventListener('change', this.handleFileInput.bind(this));
        this.cropBtn.addEventListener('click', this.cropImage.bind(this));
        this.downloadBtn.addEventListener('click', this.downloadImage.bind(this));

        // Setup drag and drop
        this.setupDragAndDrop();

        // Setup control buttons
        this.setupControlButtons();
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

    setupControlButtons() {
        document.querySelectorAll('[data-method]').forEach(button => {
            button.addEventListener('click', () => {
                const method = button.getAttribute('data-method');
                const option = button.getAttribute('data-option');
                
                if (this.cropper) {
                    try {
                        if (method === 'rotate') {
                            this.cropper.rotate(Number(option));
                        } else if (method === 'scaleX' || method === 'scaleY') {
                            const currentScale = this.cropper.getData()[method];
                            this.cropper[method](currentScale === 1 ? -1 : 1);
                        } else if (method === 'setDragMode') {
                            this.cropper.setDragMode(option);
                        } else if (method === 'zoom') {
                            this.cropper.zoom(Number(option));
                        } else if (method === 'setAspectRatio') {
                            this.cropper.setAspectRatio(Number(option));
                        }
                    } catch (error) {
                        this.showNotification(error.message, 'error');
                    }
                }
            });
        });
    }

    handleFileInput() {
        const file = this.imageInput.files[0];
        if (file && file.type.startsWith('image/')) {
            this.currentFile = file;
            this.loadImagePreview(file);
        } else {
            this.showNotification('Please select a valid image file', 'error');
        }
    }

    loadImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.image.src = e.target.result;
            this.image.classList.remove('d-none');
            document.querySelector('.preview-container').classList.remove('d-none');
            
            // Destroy existing cropper if it exists
            if (this.cropper) {
                this.cropper.destroy();
            }

            // Initialize Cropper.js
            this.cropper = new Cropper(this.image, {
                aspectRatio: NaN,
                preview: this.preview,
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                modal: true,
                guides: true,
                highlight: true,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: true,
            });

            this.cropBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    async cropImage() {
        try {
            if (!this.cropper) {
                throw new Error('Please select an image first');
            }

            this.cropBtn.disabled = true;
            this.cropBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Cropping...';

            // Get the cropped canvas
            const canvas = this.cropper.getCroppedCanvas({
                maxWidth: 4096,
                maxHeight: 4096,
                fillColor: '#fff',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            if (!canvas) {
                throw new Error('Failed to crop image');
            }

            // Convert canvas to blob
            const croppedImage = await new Promise((resolve) => {
                canvas.toBlob((blob) => resolve(blob), this.currentFile.type, 1);
            });

            // Create object URL for preview
            const croppedUrl = URL.createObjectURL(croppedImage);
            this.image.src = croppedUrl;
            
            // Reinitialize cropper with new image
            if (this.cropper) {
                this.cropper.destroy();
            }
            this.cropper = new Cropper(this.image, {
                aspectRatio: NaN,
                preview: this.preview,
                viewMode: 2,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
            });

            this.downloadBtn.disabled = false;
            this.showNotification('Image cropped successfully!');
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.cropBtn.disabled = false;
            this.cropBtn.innerHTML = '<i class="fas fa-crop me-2"></i>Crop Image';
        }
    }

    downloadImage() {
        if (!this.cropper) return;

        const canvas = this.cropper.getCroppedCanvas();
        if (!canvas) return;

        const link = document.createElement('a');
        const extension = this.currentFile.name.split('.').pop();
        link.download = `cropped-image.${extension}`;
        link.href = canvas.toDataURL(this.currentFile.type, 1);
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
    new ImageCropper();
}); 