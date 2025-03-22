// Tool categories and their tools
const toolCategories = [
    {
        id: 'text-tools',
        name: 'Text Tools',
        icon: 'fas fa-font',
        tools: [
            { id: 'word-counter', name: 'Word Counter', description: 'Count words, characters, and lines in your text' },
            { id: 'case-converter', name: 'Case Converter', description: 'Convert text between different case styles' },
            { id: 'text-diff', name: 'Text Diff', description: 'Compare two texts and find differences' }
        ]
    },
    {
        id: 'image-tools',
        name: 'Image Tools',
        icon: 'fas fa-image',
        tools: [
            { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images without losing quality' },
            { id: 'image-converter', name: 'Image Converter', description: 'Convert images between different formats' },
            { id: 'image-resizer', name: 'Image Resizer', description: 'Resize images to specific dimensions' },
            { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to desired dimensions' }
        ]
    },
    {
        id: 'seo-tools',
        name: 'SEO Tools',
        icon: 'fas fa-search',
        tools: [
            { id: 'meta-tag-generator', name: 'Meta Tag Generator', description: 'Generate meta tags for your website' },
            { id: 'keyword-density', name: 'Keyword Density Checker', description: 'Check keyword density in your content' },
            { id: 'robots-generator', name: 'Robots.txt Generator', description: 'Generate robots.txt file for your website' }
        ]
    },
    {
        id: 'calculator-tools',
        name: 'Calculators',
        icon: 'fas fa-calculator',
        tools: [
            { id: 'scientific-calculator', name: 'Scientific Calculator', description: 'Advanced scientific calculations' },
            { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between different units' },
            { id: 'percentage-calculator', name: 'Percentage Calculator', description: 'Calculate percentages easily' },
            { id: 'bmi-calculator', name: 'BMI Calculator', description: 'Calculate Body Mass Index' }
        ]
    },
    {
        id: 'converter-tools',
        name: 'Converters',
        icon: 'fas fa-exchange-alt',
        tools: [
            { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON data' },
            { id: 'base64-converter', name: 'Base64 Converter', description: 'Encode and decode text to/from Base64' },
            { id: 'color-converter', name: 'Color Converter', description: 'Convert between color formats' },
            { id: 'time-converter', name: 'Time Converter', description: 'Convert between time zones and formats' }
        ]
    },
    {
        id: 'social-tools',
        name: 'Social Media Tools',
        icon: 'fas fa-share-alt',
        tools: [
            { id: 'social-preview', name: 'Social Preview Generator', description: 'Generate social media preview cards' },
            { id: 'hashtag-generator', name: 'Hashtag Generator', description: 'Generate relevant hashtags for your content' },
            { id: 'link-shortener', name: 'Link Shortener', description: 'Shorten long URLs for social media' }
        ]
    },
    {
        id: 'developer-tools',
        name: 'Developer Tools',
        icon: 'fas fa-code',
        tools: [
            { id: 'code-formatter', name: 'Code Formatter', description: 'Format code in various languages' },
            { id: 'minifier', name: 'Code Minifier', description: 'Minify JavaScript, CSS, and HTML' },
            { id: 'regex-tester', name: 'Regex Tester', description: 'Test and validate regular expressions' }
        ]
    },
    {
        id: 'security-tools',
        name: 'Security Tools',
        icon: 'fas fa-shield-alt',
        tools: [
            { id: 'password-generator', name: 'Password Generator', description: 'Generate secure passwords' },
            { id: 'hash-generator', name: 'Hash Generator', description: 'Generate various hash formats' },
            { id: 'encryption-tool', name: 'Encryption Tool', description: 'Encrypt and decrypt text' }
        ]
    }
];

// Load header and footer
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initializeTheme();
    loadCategories();
    loadTools();
    initializeSearch();
});

// Load header and footer components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('components/header.html');
        const headerHtml = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerHtml;

        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHtml = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerHtml;

        // Initialize theme toggle after header is loaded
        const themeToggleNav = document.getElementById('themeToggleNav');
        if (themeToggleNav) {
            themeToggleNav.addEventListener('click', toggleTheme);
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Theme management
function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    const themeToggleNav = document.getElementById('themeToggleNav');
    if (themeToggleNav) {
        const icon = themeToggleNav.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

// Load categories
function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = toolCategories.map(category => `
        <div class="col-md-4">
            <div class="card h-100 hover-shadow">
                <div class="card-body text-center">
                    <i class="${category.icon} fa-3x mb-3 text-primary"></i>
                    <h3 class="card-title h5">${category.name}</h3>
                    <p class="card-text">${category.tools.length} tools</p>
                    <button class="btn btn-outline-primary" onclick="filterToolsByCategory('${category.id}')">
                        View Tools
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load all tools
function loadTools() {
    const toolsContainer = document.getElementById('tools-container');
    if (!toolsContainer) return;

    const allTools = toolCategories.flatMap(category => 
        category.tools.map(tool => ({
            ...tool,
            categoryId: category.id,
            categoryName: category.name
        }))
    );

    toolsContainer.innerHTML = allTools.map(tool => `
        <div class="col-md-4 tool-card" data-category="${tool.categoryId}">
            <div class="card h-100 hover-shadow">
                <div class="card-body">
                    <h3 class="card-title h5">${tool.name}</h3>
                    <p class="card-text">${tool.description}</p>
                    <p class="text-muted small">Category: ${tool.categoryName}</p>
                    <a href="tools/${tool.id}.html" class="btn btn-primary">
                        Use Tool
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter tools by category
function filterToolsByCategory(categoryId) {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        if (categoryId === 'all' || card.dataset.category === categoryId) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const toolCards = document.querySelectorAll('.tool-card');

        toolCards.forEach(card => {
            const toolName = card.querySelector('.card-title').textContent.toLowerCase();
            const toolDescription = card.querySelector('.card-text').textContent.toLowerCase();
            const categoryName = card.querySelector('.text-muted').textContent.toLowerCase();

            if (toolName.includes(searchTerm) || 
                toolDescription.includes(searchTerm) || 
                categoryName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
} 