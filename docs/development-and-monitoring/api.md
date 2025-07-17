---
sidebar_position: 3
---

# API Reference

Complete API documentation of PyServe v0.4.2 for developers

## Core Components

PyServe v0.4.2 is built with a modular architecture, providing several core components that can be used independently or together.

### AsyncHTTPServer

```python
from pyserve import AsyncHTTPServer

server = AsyncHTTPServer(
    host="127.0.0.1",
    port=8000,
    static_dir="./static",
    template_dir="./templates",
    backlog=5,
    debug=False,
    redirections=[],
    reverse_proxy=[],
    locations={},
    ssl_cert=None,
    ssl_key=None,
    do_check_proxy_availability=True
)
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `host` | str | Host address to bind to | Required |
| `port` | int | Port number to listen on | Required |
| `static_dir` | str | Directory for static files | "./static" |
| `template_dir` | str | Directory for template files | "./templates" |
| `backlog` | int | Maximum connection queue size | 5 |
| `debug` | bool | Enable debug mode | False |
| `redirections` | List[Dict[str, str]] | URL redirection rules | None |
| `reverse_proxy` | List[Dict[str, Union[str, int]]] | Reverse proxy configuration | None |
| `locations` | Dict[str, Any] | Location-specific settings (auth, etc.) | None |
| `ssl_cert` | Optional[str] | Path to SSL certificate file | None |
| `ssl_key` | Optional[str] | Path to SSL private key file | None |
| `do_check_proxy_availability` | bool | Check proxy backends at startup | True |

## Configuration Management

```python
from pyserve import Configuration

config = Configuration(config_path="./config.yaml")

# Access configuration sections
server_config = config.server_config
http_config = config.http_config
logging_config = config.logging_config
ssl_config = config.ssl_config

# Get specific values
host = config.get("server", "host", default="127.0.0.1")
port = config.get("server", "port", default=8000)

# Set configuration values
config.set("server", "port", 8080)
config.save_config()
```

### Available Methods

| Method | Description | Returns |
|--------|-------------|---------|
| `get(section, key, default=None)` | Get configuration value | Any |
| `set(section, key, value)` | Set configuration value | None |
| `save_config()` | Save configuration to file | bool |
| `reload()` | Reload configuration from file | None |
| `validate()` | Validate configuration | Tuple[bool, List[str]] |

## Logging System

```python
from pyserve import get_logger

logger = get_logger(
    level="INFO",
    log_file="./logs/pyserve.log",
    console_output=True,
    use_colors=True,
    use_rotation=False,
    max_log_size=10485760,  # 10MB
    backup_count=5,
    structured_logs=False
)

# Using the logger
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical message")
```

### Custom Formatters

```python
from pyserve.core.logging import PyServeLogger, FileHandler, ConsoleHandler

# Create custom logger
logger = PyServeLogger(level="DEBUG")

# Add custom handlers
file_handler = FileHandler(
    'custom.log',
    level="INFO",
    structured=True
)
logger.logger.addHandler(file_handler)

console_handler = ConsoleHandler(
    level="DEBUG",
    use_colors=True
)
```

## HTTP Handlers

### Static File Handler

```python
from pyserve.http.handlers.static import StaticFileHandler

handler = StaticFileHandler(
    static_dir="./static",
    debug=False
)
```

### Template Handler

```python
from pyserve.http.handlers.templates import TemplateHandler
from pyserve.template.engine import AsyncTemplateEngine

engine = AsyncTemplateEngine("./templates")
handler = TemplateHandler(engine)
```

### Authentication Handler

```python
from pyserve.http.handlers.auth.basic import HTTPBasicAuthHandler

auth_handler = HTTPBasicAuthHandler(
    username="admin",
    password="secretpass"
)
```

### Proxy Handler

```python
from pyserve.http.handlers.proxy import ProxyHandler

handler = ProxyHandler([
    {
        "path": "/api",
        "host": "localhost",
        "port": 3000
    }
])
```

## Request and Response Objects

### HTTPRequest

```python
from pyserve.http.request import HTTPRequest

# Request properties
request.method      # HTTP method (GET, POST, etc.)
request.path        # Request path
request.headers     # Request headers (dict)
request.query       # Query parameters (dict)
request.body        # Request body (bytes)
request.is_valid()  # Validate request format
```

### HTTPResponse

```python
from pyserve.http.response import HTTPResponse

# Create responses
response = HTTPResponse(
    status_code=200,
    headers={},
    body="Hello World"
)

# Helper methods
response = HTTPResponse.ok("Success")
response = HTTPResponse.not_found("Page not found")
response = HTTPResponse.unauthorized("Access denied")
response = HTTPResponse.redirect("/new-location")
response = HTTPResponse.internal_error("Server error")
```

## SSL Configuration

```python
from pyserve import SSLConfiguration

ssl_config = SSLConfiguration({
    "enabled": True,
    "cert_file": "./ssl/cert.pem",
    "key_file": "./ssl/key.pem"
})

# Check SSL configuration
if ssl_config.is_properly_configured():
    print("SSL is properly configured")
```

## Testing Utilities

```python
from pyserve import TestConfiguration

test_config = TestConfiguration()

# Run specific tests
test_config.test_load_config()
test_config.test_configuration()
test_config.test_static_directories()

# Run all tests
test_config.run_all_tests()
```

## Error Handling

PyServe provides a set of custom exceptions for better error handling:

```python
from pyserve.core.exceptions import (
    ConfigurationError,
    PyServeYAMLException
)
```

:::info
**Note:** All PyServe exceptions inherit from the base `Exception` class.
:::

## Vibe-Serving Components

New in v0.4.2: AI-powered content generation components for dynamic web pages.

### VibeService

```python
from pyserve.vibe.service import VibeService
from pyserve.vibe.vibe_config import VibeConfig
from pyserve import Configuration, AsyncHTTPServer

# Initialize components
config = Configuration()
vibe_config = VibeConfig()
vibe_config.load_config('vibeconfig.yaml')
server = AsyncHTTPServer(...)

# Create and run Vibe service
vibe_service = VibeService(server, config, vibe_config)
runner = await vibe_service.run()
```

### VibeLLMClient

```python
from pyserve.vibe.llm import VibeLLMClient

# Initialize with default OpenAI
client = VibeLLMClient(model="gpt-4")

# Initialize with custom API
client = VibeLLMClient(
    api_url="https://api.custom-llm.com/v1",
    api_key="your-key",
    model="custom-model"
)

# Generate content
html_content = await client.generate(
    prompt="Create a beautiful landing page",
    timeout=30
)
```

### VibeCache

```python
from pyserve.vibe.cache import VibeCache

cache = VibeCache(base_dir="./cache")

# Check cache
content = cache.get("/about", ttl=3600)

# Set cache
cache.set("/about", html_content)
```

### VibeConfig

```python
from pyserve.vibe.vibe_config import VibeConfig

config = VibeConfig()
config.load_config('vibeconfig.yaml')

# Get prompt for a route
prompt = config.get_prompt("/about")

# Get settings
timeout = config.get_timeout()
api_url = config.get_api_url()
```
