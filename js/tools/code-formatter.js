class CodeFormatter extends ToolTemplate {
    constructor() {
        super('code-formatter', 'Code Formatter');
        this.editor = null;
        this.language = null;
        this.indentation = null;
        this.theme = null;
        this.formatBtn = null;
        this.copyBtn = null;
        this.errorContainer = null;
        this.removeComments = null;
        this.singleQuotes = null;
        this.trailingCommas = null;
        this.bracketSpacing = null;
        this.semicolons = null;
        this.arrowParens = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.language = document.getElementById('language');
        this.indentation = document.getElementById('indentation');
        this.theme = document.getElementById('theme');
        this.formatBtn = document.getElementById('formatBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.errorContainer = document.getElementById('errorContainer');
        this.removeComments = document.getElementById('removeComments');
        this.singleQuotes = document.getElementById('singleQuotes');
        this.trailingCommas = document.getElementById('trailingCommas');
        this.bracketSpacing = document.getElementById('bracketSpacing');
        this.semicolons = document.getElementById('semicolons');
        this.arrowParens = document.getElementById('arrowParens');

        // Initialize CodeMirror
        this.initializeCodeMirror();

        // Add event listeners
        this.language.addEventListener('change', () => this.updateEditorMode());
        this.theme.addEventListener('change', () => this.updateEditorTheme());
        this.formatBtn.addEventListener('click', () => this.formatCode());
        this.copyBtn.addEventListener('click', () => this.copyCode());
    }

    initializeCodeMirror() {
        this.editor = CodeMirror.fromTextArea(document.getElementById('inputCode'), {
            mode: this.getEditorMode(this.language.value),
            theme: this.theme.value,
            lineNumbers: true,
            autoCloseBrackets: true,
            matchBrackets: true,
            indentUnit: parseInt(this.indentation.value),
            tabSize: parseInt(this.indentation.value),
            indentWithTabs: this.indentation.value === 'tab',
            lineWrapping: true,
            viewportMargin: Infinity,
            extraKeys: {
                'Ctrl-F': 'findPersistent',
                'Cmd-F': 'findPersistent',
                'Tab': (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        cm.replaceSelection(cm.getOption('indentWithTabs')
                            ? '\t'
                            : ' '.repeat(cm.getOption('indentUnit')));
                    }
                }
            }
        });
    }

    getEditorMode(language) {
        const modes = {
            javascript: 'javascript',
            html: 'htmlmixed',
            css: 'css',
            json: { name: 'javascript', json: true },
            xml: 'xml',
            sql: 'sql',
            python: 'python',
            java: 'text/x-java',
            csharp: 'text/x-csharp',
            php: 'php'
        };
        return modes[language] || 'javascript';
    }

    updateEditorMode() {
        this.editor.setOption('mode', this.getEditorMode(this.language.value));
    }

    updateEditorTheme() {
        this.editor.setOption('theme', this.theme.value);
    }

    async formatCode() {
        try {
            const code = this.editor.getValue();
            if (!code.trim()) {
                throw new Error('Please enter some code to format');
            }

            this.formatBtn.disabled = true;
            this.formatBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Formatting...';
            this.hideError();

            const formatted = await this.formatWithPrettier(code);
            this.editor.setValue(formatted);
            this.showNotification('Code formatted successfully!');
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.formatBtn.disabled = false;
            this.formatBtn.innerHTML = '<i class="fas fa-code me-2"></i>Format Code';
        }
    }

    async formatWithPrettier(code) {
        const options = {
            parser: this.getPrettierParser(),
            plugins: prettierPlugins,
            printWidth: 80,
            tabWidth: parseInt(this.indentation.value),
            useTabs: this.indentation.value === 'tab',
            semi: this.semicolons.checked,
            singleQuote: this.singleQuotes.checked,
            trailingComma: this.trailingCommas.checked ? 'all' : 'none',
            bracketSpacing: this.bracketSpacing.checked,
            arrowParens: this.arrowParens.checked ? 'always' : 'avoid',
            htmlWhitespaceSensitivity: 'css',
            endOfLine: 'lf'
        };

        return prettier.format(code, options);
    }

    getPrettierParser() {
        const parsers = {
            javascript: 'babel',
            html: 'html',
            css: 'css',
            json: 'json',
            xml: 'html',
            sql: 'babel', // Fallback to babel
            python: 'babel', // Fallback to babel
            java: 'babel', // Fallback to babel
            csharp: 'babel', // Fallback to babel
            php: 'babel' // Fallback to babel
        };
        return parsers[this.language.value] || 'babel';
    }

    async copyCode() {
        try {
            const code = this.editor.getValue();
            await navigator.clipboard.writeText(code);
            this.showNotification('Code copied to clipboard!');
        } catch (error) {
            this.showNotification('Failed to copy code', 'error');
        }
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
    new CodeFormatter();
}); 