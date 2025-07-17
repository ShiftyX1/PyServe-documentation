---
sidebar_position: 1
---

# Logging

Learn how to configure and use the enhanced PyServe v0.4.2 logging system

## Logging Overview

PyServe v0.4.2 includes a completely redesigned logging system with enhanced features:

- Modular logging architecture with separate formatters and handlers
- Colored console output for better visibility
- Structured JSON logging for production environments
- Log rotation capabilities to manage file size
- Configurable log levels and destinations
- Performance-optimized logging for async environments

:::info
**New in 0.3-async:** Complete logging system rewrite with support for structured logging, rotation, and advanced formatting options.
:::

## Configuring Logging

PyServe's logging behavior is configured in the `logging` section of your `config.yaml` file:

```yaml
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

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `level` | Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL) | INFO |
| `log_file` | Path to the log file | ./logs/pyserve.log |
| `console_output` | Whether to output logs to console | true |
| `use_colors` | Enable colored console output | true |
| `use_rotation` | Enable log rotation | false |
| `max_log_size` | Maximum log file size (bytes) | 10485760 (10 MB) |
| `backup_count` | Number of backup log files | 5 |
| `structured_logs` | Enable JSON structured logging | false |

## Log Levels

Available log levels, from most to least verbose:

| Level | Use Case | Color |
|-------|----------|-------|
| `DEBUG` | Detailed information, typically useful only for diagnosing problems | Cyan |
| `INFO` | Confirmation that things are working as expected | Green |
| `WARNING` | Indication that something unexpected happened | Yellow |
| `ERROR` | Due to a more serious problem, the software has not been able to perform some function | Red |
| `CRITICAL` | A serious error, indicating that the program itself may be unable to continue running | Bold Red |

## Console Logging

PyServe's console logging includes colorized output and custom formatting:

```
[PyServe] 2025-05-08 14:30:45 [INFO] Server running at http://127.0.0.1:8000/
[PyServe] 2025-05-08 14:30:45 [INFO] Static files directory: /path/to/static
[PyServe] 2025-05-08 14:30:45 [INFO] Template files directory: /path/to/templates
[PyServe] 2025-05-08 14:30:52 [INFO] Client connected from 127.0.0.1:54321
[PyServe] 2025-05-08 14:30:52 [INFO] [GET] | / from 127.0.0.1:54321
[PyServe] 2025-05-08 14:30:52 [INFO] User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
[PyServe] 2025-05-08 14:30:55 [DEBUG] Serving static file: /path/to/static/css/styles.css (text/css)
[PyServe] 2025-05-08 14:31:02 [WARNING] File not found: /path/to/static/nonexistent
```

### Custom Console Colors

Customize console colors by modifying the formatter configuration:

```python
# Example: Custom colored formatter
from pyserve.core.logging import ColoredFormatter

formatter = ColoredFormatter()
formatter.LEVEL_COLORS['INFO'] = COLORS['BLUE']  # Change INFO to blue
```

## File Logging

File logs use a standard format without colors for better parsing:

```
[2025-05-08 14:30:45] [INFO] Server running at http://127.0.0.1:8000/
[2025-05-08 14:30:45] [INFO] Static files directory: /path/to/static
[2025-05-08 14:30:45] [INFO] Template files directory: /path/to/templates
[2025-05-08 14:30:52] [INFO] Client connected from 127.0.0.1:54321
[2025-05-08 14:30:52] [INFO] [GET] | / from 127.0.0.1:54321
```

### Log Rotation

Enable log rotation to prevent log files from growing too large:

```yaml
logging:
  use_rotation: true
  max_log_size: 52428800  # 50 MB
  backup_count: 10
```

This configuration will:
- Create rotating log files (pyserve.log, pyserve.log.1, pyserve.log.2, etc.)
- Rotate logs when they reach 50 MB
- Keep up to 10 backup files

## Structured Logging

PyServe 0.3-async introduces structured JSON logging for better log analysis:

```yaml
logging:
  structured_logs: true
```

Example structured log output:

```json
{
  "timestamp": "2025-05-08 14:30:45",
  "level": "INFO",
  "logger": "pyserve",
  "message": "Server running at http://127.0.0.1:8000/",
  "module": "http.server",
  "function": "start",
  "line": 156
}

{
  "timestamp": "2025-05-08 14:30:52",
  "level": "INFO",
  "logger": "pyserve",
  "message": "[GET] | / from 127.0.0.1:54321",
  "module": "http.server",
  "function": "handle_request",
  "line": 243,
  "request_id": "req_abc123",
  "client_ip": "127.0.0.1",
  "method": "GET",
  "path": "/",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}
