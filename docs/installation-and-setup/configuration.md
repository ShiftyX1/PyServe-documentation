---
sidebar_position: 2
---

# Configuration

Learn how to configure PyServe v0.4.2 using the new V2 configuration system with extensions support

## Configuration Overview

PyServe features a revolutionary V2 configuration system with **full backward compatibility**. You can use traditional V1 configurations or leverage the powerful new V2 extensions system for advanced functionality.

:::info
**V2 Features:** Regex routing, SPA support, modular extensions, external configuration files, and much more!
:::

:::warning
**Migration:** All existing V1 configurations continue to work without changes. Adding `version: 2` unlocks new features.
:::

## Configuration Formats

### V1 Configuration (Legacy - Still Supported)

Your existing configurations continue to work exactly as before:

```yaml
server:
  host: 127.0.0.1
  port: 8000
  backlog: 5
  redirect_instructions:
    - /home: /index.html
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
```

### V2 Configuration (Recommended)

The new V2 system adds powerful extensions while maintaining full V1 compatibility:

```yaml
version: 2

# Core modules (same as V1)
server:
  host: 0.0.0.0
  port: 8080

http:
  static_dir: ./static
  templates_dir: ./templates

ssl:
  enabled: false

logging:
  level: INFO

# NEW: Extensions system
extensions:
  - type: routing
    config:
      regex_locations:
        # API with version capture
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # Static files with caching
        "~*\\.(js|css|png|jpg)$":
          root: "./static"
          cache_control: "max-age=31536000"
        
        # Health check
        "=/health":
          return: "200 OK"
        
        # SPA fallback
        "__default__":
          spa_fallback: true
          root: "./dist"
```

## V2 Extensions System

### Routing Extension

Advanced routing with regex patterns and SPA support:

```yaml
extensions:
  - type: routing
    config:
      regex_locations:
        # Pattern types (nginx-style priorities):
        
        # 1. Exact match (highest priority)
        "=/health":
          return: "200 OK"
          content_type: "text/plain"
        
        # 2. Regex case-sensitive  
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # 3. Regex case-insensitive
        "~*\\.(js|css|png|jpg|gif|ico|svg)$":
          root: "./static"
          cache_control: "public, max-age=31536000"
        
        # 4. SPA fallback (lowest priority)
        "__default__":
          spa_fallback: true
          root: "./dist"
          index_file: "index.html"
          exclude_patterns:
            - "/api/"
            - "/admin/"
```

#### Pattern Types & Priorities

| Pattern | Priority | Description | Example |
|---------|----------|-------------|---------|
| `=/path` | 1 (Highest) | Exact match | `=/health` |
| `~^/pattern` | 2 | Regex case-sensitive | `~^/api/` |
| `~*\\.ext$` | 3 | Regex case-insensitive | `~*\\.(js\|css)$` |
| `^~/path` | 4 | Prefix match | `^~/static/` |
| `__default__` | 5 (Lowest) | SPA fallback | Single Page Apps |

### External Extensions

Load extensions from separate files for better organization:

```yaml
# config.yaml
extensions:
  - type: security
    source: ./config/extensions/security.yaml
  
  - type: caching
    source: ./config/extensions/caching.yaml
```

```yaml
# config/extensions/security.yaml
type: security
config:
  cors:
    enabled: true
    origins: ["https://mydomain.com"]
    methods: ["GET", "POST", "PUT", "DELETE"]
  
  rate_limiting:
    enabled: true
    requests_per_minute: 60
    burst: 10
```

## Core Configuration Sections

These sections work the same in both V1 and V2 configurations:

### Server Configuration

The `server` section contains core server settings:

| Option | Description | Default |
|--------|-------------|---------|
| `host` | Host to bind the server to | 127.0.0.1 |
| `port` | Port number to listen on | 8000 |
| `backlog` | Maximum connection queue size | 5 |
| `redirect_instructions` | URL redirection rules (V1 only) | See V1 examples |
| `reverse_proxy` | Reverse proxy configuration (V1 only) | See V1 examples |

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

PyServe v0.4.2 supports environment variables for configuration overrides:

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

PyServe v0.4.2 includes built-in configuration validation for both V1 and V2 formats:

```bash
# Validate configuration
python run.py --test configuration

# Run all tests including configuration
python run.py --test all

# Check V2 extensions
python -c "
from pyserve.configuration import Configuration
config = Configuration('./config.yaml')
print(f'Version: {config.get_config_version()}')
print(f'Extensions: {list(config.extensions.keys())}')
"
```

The validator checks:
- Required field presence
- Data type correctness
- Value ranges (e.g., port numbers)
- File and directory existence
- SSL certificate validity
- **V2 NEW:** Extension configuration validation
- **V2 NEW:** Regex pattern syntax validation
- **V2 NEW:** External module file validation

:::info
**V2 Graceful Degradation:** Invalid extensions are skipped with warnings, core functionality continues working.
:::

:::tip
**Tip:** Always validate your configuration after making changes, especially in production environments.
:::

## V2 Configuration Examples

