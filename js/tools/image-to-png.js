// DOM Elements
const imageInput = document.getElementById('imageInput');
const uploadSection = document.querySelector('.upload-section');
const previewSection = document.getElementById('previewSection');
const originalPreview = document.getElementById('originalPreview');
const convertedPreview = document.getElementById('convertedPreview');
const conversionOptions = document.getElementById('conversionOptions');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Drag and Drop functionality
uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.classList.add('border-primary');
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.classList.remove('border-primary');
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.classList.remove('border-primary');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    } else {
        showError('Please upload a valid image file.');
    }
});

// File input change handler
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// Quality slider handler
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = `${e.target.value}%`;
});

// Convert button handler
convertBtn.addEventListener('click', convertToPNG);

// Download button handler
downloadBtn.addEventListener('click', downloadPNG);

// Handle image upload
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        originalPreview.src = e.target.result;
        previewSection.classList.remove('d-none');
        conversionOptions.classList.remove('d-none');
        convertBtn.classList.remove('d-none');
        downloadBtn.classList.add('d-none');
    };
    reader.readAsDataURL(file);
}

// Convert image to PNG
function convertToPNG() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match image
    canvas.width = originalPreview.naturalWidth;
    canvas.height = originalPreview.naturalHeight;
    
    // Draw image on canvas
    ctx.drawImage(originalPreview, 0, 0);
    
    // Convert to PNG with specified quality
    const quality = qualitySlider.value / 100;
    const pngDataUrl = canvas.toDataURL('image/png', quality);
    
    // Update preview
    convertedPreview.src = pngDataUrl;
    
    // Show download button
    downloadBtn.classList.remove('d-none');
    
    // Store PNG data URL for download
    downloadBtn.dataset.pngDataUrl = pngDataUrl;
}

// Download PNG
function downloadPNG() {
    const link = document.createElement('a');
    link.download = 'converted-image.png';
    link.href = downloadBtn.dataset.pngDataUrl;
    link.click();
}

// Show error message
function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    uploadSection.parentNode.insertBefore(alertDiv, uploadSection.nextSibling);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize tool
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
});