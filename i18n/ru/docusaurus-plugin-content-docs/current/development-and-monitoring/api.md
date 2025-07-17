---
sidebar_position: 3
---

# Справочник по API

Полная документация по API PyServe v0.4.2 для разработчиков

## Основные компоненты

PyServe v0.4.2 построен с модульной архитектурой, предоставляя несколько основных компонентов, которые могут использоваться независимо или вместе.

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

| Параметр | Тип | Описание | По умолчанию |
|----------|-----|----------|--------------|
| `host` | str | Адрес хоста для привязки | Обязательный |
| `port` | int | Номер порта для прослушивания | Обязательный |
| `static_dir` | str | Директория для статических файлов | "./static" |
| `template_dir` | str | Директория для файлов шаблонов | "./templates" |
| `backlog` | int | Максимальный размер очереди соединений | 5 |
| `debug` | bool | Включить режим отладки | False |
| `redirections` | List[Dict[str, str]] | Правила перенаправления URL | None |
| `reverse_proxy` | List[Dict[str, Union[str, int]]] | Конфигурация обратного прокси | None |
| `locations` | Dict[str, Any] | Настройки для конкретных расположений (авторизация и т.д.) | None |
| `ssl_cert` | Optional[str] | Путь к файлу SSL-сертификата | None |
| `ssl_key` | Optional[str] | Путь к файлу приватного ключа SSL | None |
| `do_check_proxy_availability` | bool | Проверять бэкенды прокси при запуске | True |

## Управление конфигурацией

```python
from pyserve import Configuration

config = Configuration(config_path="./config.yaml")

# Доступ к разделам конфигурации
server_config = config.server_config
http_config = config.http_config
logging_config = config.logging_config
ssl_config = config.ssl_config

# Получение конкретных значений
host = config.get("server", "host", default="127.0.0.1")
port = config.get("server", "port", default=8000)

# Установка значений конфигурации
config.set("server", "port", 8080)
config.save_config()
```

### Доступные методы

| Метод | Описание | Возвращает |
|-------|----------|------------|
| `get(section, key, default=None)` | Получить значение конфигурации | Any |
| `set(section, key, value)` | Установить значение конфигурации | None |
| `save_config()` | Сохранить конфигурацию в файл | bool |
| `reload()` | Перезагрузить конфигурацию из файла | None |
| `validate()` | Проверить конфигурацию | Tuple[bool, List[str]] |

## Система логирования

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

# Использование логгера
logger.debug("Отладочное сообщение")
logger.info("Информационное сообщение")
logger.warning("Предупреждение")
logger.error("Сообщение об ошибке")
logger.critical("Критическое сообщение")
```

### Пользовательские форматтеры

```python
from pyserve.core.logging import PyServeLogger, FileHandler, ConsoleHandler

# Создание пользовательского логгера
logger = PyServeLogger(level="DEBUG")

# Добавление пользовательских обработчиков
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

## HTTP-обработчики

### Обработчик статических файлов

```python
from pyserve.http.handlers.static import StaticFileHandler

handler = StaticFileHandler(
    static_dir="./static",
    debug=False
)
```

### Обработчик шаблонов

```python
from pyserve.http.handlers.templates import TemplateHandler
from pyserve.template.engine import AsyncTemplateEngine

engine = AsyncTemplateEngine("./templates")
handler = TemplateHandler(engine)
```

### Обработчик аутентификации

```python
from pyserve.http.handlers.auth.basic import HTTPBasicAuthHandler

auth_handler = HTTPBasicAuthHandler(
    username="admin",
    password="secretpass"
)
```

### Обработчик прокси

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

## Объекты запроса и ответа

### HTTPRequest

```python
from pyserve.http.request import HTTPRequest

# Свойства запроса
request.method      # HTTP-метод (GET, POST и т.д.)
request.path        # Путь запроса
request.headers     # Заголовки запроса (dict)
request.query       # Параметры запроса (dict)
request.body        # Тело запроса (bytes)
request.is_valid()  # Проверить формат запроса
```

### HTTPResponse

```python
from pyserve.http.response import HTTPResponse

# Создание ответов
response = HTTPResponse(
    status_code=200,
    headers={},
    body="Привет, мир!"
)

# Вспомогательные методы
response = HTTPResponse.ok("Успех")
response = HTTPResponse.not_found("Страница не найдена")
response = HTTPResponse.unauthorized("Доступ запрещен")
response = HTTPResponse.redirect("/new-location")
response = HTTPResponse.internal_error("Ошибка сервера")
```

## Конфигурация SSL

```python
from pyserve import SSLConfiguration

ssl_config = SSLConfiguration({
    "enabled": True,
    "cert_file": "./ssl/cert.pem",
    "key_file": "./ssl/key.pem"
})

# Проверка конфигурации SSL
if ssl_config.is_properly_configured():
    print("SSL правильно настроен")
```

## Утилиты для тестирования

```python
from pyserve import TestConfiguration

test_config = TestConfiguration()

# Запуск конкретных тестов
test_config.test_load_config()
test_config.test_configuration()
test_config.test_static_directories()

# Запуск всех тестов
test_config.run_all_tests()
```

## Обработка ошибок

PyServe предоставляет набор пользовательских исключений для лучшей обработки ошибок:

```python
from pyserve.core.exceptions import (
    ConfigurationError,
    PyServeYAMLException
)
```

:::info
**Примечание:** Все исключения PyServe наследуются от базового класса `Exception`.
:::

## Компоненты Vibe-Serving

Новое в v0.4.2: Компоненты генерации контента с поддержкой ИИ для динамических веб-страниц.

### VibeService

```python
from pyserve.vibe.service import VibeService
from pyserve.vibe.vibe_config import VibeConfig
from pyserve import Configuration, AsyncHTTPServer

# Инициализация компонентов
config = Configuration()
vibe_config = VibeConfig()
vibe_config.load_config('vibeconfig.yaml')
server = AsyncHTTPServer(...)

# Создание и запуск сервиса Vibe
vibe_service = VibeService(server, config, vibe_config)
runner = await vibe_service.run()
```

### VibeLLMClient

```python
from pyserve.vibe.llm import VibeLLMClient

# Инициализация с OpenAI по умолчанию
client = VibeLLMClient(model="gpt-4")

# Инициализация с пользовательским API
client = VibeLLMClient(
    api_url="https://api.custom-llm.com/v1",
    api_key="your-key",
    model="custom-model"
)

# Генерация контента
html_content = await client.generate(
    prompt="Создай красивую целевую страницу",
    timeout=30
)
```

### VibeCache

```python
from pyserve.vibe.cache import VibeCache

cache = VibeCache(base_dir="./cache")

# Проверка кэша
content = cache.get("/about", ttl=3600)

# Установка кэша
cache.set("/about", html_content)
```

### VibeConfig

```python
from pyserve.vibe.vibe_config import VibeConfig

config = VibeConfig()
config.load_config('vibeconfig.yaml')

# Получение промпта для маршрута
prompt = config.get_prompt("/about")

# Получение настроек
timeout = config.get_timeout()
api_url = config.get_api_url()
```