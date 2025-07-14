---
sidebar_position: 2
---

# Configuration

Learn how to configure PyServe v0.4.1 using YAML files and environment variables

## Configuration Overview

PyServe uses YAML configuration files for setting up the server. By default, the server looks for a `config.yaml` file in the current directory, but you can specify a different location using the `-c` or `--config` option.

:::info
**Note:** Command line arguments always override configuration file settings, and environment variables override configuration files but not command line arguments.
:::

## Default Configuration

When you first run PyServe, it creates a default `config.yaml` file with the following structure:

```yaml
server:
  host: 127.0.0.1
  port: 8000
  backlog: 5
  redirect_instructions:
    - /home: /index.html
    - /docs: /docs.html
  reverse_proxy:
    - path: /api
      host: localhost
      port: 3000

http:
  static_dir: ./static
  templates_dir: ./templates

ssl:
  enabled: false
  cert_file: ./ssl/cert.pem
  key_file: ./ssl/key.pem

logging:
  level: INFO
  log_file: ./logs/pyserve.log
  console_output: true
  use_colors: true
  use_rotation: false
  max_log_size: 10485760  # 10 MB
  backup_count: 5
  structured_logs: false
```

## Configuration Sections

### Server Configuration

The `server` section contains core server settings:

| Option | Description | Default |
|--------|-------------|---------|
| `host` | Host to bind the server to | 127.0.0.1 |
| `port` | Port number to listen on | 8000 |
| `backlog` | Maximum connection queue size | 5 |
| `redirect_instructions` | URL redirection rules | See example above |
| `reverse_proxy` | Reverse proxy configuration | See example above |

### HTTP Configuration

The `http` section configures how the HTTP server handles files:

| Option | Description | Default |
|--------|-------------|---------|
| `static_dir` | Directory for static files | ./static |
| `templates_dir` | Directory for template files | ./templates |

### SSL Configuration

The `ssl` section controls SSL/TLS settings:

| Option | Description | Default |
|--------|-------------|---------|
| `enabled` | Enable/disable SSL | false |
| `cert_file` | Path to SSL certificate file | ./ssl/cert.pem |
| `key_file` | Path to SSL private key file | ./ssl/key.pem |

### Logging Configuration

The `logging` section controls the server logging behavior:

| Option | Description | Default |
|--------|-------------|---------|
| `level` | Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | INFO |
| `log_file` | Path to the log file | ./logs/pyserve.log |
| `console_output` | Whether to output logs to console | true |
| `use_colors` | Enable colored console output | true |
| `use_rotation` | Enable log rotation | false |
| `max_log_size` | Maximum log file size (bytes) | 10485760 |
| `backup_count` | Number of backup log files | 5 |
| `structured_logs` | Enable JSON structured logging | false |

## Environment Variables

PyServe v0.4.1 supports environment variables for configuration overrides:

```bash
# Example: Override host and port
export PYSERVE_HOST=0.0.0.0
export PYSERVE_PORT=9000
python run.py

# Example: Enable SSL
export PYSERVE_SSL_ENABLED=true
export PYSERVE_SSL_CERT=/path/to/cert.pem
export PYSERVE_SSL_KEY=/path/to/key.pem
python run.py
```

Available environment variables:
- `PYSERVE_HOST` - Server host
- `PYSERVE_PORT` - Server port
- `PYSERVE_STATIC_DIR` - Static files directory
- `PYSERVE_TEMPLATES_DIR` - Template files directory
- `PYSERVE_LOG_LEVEL` - Logging level
- `PYSERVE_LOG_FILE` - Log file path
- `PYSERVE_SSL_ENABLED` - Enable SSL (true/false)
- `PYSERVE_SSL_CERT` - SSL certificate file
- `PYSERVE_SSL_KEY` - SSL key file

## Configuration Validation

PyServe v0.4.1 includes a built-in configuration validator:

```bash
# Validate configuration
python run.py --test configuration

# Run all tests including configuration
python run.py --test all
```

The validator checks:
- Required field presence
- Data type correctness
- Value ranges (e.g., port numbers)
- File and directory existence
- SSL certificate validity

:::tip
**Tip:** Always validate your configuration after making changes, especially in production environments.
:::

## URL Redirection Configuration

Configure URL redirects using the `redirect_instructions` setting:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /blog: https://example.com/blog
    - /docs: /documentation.html
    - /api/v1: /api/v2  # Redirect old API versions
```

This configuration will:
- Redirect `/home` to `/index.html` on the same server
- Redirect `/blog` to `https://example.com/blog` (external URL)
- Redirect `/docs` to `/documentation.html` on the same server
- Redirect `/api/v1` to `/api/v2` for API versioning

## Reverse Proxy Configuration

