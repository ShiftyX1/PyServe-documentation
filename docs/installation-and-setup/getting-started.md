---
sidebar_position: 1
---

# Getting Started

Quick guide to get up and running with PyServe v0.4.2

## Installation

PyServe is a pure Python application with minimal dependencies. Follow these steps to install:

1. Clone the repository:
   ```bash
   git clone https://github.com/ShiftyX1/PyServe.git
   cd PyServe
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv pyserve-env
   source pyserve-env/bin/activate  # On Windows: pyserve-env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   
   Or manually install the required packages:
   ```bash
   pip install pyyaml aiofiles aiohttp openai python-dotenv
   ```

:::info
**Note:** PyServe v0.4.2 requires Python 3.7+ and now uses modern async/await syntax throughout.
:::

## Basic Usage

Starting the server with default settings:

```bash
python run.py
```

This will start PyServe with the following default configuration:
- Host: 127.0.0.1 (localhost)
- Port: 8000
- Static files directory: ./static
- Templates directory: ./templates
- Log level: INFO

You can now access your server at [http://localhost:8000](http://localhost:8000)

## Command Line Options

PyServe supports various command line options to override the configuration:

| Option | Description | Example |
|--------|-------------|---------|
| `-c, --config` | Path to configuration file | `python run.py -c ./my_config.yaml` |
| `-p, --port` | Port to run the server on | `python run.py -p 8080` |
| `-H, --host` | Host to bind to | `python run.py -H 0.0.0.0` |
| `-s, --static` | Directory for static files | `python run.py -s ./www/static` |
| `-t, --templates` | Directory for template files | `python run.py -t ./www/templates` |
| `-v, --version` | Show PyServe version and exit | `python run.py -v` |
| `-d, --debug` | Enable debug mode | `python run.py -d` |
| `--proxy` | Configure reverse proxy | `python run.py --proxy localhost:3000/api` |
| `--test` | Run tests | `python run.py --test all` |
| `--ssl` | Enable SSL/TLS | `python run.py --ssl --cert cert.pem --key key.pem` |
| `--vibe-serving` | Enable Vibe-Serving mode (AI-generated content) | `python run.py --vibe-serving` |
| `--skip-proxy-check` | Skip reverse proxy availability check at startup | `python run.py --skip-proxy-check` |

## Examples

### Running on all interfaces

To make the server accessible from other devices on your network:
```bash
python run.py -H 0.0.0.0 -p 8000
```

### Using custom directories

If your static files and templates are in a different location:
```bash
python run.py -s ./www/public -t ./www/views
```

### Setting up a reverse proxy

To proxy requests to a backend API server:
```bash
python run.py --proxy localhost:3000/api
```

### Running with SSL

To run PyServe with HTTPS encryption:
```bash
python run.py --ssl --cert ./ssl/cert.pem --key ./ssl/key.pem
```

### Vibe-Serving Mode

To enable AI-generated content mode:
```bash
python run.py --vibe-serving
```

Make sure you have configured `vibeconfig.yaml` and set your `OPENAI_API_KEY` environment variable.

:::warning Security Warning
When exposing PyServe to the internet, ensure you understand the security implications. PyServe is designed for development and internal use, not as a production web server.
:::

## Environment Variables

PyServe v0.4.2 supports environment variables for configuration:

| Environment Variable | Configuration Key | Default |
|---------------------|-------------------|---------|
| `PYSERVE_HOST` | server.host | 127.0.0.1 |
| `PYSERVE_PORT` | server.port | 8000 |
| `PYSERVE_STATIC_DIR` | http.static_dir | ./static |
| `PYSERVE_TEMPLATES_DIR` | http.templates_dir | ./templates |
| `PYSERVE_LOG_LEVEL` | logging.level | INFO |
| `PYSERVE_LOG_FILE` | logging.log_file | ./logs/pyserve.log |
| `PYSERVE_SSL_ENABLED` | ssl.enabled | false |
| `PYSERVE_SSL_CERT` | ssl.cert_file | ./ssl/cert.pem |
| `PYSERVE_SSL_KEY` | ssl.key_file | ./ssl/key.pem |

Example using environment variables:
```bash
export PYSERVE_PORT=8080
export PYSERVE_LOG_LEVEL=DEBUG
python run.py
```

## Testing Your Installation

PyServe includes a built-in testing framework to verify your installation:

```bash
# Test all components
python run.py --test all

# Test configuration only
python run.py --test configuration

# Test directories only
python run.py --test directories
```

The tests will verify:
- Configuration file loading and validation
- Required directory creation
- SSL configuration (if enabled)
- All mandatory and optional settings

## Next Steps

Now that you have PyServe running, you may want to:

- Learn how to [configure PyServe](configuration) using YAML files
- Understand how to [serve static files](../core-features/static-files)
- Explore [templating capabilities](../core-features/templates)
- Set up [reverse proxying](../core-features/reverse-proxy) to other services
- Configure [SSL/TLS encryption](../security-and-deployment/secure) for secure connections
- Customize the [logging system](../development-and-monitoring/logging)