### Simple SPA Application

```yaml
version: 2

server:
  host: 0.0.0.0
  port: 8080

http:
  static_dir: ./static

extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/":
          proxy_pass: "http://localhost:3000"
        "__default__":
          spa_fallback: true
          root: "./dist"
```

### Microservices Gateway

```yaml
version: 2

server:
  host: 0.0.0.0
  port: 8080

extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/users/":
          proxy_pass: "http://user-service:3001"
        "~^/api/orders/":
          proxy_pass: "http://order-service:3002"
        "~^/api/payments/":
          proxy_pass: "http://payment-service:3003"
        "=/health":
          return: "200 OK"
        "~*\\.(js|css|png)$":
          root: "./static"
          cache_control: "max-age=31536000"
```

## Migration from V1 to V2

:::info
**Zero-breaking migration:** Add `version: 2` to your existing config and it will work exactly the same!
:::

### Step 1: Basic Migration

Simply add `version: 2` to your existing V1 configuration:

```yaml
# Before (V1)
server:
  host: 127.0.0.1
  port: 8000

# After (V2 - same functionality)
version: 2

server:
  host: 127.0.0.1
  port: 8000
```

### Step 2: Convert Simple Routing

Optionally convert V1 locations to V2 routing extension:

```yaml
# Before (V1)
server:
  reverse_proxy:
    - path: /api
      host: localhost
      port: 3000

# After (V2)
extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/":
          proxy_pass: "http://localhost:3000"
```

### Step 3: Add Advanced Features

Leverage new V2 capabilities like SPA support and regex routing:

```yaml
extensions:
  - type: routing
    config:
      regex_locations:
        # Parameter capture
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # Static file caching
        "~*\\.(js|css|png)$":
          root: "./static"
          cache_control: "max-age=31536000"
        
        # SPA fallback
        "__default__":
          spa_fallback: true
          root: "./dist"
```

## Available Extensions

### Built-in Extensions

#### Routing Extension
- **Regex patterns** with nginx-style priorities
- **Parameter capture** from URLs
- **SPA fallback** for modern web applications
- **Static file handling** with caching rules
- **Health check endpoints**

#### Security Extension (External)
- **CORS** configuration
- **Rate limiting** with rules per endpoint
- **CSRF protection**
- **Security headers**
- **IP filtering**

#### Caching Extension (External)
- **Redis backend** support
- **Memory caching**
- **TTL rules** per route pattern
- **Cache invalidation**

#### Monitoring Extension (External)
- **Metrics endpoint** (/metrics)
- **Health checks** with custom checks
- **Performance monitoring**
- **Request logging**

## URL Redirection Configuration (V1 Only)

For V1 configurations, configure URL redirects using the `redirect_instructions` setting:

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

## Reverse Proxy Configuration (V1 Only)

For V1 configurations, configure reverse proxy settings using the `reverse_proxy` section:

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

## Example: Advanced V2 Configuration

Here's an example of a production-ready V2 configuration file:

```yaml
version: 2

server:
  host: 0.0.0.0
  port: 443
  backlog: 50

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

extensions:
  # Advanced routing with microservices
  - type: routing
    config:
      regex_locations:
        # API Gateway with version routing
        "~^/api/v(?P<version>\\d+)/users/":
          proxy_pass: "http://user-service:3001"
          headers:
            - "API-Version: {version}"
            - "X-Service: users"
        
        "~^/api/v(?P<version>\\d+)/orders/":
          proxy_pass: "http://order-service:3002"
          headers:
            - "API-Version: {version}"
            - "X-Service: orders"
        
        # Static assets with aggressive caching
        "~*\\.(js|css|png|jpg|gif|ico|svg|woff2?)$":
          root: "/var/www/static"
          cache_control: "public, max-age=31536000, immutable"
          headers:
            - "Access-Control-Allow-Origin: *"
        
        # Health and monitoring endpoints
        "=/health":
          return: "200 OK"
          content_type: "application/json"
        
        "=/metrics":
          proxy_pass: "http://monitoring:9090"
        
        # SPA with modern routing
        "__default__":
          spa_fallback: true
          root: "/var/www/app"
          index_file: "index.html"
          exclude_patterns:
            - "/api/"
            - "/admin/"
            - "/metrics"
            - "/health"

  # Security configuration
  - type: security
    source: /etc/pyserve/extensions/security.yaml

  # Redis caching
  - type: caching
    config:
      backend: redis
      url: "redis://cache-cluster:6379"
      default_ttl: 3600
      rules:
        "~*\\.(js|css)$": 86400    # 1 day for assets
        "~^/api/": 300             # 5 minutes for API
        "~^/health": 60            # 1 minute for health

  # Monitoring and metrics
  - type: monitoring
    config:
      metrics:
        enabled: true
        endpoint: "/internal/metrics"
      health_checks:
        - path: "/internal/health"
          checks: ["database", "redis", "external_api"]
```

:::success
**Production Ready:** This configuration supports high-traffic production workloads with microservices, caching, security, and monitoring.
:::

