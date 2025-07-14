    ---
sidebar_position: 2
---

# Конфигурация

Узнайте, как настроить PyServe v0.4.1 с помощью YAML файлов и переменных окружения

## Обзор конфигурации

PyServe использует YAML файлы конфигурации для настройки сервера. По умолчанию сервер ищет файл `config.yaml` в текущей папке, но вы можете указать другое местоположение с помощью опции `-c` или `--config`.

:::info
**Примечание:** Аргументы командной строки всегда переопределяют настройки файла конфигурации, а переменные окружения переопределяют файлы конфигурации, но не аргументы командной строки.
:::

## Конфигурация по умолчанию

При первом запуске PyServe создает файл `config.yaml` по умолчанию со следующей структурой:

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
  max_log_size: 10485760  # 10 МБ
  backup_count: 5
  structured_logs: false
```

## Разделы конфигурации

### Конфигурация сервера

Раздел `server` содержит основные настройки сервера:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `host` | Хост для привязки сервера | 127.0.0.1 |
| `port` | Номер порта для прослушивания | 8000 |
| `backlog` | Максимальный размер очереди подключений | 5 |
| `redirect_instructions` | Правила перенаправления URL | См. пример выше |
| `reverse_proxy` | Конфигурация обратного прокси | См. пример выше |

### Конфигурация HTTP

Раздел `http` настраивает обработку файлов HTTP-сервером:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `static_dir` | Папка для статических файлов | ./static |
| `templates_dir` | Папка для файлов шаблонов | ./templates |

### Конфигурация SSL

Раздел `ssl` управляет настройками SSL/TLS:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `enabled` | Включить/отключить SSL | false |
| `cert_file` | Путь к файлу SSL сертификата | ./ssl/cert.pem |
| `key_file` | Путь к файлу приватного ключа SSL | ./ssl/key.pem |

### Конфигурация логирования

Раздел `logging` управляет поведением логирования сервера:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `level` | Уровень логирования (DEBUG, INFO, WARNING, ERROR, CRITICAL) | INFO |
| `log_file` | Путь к файлу логов | ./logs/pyserve.log |
| `console_output` | Выводить ли логи в консоль | true |
| `use_colors` | Включить цветной вывод в консоль | true |
| `use_rotation` | Включить ротацию логов | false |
| `max_log_size` | Максимальный размер файла логов (байты) | 10485760 |
| `backup_count` | Количество резервных файлов логов | 5 |
| `structured_logs` | Включить структурированное логирование JSON | false |

## Переменные окружения

PyServe v0.4.1 поддерживает переменные окружения для переопределения конфигурации:

```bash
# Пример: Переопределение хоста и порта
export PYSERVE_HOST=0.0.0.0
export PYSERVE_PORT=9000
python run.py

# Пример: Включение SSL
export PYSERVE_SSL_ENABLED=true
export PYSERVE_SSL_CERT=/path/to/cert.pem
export PYSERVE_SSL_KEY=/path/to/key.pem
python run.py
```

Доступные переменные окружения:
- `PYSERVE_HOST` - Хост сервера
- `PYSERVE_PORT` - Порт сервера
- `PYSERVE_STATIC_DIR` - Папка статических файлов
- `PYSERVE_TEMPLATES_DIR` - Папка файлов шаблонов
- `PYSERVE_LOG_LEVEL` - Уровень логирования
- `PYSERVE_LOG_FILE` - Путь к файлу логов
- `PYSERVE_SSL_ENABLED` - Включить SSL (true/false)
- `PYSERVE_SSL_CERT` - Файл SSL сертификата
- `PYSERVE_SSL_KEY` - Файл SSL ключа

## Валидация конфигурации

PyServe v0.4.1 включает встроенный валидатор конфигурации:

```bash
# Валидация конфигурации
python run.py --test configuration

# Запуск всех тестов включая конфигурацию
python run.py --test all
```

Валидатор проверяет:
- Наличие обязательных полей
- Корректность типов данных
- Диапазоны значений (например, номера портов)
- Существование файлов и папок
- Валидность SSL сертификатов

:::tip
**Совет:** Всегда валидируйте конфигурацию после внесения изменений, особенно в продакшн окружениях.
:::

## Конфигурация перенаправления URL

Настройте перенаправления URL с помощью параметра `redirect_instructions`:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /blog: https://example.com/blog
    - /docs: /documentation.html
    - /api/v1: /api/v2  # Перенаправление старых версий API
```

Эта конфигурация будет:
- Перенаправлять `/home` на `/index.html` на том же сервере
- Перенаправлять `/blog` на `https://example.com/blog` (внешний URL)
- Перенаправлять `/docs` на `/documentation.html` на том же сервере
- Перенаправлять `/api/v1` на `/api/v2` для версионирования API