Configure reverse proxy settings using the `reverse_proxy` section:

```yaml
server:
  reverse_proxy:
    - path: /api
      host: localhost
      port: 3000
    - path: /admin
      host: admin-server
      port: 8080
    - path: /websocket
      host: ws-server
      port: 8765
```

This configuration will:
- Forward all requests starting with `/api` to `localhost:3000`
- Forward all requests starting with `/admin` to `admin-server:8080`
- Forward all requests starting with `/websocket` to `ws-server:8765`

:::info
**Note:** PyServe automatically adds appropriate headers like `X-Forwarded-For`, `X-Forwarded-Host`, and `X-Forwarded-Proto` to the proxied requests.
:::

## Example: Advanced Configuration

Here's an example of a more complex configuration file:

```yaml
server:
  host: 0.0.0.0
  port: 443
  backlog: 50
  redirect_instructions:
    - /: /index.html
    - /help: /documentation.html
    - /old-api: https://api-v2.example.com
  reverse_proxy:
    - path: /api/v2
      host: api-server
      port: 8001
    - path: /admin
      host: admin-panel
      port: 8002
    - path: /ws
      host: websocket-server
      port: 8765

http:
  static_dir: /var/www/static
  templates_dir: /var/www/templates

ssl:
  enabled: true
  cert_file: /etc/ssl/certs/example.com.crt
  key_file: /etc/ssl/private/example.com.key

logging:
  level: INFO
  log_file: /var/log/pyserve/server.log
  console_output: false
  use_colors: false
  use_rotation: true
  max_log_size: 52428800  # 50 MB
  backup_count: 10
  structured_logs: true
```

This production-ready configuration:
- Runs on all interfaces on port 443 (HTTPS)
- Enables SSL with production certificates
- Uses larger connection backlog for high-traffic scenarios
- Implements multiple redirects and reverse proxies
- Enables log rotation with structured JSON logs
- Disables console output for production efficiency

## Modular Configuration

PyServe v0.4.1 introduces modular configuration management:

```python
# Load configuration programmatically
from pyserve import Configuration

# Create configuration object
config = Configuration('/path/to/config.yaml')

# Add a reverse proxy programmatically
config.add_reverse_proxy('/newapi', 'api-server', 9000)

# Configure SSL programmatically
config.configure_ssl(
    enabled=True,
    cert_file='/path/to/cert.pem',
    key_file='/path/to/key.pem'
)

# Save changes to file
config.save_config()
```

:::info
**New in v0.4.1:** The Configuration class now supports hot reloading, validation, and programmatic modification.
:::

## Configuration Best Practices

### Development vs Production

Use different configuration files for different environments:

```bash
# Development
python run.py -c config-dev.yaml

# Staging
python run.py -c config-staging.yaml

# Production
python run.py -c /etc/pyserve/config-prod.yaml
```

### Security Considerations

- Never commit sensitive data (SSL keys, passwords) to version control
- Use environment variables for sensitive configuration
- Set restrictive file permissions on configuration files
- Validate all configuration values

### Performance Tuning

- Increase `backlog` for high-traffic scenarios
- Enable log rotation to prevent disk space issues
- Use structured logs for better analysis tools
- Disable console output in production

## Vibe-Serving Configuration

When using `--vibe-serving` mode, PyServe uses a separate `vibeconfig.yaml` file for AI-generated content configuration:

```yaml
routes:
  "/": "Generate a modern landing page for PyServe with hero section and features"
  "/about": "Create an about page describing PyServe project"
  "/contact": "Generate a contact page with form"
  "/docs": "Create a documentation page with navigation"

settings:
  cache_ttl: 3600              # Cache time in seconds
  model: "claude-3.5-sonnet"   # AI model to use  
  timeout: 3600                # Request timeout in seconds
  api_url: "https://bothub.chat/api/v2/openai/v1"  # Custom API endpoint
  fallback_enabled: true       # Enable fallback to error page
```

### Routes Section

Define URL paths and their corresponding prompts for AI content generation:
- **Key:** URL path (e.g., `/about`)
- **Value:** Prompt to send to AI model for generating the page
- Each request to a configured route will generate HTML content using the prompt

### Settings Section

| Option | Description | Default |
|--------|-------------|---------|
| `cache_ttl` | How long to cache generated pages (seconds) | 3600 |
| `model` | AI model to use for generation | gpt-3.5-turbo |
| `timeout` | Max time to wait for AI response (seconds) | 20 |
| `api_url` | Custom API endpoint (for non-OpenAI models) | null |
| `fallback_enabled` | Show error page when AI generation fails | true |

:::info
**Environment Variables:** You must set `OPENAI_API_KEY` in your environment or `.env` file for Vibe-Serving to work.
:::