## Modular Configuration

PyServe v0.4.2 introduces advanced modular configuration management:

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
**New in v0.4.2:** The Configuration class now supports hot reloading, validation, programmatic modification, and V2 extensions management.
:::

## Configuration Best Practices

### V2 Configuration Organization

```
project/
├── config.yaml                 # Main V2 configuration
├── config/
│   └── extensions/
│       ├── security.yaml       # Security module
│       ├── caching.yaml        # Caching module
│       └── monitoring.yaml     # Monitoring module
├── static/                     # Static files
├── dist/                       # SPA build output
└── logs/                       # Log files
```

### Development vs Production

Use different configuration files for different environments:

```bash
# Development (V2)
python run.py -c config-dev.yaml

# Staging (V2)  
python run.py -c config-staging.yaml

# Production (V2)
python run.py -c /etc/pyserve/config-prod.yaml
```

### V2 Migration Strategy

1. **Start Safe:** Add `version: 2` to existing config
2. **Test Extensively:** Verify all existing functionality works
3. **Migrate Gradually:** Convert simple routes to routing extension
4. **Add Features:** Implement SPA support, parameter capture
5. **Modularize:** Move complex configurations to external files

### Security Considerations

- Never commit sensitive data (SSL keys, passwords) to version control
- Use environment variables for sensitive configuration
- Set restrictive file permissions on configuration files
- Validate all configuration values, especially regex patterns
- **V2 NEW:** Use security extension for CORS, rate limiting
- **V2 NEW:** Leverage parameter validation in routing patterns

### Performance Tuning

- Increase `backlog` for high-traffic scenarios
- Enable log rotation to prevent disk space issues
- Use structured logs for better analysis tools
- Disable console output in production
- **V2 NEW:** Use caching extension for performance
- **V2 NEW:** Optimize regex patterns for speed
- **V2 NEW:** Set appropriate cache-control headers

## Vibe-Serving Configuration

When using `--vibe-serving` mode, PyServe uses a separate `vibeconfig.yaml` file for AI-generated content configuration. This mode works independently of V1/V2 configuration systems.

:::info
**AI Integration:** Vibe-Serving can work alongside V2 routing extensions for advanced AI-powered web applications.
:::

```yaml
routes:
  "/": "Generate a modern landing page for PyServe with hero section and features"
  "/about": "Create an about page describing PyServe project"
  "/contact": "Generate a contact page with form"
  "/docs": "Create a documentation page with navigation"
  "/api/demo": "Generate a JSON API response with demo data"

settings:
  cache_ttl: 3600              # Cache time in seconds
  model: "claude-3.5-sonnet"   # AI model to use  
  timeout: 3600                # Request timeout in seconds
  api_url: "https://bothub.chat/api/v2/openai/v1"  # Custom API endpoint
  fallback_enabled: true       # Enable fallback to error page
  
  # NEW: V2 Integration
  enable_v2_routing: false     # Use V2 routing alongside Vibe-Serving
  static_fallback: true        # Fall back to static files if AI fails
```

### Routes Section

Define URL paths and their corresponding prompts for AI content generation:
- **Key:** URL path (e.g., `/about`)
- **Value:** Prompt to send to AI model for generating the page
- Each request to a configured route will generate HTML content using the prompt
- **NEW:** Support for JSON API endpoints with structured prompts

### Settings Section

| Option | Description | Default |
|--------|-------------|---------|
| `cache_ttl` | How long to cache generated pages (seconds) | 3600 |
| `model` | AI model to use for generation | gpt-3.5-turbo |
| `timeout` | Max time to wait for AI response (seconds) | 20 |
| `api_url` | Custom API endpoint (for non-OpenAI models) | null |
| `fallback_enabled` | Show error page when AI generation fails | true |
| `enable_v2_routing` | Use V2 routing system alongside Vibe-Serving | false |
| `static_fallback` | Fall back to static files when AI fails | true |

### Hybrid V2 + Vibe-Serving Configuration

Combine V2 routing with AI-generated content for maximum flexibility:

```yaml
# config.yaml (V2)
version: 2

server:
  host: 0.0.0.0
  port: 8080

extensions:
  - type: routing
    config:
      regex_locations:
        # Static API routes
        "~^/api/health":
          return: "200 OK"
        
        # Proxy to backend services
        "~^/api/v1/":
          proxy_pass: "http://backend:3000"
        
        # Static assets
        "~*\\.(js|css|png)$":
          root: "./static"
        
        # AI-generated content for everything else
        "__default__":
          vibe_serving: true  # NEW: Delegate to Vibe-Serving

# vibeconfig.yaml (AI content)
routes:
  "/": "Create a modern dashboard with widgets"
  "/profile": "Generate a user profile page"
  "/reports": "Create a reports page with charts"

settings:
  enable_v2_routing: true  # Work with V2 routing
  cache_ttl: 1800         # Shorter cache for dynamic content
```

:::warning
**Environment Variables:** You must set `OPENAI_API_KEY` in your environment or `.env` file for Vibe-Serving to work.
:::
