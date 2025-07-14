---
sidebar_position: 3
---

# Deployment

Learn how to deploy server

## Deployment options overview

PyServe supports multiple deployment options, including:

- **[Docker](https://www.docker.com/)** - Docker is a containerization platform that allows you to package your application and its dependencies into a container. This makes it easy to deploy your application on any server that supports Docker.
- **[Python application](https://www.python.org/)** - You can run your application directly on the server without using Docker. This is the simplest way to deploy your application, but it requires you to manage the server yourself.

> **Note:** More deployment options will be added in the future.

## Docker deployment

To deploy your application using Docker, you need to build a Docker image and run it.  
It's simple and easy to do.

### 1. Fill .env file

```bash
# HTTP port (must equal with port in config.yaml)
HTTP_PORT=8000

# HTTPS port (for SSL/TLS)
HTTPS_PORT=8443

# Additional variables for container
PYSERVE_DEBUG=false
```

### 2. Fill config.yaml file

```yaml
server:
  locations:
    /admin:  # Route to protect
      auth:
        type: basic
        username: admin
        password: secretpass
    /api:    # Another protected route
      auth:
        type: basic
        username: apiuser
        password: apipass
```

> **Note:** You can see more about configuration in **Configuration** section of this documentation.

### 3. Build Docker image

```bash
docker build -t pyserve .
```

### 4. Run Docker container

```bash
docker run -d --name pyserve -p 8000:8000 -p 8443:8443 pyserve
```

> **Note:** You can also use pre-made `docker-compose.yml` file to run your application.

## Python application deployment

To deploy your application using Python, you need to run it directly on the server.  
It's the simplest way to deploy your application, but it requires you to manage the server yourself.

### 1. Install Python

```bash
sudo apt-get update
sudo apt-get install python3
```

### 2. Clone repository

```bash
git clone https://github.com/ShiftyX1/PyServe.git
```

### 3. Install dependencies

```bash
cd PyServe
pip install -r requirements.txt
```

### 4. Make sure you have `config.yaml` file

### 5. Run application

You can run application in two ways:

```bash
chmod +x run.py
./run.py
```

or

```bash
python3 run.py
```
