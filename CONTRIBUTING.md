# Contributing to WeCanUseAI.com

First off, thank you for considering contributing! We are excited to build a community of developers who can help grow this platform.

## How to Add a New Tool

Our goal is to make it as simple as possible to add new, independent tools to the platform. Each tool should be a self-contained application within the `apps` directory.

### Step 1: Create a New Application Directory

1.  Create a new directory for your tool under the `apps/` directory. For example, if you are creating an "Image Analyzer" tool, you would create `apps/image-analyzer`.
2.  Your application should be self-contained within this directory. This means it should have its own `package.json` for dependencies, its own `index.html`, and all other necessary assets.

### Step 2: Develop Your Tool

1.  Build your tool as a standard web application.
2.  If your tool requires a backend, you will need to handle its deployment separately for now. In the future, we aim to provide a more streamlined process for this.

### Step 3: Add Your Tool to the Portal

To make your tool discoverable, you need to add it to the main portal's list of tools.

1.  Open the `apps/portal/tools.json` file.
2.  Add a new JSON object for your tool, following the existing format. Make sure to include:
    - `title`: The name of your tool.
    - `description`: A short description.
    - `url`: The URL where your tool is hosted. For a tool within this monorepo, this will likely be a relative path (e.g., `/image-analyzer/`).
    - `icon`: A Font Awesome icon class.
    - `show`: Set to `true`.
    - `featured`: Set to `true` or `false` depending on whether you want it to appear in the featured carousel.

### Step 4: Submit a Pull Request

Once you have created your tool and added it to the portal, you can submit a pull request for review.

---

We are still in the early stages of development, and this process will evolve over time. We appreciate your patience and your contributions!