```

:::tip
**Tip:** Structured logs are ideal for integration with log analysis tools like ELK Stack, Splunk, or Grafana Loki.
:::

## Debug Mode

Enable debug mode for more verbose logging:

### Command Line
```bash
python run.py -d
```

### Configuration File
```yaml
logging:
  level: DEBUG
```

### Environment Variable
```bash
export PYSERVE_LOG_LEVEL=DEBUG
python run.py
```

### What Debug Mode Logs

- Request/response details
- Static file serving operations
- Template rendering processes
- Reverse proxy operations
- Configuration loading details
- Internal server state changes

## Using the Logger

When extending PyServe or creating custom handlers, use the logger directly:

```python
from pyserve import get_logger

# Create a logger with custom settings
logger = get_logger(
    level=logging.DEBUG,
    log_file='./my-custom.log',
    use_rotation=True,
    structured_logs=True
)

# Use the logger
logger.info("Application started")
logger.debug("Processing request")
logger.warning("Unusual parameter received")
logger.error("Failed to connect to database")
logger.critical("Server cannot continue")

# Log exceptions with traceback
try:
    risky_operation()
except Exception as e:
    logger.exception("Operation failed")
```

### Advanced Logger Configuration

```python
from pyserve.core.logging import PyServeLogger, FileHandler, ConsoleHandler

# Create custom logger with multiple handlers
logger = PyServeLogger(level=logging.DEBUG)

# Add custom file handler
file_handler = FileHandler(
    'custom.log',
    level=logging.INFO,
    structured=True
)
logger.logger.addHandler(file_handler)

# Add custom console handler
console_handler = ConsoleHandler(
    level=logging.DEBUG,
    use_colors=True
)
logger.logger.addHandler(console_handler)
```

## Log Analysis Examples

### Filter logs by level
```bash
# Show only errors and critical messages
grep -E '\[ERROR\]|\[CRITICAL\]' ./logs/pyserve.log

# Show only request logs
grep '\[GET\]\|\[POST\]\|\[PUT\]\|\[DELETE\]' ./logs/pyserve.log
```

### Analyze structured logs with jq
```bash
# Show all ERROR level logs
jq 'select(.level == "ERROR")' ./logs/pyserve.log

# Show logs for specific client IP
jq 'select(.client_ip == "192.168.1.100")' ./logs/pyserve.log

# Get request statistics
jq -s 'group_by(.method) | map({method: .[0].method, count: length})' ./logs/pyserve.log
```

## Best Practices

### Development

- Use DEBUG level during development
- Enable console output with colors
- Include descriptive log messages with context
- Log both successful operations and errors

### Production

- Use INFO or WARNING level to reduce log volume
- Enable file logging with rotation
- Consider structured logging for analysis tools
- Disable console output for better performance
- Implement monitoring alerts for ERROR and CRITICAL levels

### Performance

- Higher log levels (INFO, WARNING) have less impact than DEBUG
- File I/O can become a bottleneck under heavy load
- Consider async logging for high-traffic scenarios
- Use log aggregation services in production

## Custom Log Formatters

Create custom formatters for specific needs:

```python
from pyserve.core.logging import logging, COLORS

class CustomFormatter(logging.Formatter):
    def format(self, record):
        # Add request ID to all log messages
        if hasattr(record, 'request_id'):
            record.msg = f"[{record.request_id}] {record.msg}"
            
        # Format timestamp
        timestamp = self.formatTime(record, "%Y-%m-%d %H:%M:%S.%f")[:-3]
        
        # Custom format
        log_format = f"{timestamp} | {record.levelname:8} | {record.module:15} | {record.msg}"
        
        # Add color for console
        if hasattr(record, 'color'):
            log_format = f"{record.color}{log_format}{COLORS['RESET']}"
            
        return log_format
```

## Integration with External Services

### Syslog

Send logs to syslog server:

```python
import logging.handlers

syslog_handler = logging.handlers.SysLogHandler(
    address=('localhost', 514),
    facility=logging.handlers.SysLogHandler.LOG_LOCAL0
)
logger.logger.addHandler(syslog_handler)
```

### Remote Logging

Send logs to remote logging service:

```python
import logging.handlers

http_handler = logging.handlers.HTTPHandler(
    'logging.example.com',
    '/api/logs',
    method='POST'
)
logger.logger.addHandler(http_handler)
```

## Summary

PyServe 0.3-async's logging system provides powerful tools for monitoring and debugging your server:

- Flexible configuration through YAML files and environment variables
- Multiple log levels for different verbosity needs
- Colored console output for development
- Structured JSON logging for production
- Log rotation to manage disk space
- Integration with external logging services

By properly configuring and using the logging system, you can easily track server operations, diagnose issues, and monitor performance in both development and production environments.
