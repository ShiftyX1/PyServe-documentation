---
sidebar_position: 2
---

# Testing

Learn how to test PyServe configurations and components

## Testing Overview

PyServe includes a built-in testing framework that allows you to verify your configuration and ensure that the server is set up correctly. This is particularly useful when deploying to new environments or making configuration changes.

:::info Key Benefits
Catch configuration errors early, validate server settings, and ensure directories exist.
:::

## Test Types

PyServe supports several types of tests that can be run individually or all at once:

### Configuration Test

Tests the configuration file to ensure it contains all required settings and is properly formatted.

### Directories Test

Checks that static and template directories exist and are accessible.

### All Tests

Runs all available tests in sequence.

## Running Tests

Tests can be run using the `--test` command line option:

### Test All Components

```bash
python run.py --test all
```

### Test Configuration Only

```bash
python run.py --test configuration
```

### Test Directories Only

```bash
python run.py --test directories
```

You can also specify a custom configuration file to test:

```bash
python run.py --test all -c ./my_config.yaml
```

## Test Results

Tests produce both console output and exit codes that can be used in scripts and automation workflows.

### Console Output

Tests produce detailed output in the console, indicating which tests passed and failed:

```
=== Testing Configuration Loading ===
✅ Configuration loaded successfully

=== Testing Configuration Content ===
✅ Server configuration: OK
✅ HTTP configuration: OK
✅ Logging configuration: OK
✅ Redirections: OK
✅ Reverse proxy configuration: OK

✅ All configuration tests passed

=== Testing Static Directories ===
✅ Static directory exists: /path/to/static
✅ Templates directory exists: /path/to/templates
```

### Exit Codes

Tests return different exit codes depending on the test results, which can be used in scripts to determine if the tests passed or failed:

| Exit Code | Meaning | Description |
|-----------|---------|-------------|
| `0` | Success | All tests passed successfully |
| `1` | Optional Test Failure | Required tests passed, but optional tests failed |
| `2` | Critical Test Failure | Required tests failed (server cannot start properly) |
| `3` | Configuration Load Failure | Failed to load configuration file |

## Configuration Testing

The configuration test checks the structure and content of your `config.yaml` file. It verifies both mandatory and optional settings.

### Mandatory Configuration

These settings must be present for the server to function properly:

- `server` configuration with `host` and `port` settings
- `http` configuration with `static_dir` and `templates_dir` settings

### Optional Configuration

These settings are not required but are tested if present:

- `logging` configuration
- `redirect_instructions` settings
- `reverse_proxy` configuration

### Sample Output

```
=== Testing Configuration Content ===
✅ Server configuration: OK
✅ HTTP configuration: OK
⚠️ Logging configuration: Missing or incomplete (WARNING)
✅ Redirections: OK
⚠️ Reverse proxy configuration: Not configured (OPTIONAL)

⚠️ Mandatory configuration tests passed, but some optional tests failed
```

## Directory Testing

The directories test verifies that the static and template directories specified in your configuration exist and are accessible. If a directory doesn't exist, PyServe will attempt to create it.

### Tested Directories

- `static_dir`: Directory for static files
- `templates_dir`: Directory for template files

### Sample Output

```
=== Testing Static Directories ===
⚠️ Static directory './public' does not exist
✅ Created static directory: ./public
✅ Templates directory exists: ./templates
```

## Using Tests in Scripts

The exit codes returned by PyServe tests can be used in shell scripts for automation. Here's an example shell script that runs tests before starting the server:

```bash
#!/bin/bash

echo "Testing PyServe configuration..."
python run.py --test all

# Check the exit code
if [ $? -eq 0 ]; then
    echo "All tests passed! Starting server..."
    python run.py
elif [ $? -eq 1 ]; then
    echo "Warning: Some optional tests failed. Starting server anyway..."
    python run.py
else
    echo "Error: Critical tests failed. Server cannot start."
    exit 1
fi
```

### In CI/CD Pipelines

Tests can be integrated into CI/CD pipelines to validate configuration before deployment:

```yaml
# Example GitHub Actions workflow step
- name: Test PyServe configuration
  run: |
    python run.py --test all
    if [ $? -gt 1 ]; then
      echo "Configuration tests failed"
      exit 1
    fi
```

## Custom Test Implementation

The testing framework in PyServe is implemented in the `TestConfiguration` class. You can extend this class to add your own custom tests:

```python
from pyserve import TestConfiguration

class MyTestConfiguration(TestConfiguration):
    def __init__(self):
        super().__init__()
        
    def test_custom_feature(self):
        print("\n=== Testing Custom Feature ===")
        try:
            # Your custom test logic here
            if 'custom_feature' in self.config.server_config:
                print("✅ Custom feature configuration: OK")
                return True
            else:
                print("❌ Custom feature not configured")
                return False
        except Exception as e:
            print(f"❌ Error testing custom feature: {str(e)}")
            return False
```

## Best Practices

### Regular Testing

- Run tests after changing configuration files
- Include tests in deployment scripts
- Test with the exact configuration that will be used in production

### Configuration Management

- Use version control for configuration files
- Document changes to configuration files
- Use different configuration files for development and production

### Automated Testing

- Include PyServe tests in your application's test suite
- Use exit codes to determine test success or failure
- Set up monitoring that includes regular configuration validation

## Advanced Testing

### Integration with Other Test Frameworks

You can integrate PyServe tests with other testing frameworks like pytest:

```python
import pytest
from pyserve import TestConfiguration

def test_configuration():
    """Test that the PyServe configuration is valid"""
    test_config = TestConfiguration()
    assert test_config.test_load_config() == True
    
    # Test configuration content
    result = test_config.test_configuration()
    # We accept 0 (all pass) or 1 (optional fail)
    assert result < 2, "Critical configuration test failed"
    
def test_directories():
    """Test that required directories exist"""
    test_config = TestConfiguration()
    assert test_config.test_static_directories() == True
```

### Load Testing

While PyServe's built-in tests focus on configuration validation, you may also want to perform load testing to ensure your server can handle the expected traffic. Tools like Apache Bench (ab) or wrk can be used for this purpose:

```bash
# Using Apache Bench to test 1000 requests with 10 concurrent connections
ab -n 1000 -c 10 http://localhost:8000/

# Using wrk for a 30-second test with 10 threads and 100 connections
wrk -t10 -c100 -d30s http://localhost:8000/
```

## Troubleshooting

### Common Test Failures

#### Configuration Load Failure

If the test fails to load the configuration file, check:

- The file exists at the specified path
- The file is valid YAML syntax
- The file has the correct permissions

#### Server Configuration Failure

If the server configuration test fails, ensure:

- The `server` section exists in your config file
- The `host` and `port` settings are defined
- The port number is valid (between 1 and 65535)

#### HTTP Configuration Failure

If the HTTP configuration test fails, check:

- The `http` section exists in your config file
- The `static_dir` and `templates_dir` settings are defined
- The paths are valid and accessible

#### Directory Test Failure

If directory tests fail, verify:

- The directories exist or can be created
- The application has permission to read/write to these directories
- The paths are valid for your operating system

## Summary

PyServe's testing capabilities allow you to validate your configuration and ensure that the server is set up correctly. By running tests regularly and as part of your deployment process, you can catch issues early and ensure a smooth operation of your PyServe instance.

Remember that configuration tests are divided into mandatory and optional categories, with different exit codes indicating the severity of any failures. This allows you to make informed decisions about whether to proceed with server startup or address configuration issues first.
