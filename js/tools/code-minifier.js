class CodeMinifier extends ToolTemplate {
    constructor() {
        super('code-minifier', 'Code Minifier');
        this.editor = null;
        this.language = null;
        this.theme = null;
        this.minifyBtn = null;
        this.copyBtn = null;
        this.clearBtn = null;
        this.outputCode = null;
        this.errorContainer = null;
        this.originalSize = null;
        this.minifiedSize = null;
        this.reduction = null;
        this.options = {};
    }

    setupToolElements() {
        // Get DOM elements
        this.language = document.getElementById('language');
        this.theme = document.getElementById('theme');
        this.minifyBtn = document.getElementById('minifyBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.outputCode = document.getElementById('outputCode');
        this.errorContainer = document.getElementById('errorContainer');
        this.originalSize = document.getElementById('originalSize');
        this.minifiedSize = document.getElementById('minifiedSize');
        this.reduction = document.getElementById('reduction');

        // Get minification options
        this.options = {
            removeComments: document.getElementById('removeComments'),
            mangleNames: document.getElementById('mangleNames'),
            collapseWhitespace: document.getElementById('collapseWhitespace'),
            removeUnused: document.getElementById('removeUnused'),
            mergeDuplicates: document.getElementById('mergeDuplicates'),
            removeOptionalTags: document.getElementById('removeOptionalTags')
        };

        // Initialize CodeMirror
        this.initializeCodeMirror();

        // Add event listeners
        this.language.addEventListener('change', () => this.updateEditorMode());
        this.theme.addEventListener('change', () => this.updateEditorTheme());
        this.minifyBtn.addEventListener('click', () => this.minifyCode());
        this.copyBtn.addEventListener('click', () => this.copyCode());
        this.clearBtn.addEventListener('click', () => this.clearCode());
    }

    initializeCodeMirror() {
        this.editor = CodeMirror.fromTextArea(document.getElementById('inputCode'), {
            mode: this.getEditorMode(this.language.value),
            theme: this.theme.value,
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: 2,
            tabSize: 2,
            lineWrapping: true,
            viewportMargin: Infinity
        });
    }

    getEditorMode(language) {
        const modes = {
            javascript: 'javascript',
            html: 'htmlmixed',
            css: 'css'
        };
        return modes[language] || 'javascript';
    }

    updateEditorMode() {
        this.editor.setOption('mode', this.getEditorMode(this.language.value));
    }

    updateEditorTheme() {
        this.editor.setOption('theme', this.theme.value);
    }

    async minifyCode() {
        try {
            const code = this.editor.getValue();
            if (!code.trim()) {
                throw new Error('Please enter some code to minify');
            }

            this.minifyBtn.disabled = true;
            this.minifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Minifying...';
            this.hideError();

            const minified = await this.minifyByLanguage(code);
            this.outputCode.value = minified;
            this.updateStatistics(code, minified);
            this.showNotification('Code minified successfully!');
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.minifyBtn.disabled = false;
            this.minifyBtn.innerHTML = '<i class="fas fa-compress-alt me-2"></i>Minify Code';
        }
    }

    async minifyByLanguage(code) {
        switch (this.language.value) {
            case 'javascript':
                return this.minifyJavaScript(code);
            case 'css':
                return this.minifyCSS(code);
            case 'html':
                return this.minifyHTML(code);
            default:
                throw new Error('Unsupported language');
        }
    }

    async minifyJavaScript(code) {
        const options = {
            compress: {
                dead_code: this.options.removeUnused.checked,
                drop_console: false,
                drop_debugger: true,
                keep_classnames: false,
                keep_fargs: true,
                keep_infinity: true,
                passes: 2
            },
            mangle: this.options.mangleNames.checked,
            sourceMap: false,
            output: {
                comments: this.options.removeComments.checked ? false : 'some'
            }
        };

        try {
            const result = await Terser.minify(code, options);
            return result.code;
        } catch (error) {
            throw new Error(`JavaScript minification error: ${error.message}`);
        }
    }

    minifyCSS(code) {
        const options = {
            level: {
                1: {
                    all: true,
                    removeEmpty: true,
                    removeWhitespace: this.options.collapseWhitespace.checked,
                    removeComments: this.options.removeComments.checked
                },
                2: {
                    mergeDuplicateSelectors: this.options.mergeDuplicates.checked,
                    mergeMedia: true,
                    removeEmpty: true,
                    removeDuplicateFontRules: true,
                    removeDuplicateMediaBlocks: true,
                    removeDuplicateRules: true
                }
            }
        };

        try {
            const cleanCSS = new CleanCSS(options);
            const result = cleanCSS.minify(code);
            if (result.errors.length > 0) {
                throw new Error(result.errors[0]);
            }
            return result.styles;
        } catch (error) {
            throw new Error(`CSS minification error: ${error.message}`);
        }
    }

    minifyHTML(code) {
        const options = {
            removeComments: this.options.removeComments.checked,
            removeCommentsFromCDATA: true,
            removeCDATASectionsFromCDATA: true,
            collapseWhitespace: this.options.collapseWhitespace.checked,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeOptionalTags: this.options.removeOptionalTags.checked,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        };

        try {
            return HTMLMinifier.minify(code, options);
        } catch (error) {
            throw new Error(`HTML minification error: ${error.message}`);
        }
    }

    updateStatistics(original, minified) {
        const originalBytes = new Blob([original]).size;
        const minifiedBytes = new Blob([minified]).size;
        const reductionPercent = ((originalBytes - minifiedBytes) / originalBytes * 100).toFixed(1);

        this.originalSize.textContent = this.formatBytes(originalBytes);
        this.minifiedSize.textContent = this.formatBytes(minifiedBytes);
        this.reduction.textContent = `${reductionPercent}%`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    async copyCode() {
        try {
            const minified = this.outputCode.value;
            if (!minified) {
                throw new Error('No minified code to copy');
            }
            await navigator.clipboard.writeText(minified);
            this.showNotification('Minified code copied to clipboard!');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    clearCode() {
        this.editor.setValue('');
        this.outputCode.value = '';
        this.originalSize.textContent = '0 KB';
        this.minifiedSize.textContent = '0 KB';
        this.reduction.textContent = '0%';
        this.hideError();
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.classList.remove('d-none');
    }

    hideError() {
        this.errorContainer.classList.add('d-none');
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
    new CodeMinifier();
}); 