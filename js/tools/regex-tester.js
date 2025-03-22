class RegexTester extends ToolTemplate {
    constructor() {
        super('regex-tester', 'Regex Tester');
        this.editor = null;
        this.regex = null;
        this.flags = null;
        this.theme = null;
        this.testBtn = null;
        this.clearBtn = null;
        this.matchesContainer = null;
        this.groupsContainer = null;
        this.errorContainer = null;
        this.debounceTimeout = null;
    }

    setupToolElements() {
        // Get DOM elements
        this.regex = document.getElementById('regex');
        this.flags = document.getElementById('flags');
        this.theme = document.getElementById('theme');
        this.testBtn = document.getElementById('testBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.matchesContainer = document.getElementById('matchesContainer');
        this.groupsContainer = document.getElementById('groupsContainer');
        this.errorContainer = document.getElementById('errorContainer');

        // Initialize CodeMirror
        this.initializeCodeMirror();

        // Add event listeners
        this.regex.addEventListener('input', () => this.debounceTest());
        this.flags.addEventListener('input', () => this.debounceTest());
        this.theme.addEventListener('change', () => this.updateEditorTheme());
        this.testBtn.addEventListener('click', () => this.testRegex());
        this.clearBtn.addEventListener('click', () => this.clearAll());

        // Add input event listener to CodeMirror
        this.editor.on('change', () => this.debounceTest());
    }

    initializeCodeMirror() {
        this.editor = CodeMirror.fromTextArea(document.getElementById('testString'), {
            mode: 'text/plain',
            theme: this.theme.value,
            lineNumbers: true,
            lineWrapping: true,
            viewportMargin: Infinity,
            extraKeys: {
                'Ctrl-F': 'findPersistent',
                'Cmd-F': 'findPersistent'
            }
        });
    }

    updateEditorTheme() {
        this.editor.setOption('theme', this.theme.value);
    }

    debounceTest() {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => this.testRegex(), 300);
    }

    testRegex() {
        try {
            const pattern = this.regex.value;
            const flags = this.flags.value;
            const testString = this.editor.getValue();

            if (!pattern) {
                this.showDefaultState();
                return;
            }

            const regex = new RegExp(pattern, flags);
            this.hideError();
            this.updateResults(regex, testString);
        } catch (error) {
            this.showError(error.message);
            this.showDefaultState();
        }
    }

    updateResults(regex, testString) {
        this.updateMatches(regex, testString);
        this.updateGroups(regex, testString);
        this.highlightMatches(regex, testString);
    }

    updateMatches(regex, testString) {
        const matches = Array.from(testString.matchAll(regex));
        
        if (matches.length === 0) {
            this.matchesContainer.innerHTML = '<p class="text-muted">No matches found.</p>';
            return;
        }

        const matchesList = document.createElement('div');
        matchesList.className = 'list-group';

        matches.forEach((match, index) => {
            const matchItem = document.createElement('div');
            matchItem.className = 'list-group-item';
            
            const matchHeader = document.createElement('div');
            matchHeader.className = 'd-flex justify-content-between align-items-center mb-2';
            matchHeader.innerHTML = `
                <strong>Match ${index + 1}</strong>
                <span class="badge bg-secondary">Index: ${match.index}</span>
            `;

            const matchContent = document.createElement('div');
            matchContent.className = 'font-monospace bg-light p-2 rounded';
            matchContent.textContent = match[0];

            matchItem.appendChild(matchHeader);
            matchItem.appendChild(matchContent);
            matchesList.appendChild(matchItem);
        });

        this.matchesContainer.innerHTML = '';
        this.matchesContainer.appendChild(matchesList);
    }

    updateGroups(regex, testString) {
        const matches = Array.from(testString.matchAll(regex));
        
        if (matches.length === 0 || matches[0].length === 1) {
            this.groupsContainer.innerHTML = '<p class="text-muted">No groups found.</p>';
            return;
        }

        const groupsList = document.createElement('div');
        groupsList.className = 'list-group';

        matches.forEach((match, matchIndex) => {
            if (match.length > 1) {
                const matchItem = document.createElement('div');
                matchItem.className = 'list-group-item';
                
                const matchHeader = document.createElement('div');
                matchHeader.className = 'mb-2';
                matchHeader.innerHTML = `<strong>Match ${matchIndex + 1} Groups</strong>`;
                
                const groupsContent = document.createElement('div');
                for (let i = 1; i < match.length; i++) {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'mb-2';
                    groupDiv.innerHTML = `
                        <div class="small text-muted">Group ${i}</div>
                        <div class="font-monospace bg-light p-2 rounded">${match[i] || '(empty)'}</div>
                    `;
                    groupsContent.appendChild(groupDiv);
                }

                matchItem.appendChild(matchHeader);
                matchItem.appendChild(groupsContent);
                groupsList.appendChild(matchItem);
            }
        });

        this.groupsContainer.innerHTML = '';
        this.groupsContainer.appendChild(groupsList);
    }

    highlightMatches(regex, testString) {
        // Clear existing marks
        this.editor.getAllMarks().forEach(mark => mark.clear());

        // Get all matches
        const matches = Array.from(testString.matchAll(regex));
        
        matches.forEach(match => {
            const start = this.editor.posFromIndex(match.index);
            const end = this.editor.posFromIndex(match.index + match[0].length);
            
            this.editor.markText(start, end, {
                className: 'bg-warning',
                title: `Match: ${match[0]}`
            });
        });
    }

    showDefaultState() {
        this.matchesContainer.innerHTML = '<p class="text-muted">No matches yet. Enter a regex pattern and test string to see matches.</p>';
        this.groupsContainer.innerHTML = '<p class="text-muted">No groups found. Use capturing groups in your regex to see them here.</p>';
        this.editor.getAllMarks().forEach(mark => mark.clear());
    }

    clearAll() {
        this.regex.value = '';
        this.flags.value = '';
        this.editor.setValue('');
        this.hideError();
        this.showDefaultState();
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.classList.remove('d-none');
    }

    hideError() {
        this.errorContainer.classList.add('d-none');
    }
}

// Initialize the tool when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegexTester();
}); 