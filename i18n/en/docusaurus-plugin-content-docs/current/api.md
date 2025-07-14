---
sidebar_position: 3
---

# API Reference

Complete API documentation for PyServe classes and methods.

## PyServe Class

Main server class for creating and managing HTTP servers.

### Constructor

```python
PyServe(host="localhost", port=8000, static_dir="./static", config_file=None)
```

**Parameters:**
- `host` (str): Server hostname
- `port` (int): Server port number
- `static_dir` (str): Path to static files directory
- `config_file` (str): Path to YAML configuration file

### Methods

#### start()

Start the HTTP server.

```python
server.start()
```

**Returns:** None

#### stop()

Stop the HTTP server gracefully.

```python
server.stop()
```

**Returns:** None

#### add_route(path, handler)

Add a custom route handler.

```python
server.add_route("/api/status", status_handler)
```

**Parameters:**
- `path` (str): URL path pattern
- `handler` (callable): Request handler function

#### set_static_dir(directory)

Change the static files directory.

```python
server.set_static_dir("./public")
```

**Parameters:**
- `directory` (str): Path to new static directory

## Configuration Class

Handle server configuration management.

### Methods

#### load_config(file_path)

Load configuration from YAML file.

```python
config = Configuration.load_config("config.yaml")
```

**Parameters:**
- `file_path` (str): Path to configuration file

**Returns:** dict - Configuration dictionary

## Logger Class

Built-in logging functionality.

### Methods

#### log_request(request, response)

Log HTTP request and response details.

```python
logger.log_request(request, response)
```

**Parameters:**
- `request`: HTTP request object
- `response`: HTTP response object

## Examples

### Basic Usage

```python
from pyserve import PyServe

# Create server instance
server = PyServe(host="0.0.0.0", port=8080)

# Start server
server.start()
```

### With Configuration File

```python
from pyserve import PyServe

# Load from config file
server = PyServe(config_file="server_config.yaml")
server.start()
```

### Custom Route Handler

```python
def api_handler(request):
    return {
        "status": "ok",
        "message": "API is running"
    }

server = PyServe()
server.add_route("/api/health", api_handler)
server.start()
```