## Конфигурация обратного прокси

Настройте параметры обратного прокси с помощью раздела `reverse_proxy`:

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

Эта конфигурация будет:
- Перенаправлять все запросы, начинающиеся с `/api`, на `localhost:3000`
- Перенаправлять все запросы, начинающиеся с `/admin`, на `admin-server:8080`
- Перенаправлять все запросы, начинающиеся с `/websocket`, на `ws-server:8765`

:::info
**Примечание:** PyServe автоматически добавляет соответствующие заголовки, такие как `X-Forwarded-For`, `X-Forwarded-Host` и `X-Forwarded-Proto`, к проксируемым запросам.
:::

## Пример: Расширенная конфигурация

Вот пример более сложного файла конфигурации:

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
  max_log_size: 52428800  # 50 МБ
  backup_count: 10
  structured_logs: true
```

Эта продакшн-готовая конфигурация:
- Работает на всех интерфейсах на порту 443 (HTTPS)
- Включает SSL с продакшн сертификатами
- Использует больший backlog подключений для высоконагруженных сценариев
- Реализует множественные перенаправления и обратные прокси
- Включает ротацию логов со структурированными JSON логами
- Отключает вывод в консоль для эффективности в продакшене

## Модульная конфигурация

PyServe v0.4.1 представляет модульное управление конфигурацией:

```python
# Загрузка конфигурации программно
from pyserve import Configuration

# Создание объекта конфигурации
config = Configuration('/path/to/config.yaml')

# Добавление обратного прокси программно
config.add_reverse_proxy('/newapi', 'api-server', 9000)

# Настройка SSL программно
config.configure_ssl(
    enabled=True,
    cert_file='/path/to/cert.pem',
    key_file='/path/to/key.pem'
)

# Сохранение изменений в файл
config.save_config()
```

:::info
**Новое в v0.4.1:** Класс Configuration теперь поддерживает горячую перезагрузку, валидацию и программное изменение.
:::

## Лучшие практики конфигурации

### Разработка против продакшена

Используйте различные файлы конфигурации для разных окружений:

```bash
# Разработка
python run.py -c config-dev.yaml

# Тестирование
python run.py -c config-staging.yaml

# Продакшен
python run.py -c /etc/pyserve/config-prod.yaml
```

### Соображения безопасности

- Никогда не коммитьте чувствительные данные (SSL ключи, пароли) в систему контроля версий
- Используйте переменные окружения для чувствительной конфигурации
- Устанавливайте ограничительные права доступа к файлам конфигурации
- Валидируйте все значения конфигурации

### Настройка производительности

- Увеличьте `backlog` для высоконагруженных сценариев
- Включите ротацию логов, чтобы предотвратить проблемы с дисковым пространством
- Используйте структурированные логи для лучших инструментов анализа
- Отключите вывод в консоль в продакшене

## Конфигурация Vibe-Serving

При использовании режима `--vibe-serving`, PyServe использует отдельный файл `vibeconfig.yaml` для конфигурации ИИ-генерации контента:

```yaml
routes:
  "/": "Сгенерируй современную целевую страницу для PyServe с главным разделом и функциями"
  "/about": "Создай страницу о проекте PyServe"
  "/contact": "Сгенерируй страницу контактов с формой"
  "/docs": "Создай страницу документации с навигацией"

settings:
  cache_ttl: 3600              # Время кеширования в секундах
  model: "claude-3.5-sonnet"   # ИИ модель для использования  
  timeout: 3600                # Таймаут запроса в секундах
  api_url: "https://bothub.chat/api/v2/openai/v1"  # Пользовательская конечная точка API
  fallback_enabled: true       # Включить откат к странице ошибки
```

### Раздел Routes

Определите URL пути и соответствующие им промпты для ИИ-генерации контента:
- **Ключ:** URL путь (например, `/about`)
- **Значение:** Промпт для отправки ИИ модели для генерации страницы
- Каждый запрос к настроенному маршруту будет генерировать HTML контент, используя промпт

### Раздел Settings

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `cache_ttl` | Как долго кешировать сгенерированные страницы (секунды) | 3600 |
| `model` | ИИ модель для использования в генерации | gpt-3.5-turbo |
| `timeout` | Максимальное время ожидания ответа ИИ (секунды) | 20 |
| `api_url` | Пользовательская конечная точка API (для не-OpenAI моделей) | null |
| `fallback_enabled` | Показывать страницу ошибки при сбое ИИ-генерации | true |

:::info
**Переменные окружения:** Вы должны установить `OPENAI_API_KEY` в вашем окружении или файле `.env` для работы Vibe-Serving.
:::
