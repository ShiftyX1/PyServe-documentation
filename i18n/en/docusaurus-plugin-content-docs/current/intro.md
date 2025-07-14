---
sidebar_position: 1
---

# Getting Started

Let's discover **PyServe in less than 5 minutes**.

## What is PyServe?

PyServe is a lightweight and fast HTTP server written in Python, designed for quick deployment of web applications and serving static files with minimal configuration.

### Key Features

- 🚀 **Quick Start** - Launch with a single command
- 📁 **Static Files** - Serve HTML, CSS, JavaScript and other static files
- 📝 **Built-in Logging** - Beautiful logging of all requests
- ⚙️ **Configurable** - Flexible configuration through YAML files
- 🔒 **Security** - Built-in security features and HTTPS support
- 🔄 **Redirects** - Easy URL redirection management

## Requirements

- [Python](https://python.org/downloads/) version 3.7 or above
- Basic knowledge of Python and command line

## Installation

Clone the PyServe repository:

```bash
git clone https://github.com/ShiftyX1/PyServe.git
cd PyServe
```

Install dependencies (if any):

```bash
pip install -r requirements.txt
```

## Quick Start

Start the server with default settings:

```bash
python run.py
```

The server will start on `http://localhost:8000` by default.

## Basic Configuration

Create a `config.yaml` file to customize your server:

```yaml
server:
  host: "0.0.0.0"
  port: 8000
  static_dir: "./static"

logging:
  level: "INFO"
  format: "detailed"
```

Start the server with your configuration:

```bash
python run.py --config config.yaml
```

Your PyServe server is now running! Open http://localhost:8000 in your browser to see it in action.
