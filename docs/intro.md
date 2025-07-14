---
sidebar_position: 1
---

# PyServe v0.4.1

Modern Async HTTP Server with AI-Powered Content Generation

## About the Project

PyServe is a modern async HTTP server written in Python with unique features like AI-powered content generation. Perfect for rapid prototyping, development, and experimentation with dynamic web content.

## Features

### 🚀 Quick Start
Launch the server with a single command and get to work

### 📁 Static Files
Serve HTML, CSS, JavaScript and other static files

### 📝 Logging
Built-in beautiful logging of all requests

### 🤖 Vibe-Serving
AI-generated content on-the-fly using language models

## Getting Started

Start the server using the command:

```bash
python run.py
```

For AI-generated content, try Vibe-Serving mode:

```bash
python run.py --vibe-serving
```

Configure your routes in `vibeconfig.yaml` and set your `OPENAI_API_KEY`!

For configuration, use the `config.yaml` file

Get started with the [installation guide](installation-and-setup/getting-started)!

## GitHub Repository

View the project on [GitHub](https://github.com/ShiftyX1/PyServe)

## Quick Setup

### 1. Clone and Install

```bash
git clone https://github.com/ShiftyX1/PyServe.git
cd PyServe
pip install pyyaml aiofiles aiohttp openai python-dotenv
```

### 2. Start the Server

```bash
python run.py
```

### 3. Access Your Server

Open `http://localhost:8000` in your browser.

