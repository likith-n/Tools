// This file contains JavaScript functions for dynamic features such as the search functionality, tool interactions, and dynamic inclusion of the header and footer.

document.addEventListener("DOMContentLoaded", function() {
    // Function to include header and footer
    function includeHTML() {
        const header = document.querySelector("header");
        const footer = document.querySelector("footer");

        if (header) {
            header.innerHTML = `
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <a class="navbar-brand" href="index.html">Multi Tools</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item active">
                                <a class="nav-link" href="index.html">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="about.html">About</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            `;
        }

        if (footer) {
            footer.innerHTML = `
                <div class="footer bg-light text-center">
                    <p>&copy; 2023 Multi Tools. All rights reserved.</p>
                </div>
            `;
        }
    }

    includeHTML();

    // Search functionality
    const searchInput = document.getElementById("search-input");
    const toolList = document.getElementById("tool-list");

    if (searchInput) {
        searchInput.addEventListener("keyup", function() {
            const filter = searchInput.value.toLowerCase();
            const tools = toolList.getElementsByTagName("li");

            for (let i = 0; i < tools.length; i++) {
                const tool = tools[i].textContent.toLowerCase();
                tools[i].style.display = tool.includes(filter) ? "" : "none";
            }
        });
    }
});