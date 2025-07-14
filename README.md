# PyServe Documentation

This repository contains the official documentation for PyServe - a lightweight and fast HTTP server written in Python.

## About

The documentation is built using [Docusaurus](https://docusaurus.io/) and supports multiple languages (currently Russian and English). It includes installation guides, configuration examples, API reference, and deployment instructions.

## Contributing

We welcome contributions to improve the documentation! This includes:

- Fixing typos and improving existing content
- Adding new guides and tutorials
- Translating content to new languages
- Improving code examples
- Enhancing the overall user experience

## Links

- [Live Documentation](https://docs.pyserve.org)
- [PyServe Repository](https://github.com/ShiftyX1/PyServe)
- [Official Website](https://pyserve.org)

## Development

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static content hosting service.

### Internationalization

The documentation supports multiple languages. To add a new language:

1. Add the locale to `docusaurus.config.ts`
2. Create translation files in the `i18n/<locale>` directory
3. Translate the content following Docusaurus i18n guidelines

### Deployment

The documentation is automatically deployed when changes are merged to the main branch.

For manual deployment:

```bash
npm run deploy
```

## Project Structure

```
docs/                    # English documentation (default locale)
i18n/                   # Translations
├── ru/                 # Russian translations
└── en/                 # English translations (if needed)
blog/                   # Blog posts
src/                    # Custom React components
static/                 # Static assets
```

## Writing Guidelines

- Use clear and concise language
- Include code examples where appropriate
- Follow the existing documentation structure
- Test all code examples before submitting
- Keep translations consistent across languages
