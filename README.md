# WeCanUseAI.com Platform Monorepo

This repository contains the source code for the WeCanUseAI.com platform, a distributed network of tools and workspaces designed for seamless asset creation and manipulation.

## 🚀 Vision

Our vision is to create a powerful, flexible, and open platform where users can:

- **Utilize a diverse ecosystem of tools** organized into logical subdomains.
- **Manage and process assets** in a unified workspace, allowing for complex workflows that combine multiple tools.
- **Integrate with their local system** through a browser extension, enabling the platform to securely access and manage local resources.
- **Contribute new tools** easily, fostering a community of developers and expanding the platform's capabilities.
- **Link multiple domains** together to form a large, distributed network of specialized systems.

## 📂 Repository Structure

This is a monorepo containing the various parts of the WeCanUseAI platform.

- `apps/`: Contains the individual, user-facing applications.
  - `apps/portal`: The main landing page and tool directory for the platform.
  - `apps/workspace`: The future home of the central asset manipulation workspace.
  - `...other tools`: Each new tool or tool-suite will have its own directory here.
- `packages/`: Contains shared libraries, components, and packages used across the different apps.
  - `packages/extension`: The future home of the browser extension.
- `docs/`: Contains documentation for the platform.

## 🤝 Contributing

We welcome contributions! Please see `CONTRIBUTING.md` for details on how to get started, including how to add a new tool to the platform.
