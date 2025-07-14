---
sidebar_position: 2
---

# Configuration

PyServe offers flexible configuration options through YAML files to customize your server behavior.

## Configuration File

Create a `config.yaml` file in your project root:

```yaml
server:
  host: "0.0.0.0"          # Server host
  port: 8000               # Server port
  static_dir: "./static"   # Directory to serve static files from
  
logging:
  level: "INFO"            # Log level: DEBUG, INFO, WARNING, ERROR
  format: "detailed"       # Log format: simple, detailed
  
security:
  https: false             # Enable HTTPS
  ssl_cert: ""            # Path to SSL certificate
  ssl_key: ""             # Path to SSL private key
```

## Configuration Options

### Server Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | string | `"localhost"` | The hostname to bind the server to |
| `port` | integer | `8000` | The port number to listen on |
| `static_dir` | string | `"./static"` | Directory containing static files |

### Logging Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | string | `"INFO"` | Minimum log level to display |
| `format` | string | `"simple"` | Log output format |

### Security Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `https` | boolean | `false` | Enable HTTPS protocol |
| `ssl_cert` | string | `""` | Path to SSL certificate file |
| `ssl_key` | string | `""` | Path to SSL private key file |

## Usage

Start the server with configuration:

```bash
python run.py --config config.yaml
```

Or load configuration programmatically:

```python
from pyserve import PyServe

server = PyServe(config_file="config.yaml")
server.start()
```
