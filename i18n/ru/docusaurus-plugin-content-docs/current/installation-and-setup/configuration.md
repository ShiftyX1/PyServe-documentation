---
sidebar_position: 2
---

# Конфигурация

Узнайте, как настроить PyServe v0.4.2 с помощью новой системы конфигурации V2 с поддержкой расширений

## Обзор конфигурации

PyServe представляет революционную систему конфигурации V2 с **полной обратной совместимостью**. Вы можете использовать традиционные конфигурации V1 или использовать мощную новую систему расширений V2 для расширенной функциональности.

:::info
**Возможности V2:** Regex-маршрутизация, поддержка SPA, модульные расширения, внешние файлы конфигурации и многое другое!
:::

:::warning
**Миграция:** Все существующие конфигурации V1 продолжают работать без изменений. Добавление `version: 2` открывает новые возможности.
:::

## Форматы конфигурации

### Конфигурация V1 (Устаревшая - Все еще поддерживается)

Ваши существующие конфигурации продолжают работать точно так же, как и раньше:

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

### Конфигурация V2 (Рекомендуемая)

Новая система V2 добавляет мощные расширения, сохраняя полную совместимость с V1:

```yaml
version: 2

# Основные модули (те же, что и в V1)
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

# НОВОЕ: Система расширений
extensions:
  - type: routing
    config:
      regex_locations:
        # API с захватом версии
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # Статические файлы с кешированием
        "~*\\.(js|css|png|jpg)$":
          root: "./static"
          cache_control: "max-age=31536000"
        
        # Проверка здоровья
        "=/health":
          return: "200 OK"
        
        # SPA fallback
        "__default__":
          spa_fallback: true
          root: "./dist"
```

## Система расширений V2

### Расширение маршрутизации

Продвинутая маршрутизация с regex-паттернами и поддержкой SPA:

```yaml
extensions:
  - type: routing
    config:
      regex_locations:
        # Типы паттернов (приоритеты в стиле nginx):
        
        # 1. Точное совпадение (наивысший приоритет)
        "=/health":
          return: "200 OK"
          content_type: "text/plain"
        
        # 2. Regex с учетом регистра  
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # 3. Regex без учета регистра
        "~*\\.(js|css|png|jpg|gif|ico|svg)$":
          root: "./static"
          cache_control: "public, max-age=31536000"
        
        # 4. SPA fallback (самый низкий приоритет)
        "__default__":
          spa_fallback: true
          root: "./dist"
          index_file: "index.html"
          exclude_patterns:
            - "/api/"
            - "/admin/"
```

#### Типы паттернов и приоритеты

| Паттерн | Приоритет | Описание | Пример |
|---------|-----------|----------|---------|
| `=/path` | 1 (Высший) | Точное совпадение | `=/health` |
| `~^/pattern` | 2 | Regex с учетом регистра | `~^/api/` |
| `~*\\.ext$` | 3 | Regex без учета регистра | `~*\\.(js\|css)$` |
| `^~/path` | 4 | Совпадение префикса | `^~/static/` |
| `__default__` | 5 (Низший) | SPA fallback | Одностраничные приложения |

### Внешние расширения

Загружайте расширения из отдельных файлов для лучшей организации:

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

## Основные разделы конфигурации

Эти разделы работают одинаково в конфигурациях V1 и V2:

### Конфигурация сервера

Раздел `server` содержит основные настройки сервера:

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `host` | Хост для привязки сервера | 127.0.0.1 |
| `port` | Номер порта для прослушивания | 8000 |
| `backlog` | Максимальный размер очереди подключений | 5 |
| `redirect_instructions` | Правила перенаправления URL (только V1) | См. примеры V1 |
| `reverse_proxy` | Конфигурация обратного прокси (только V1) | См. примеры V1 |

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

PyServe v0.4.2 поддерживает переменные окружения для переопределения конфигурации:

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

PyServe v0.4.2 включает встроенный валидатор конфигурации:

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
- **V2 НОВОЕ:** Валидация конфигурации расширений
- **V2 НОВОЕ:** Валидация синтаксиса regex-паттернов
- **V2 НОВОЕ:** Валидация файлов внешних модулей

:::info
**V2 Graceful Degradation:** Недействительные расширения пропускаются с предупреждениями, основная функциональность продолжает работать.
:::

:::tip
**Совет:** Всегда валидируйте конфигурацию после внесения изменений, особенно в продакшн окружениях.
:::

## Примеры конфигурации V2

### Простое SPA приложение

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

### Шлюз микросервисов

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

## Миграция с V1 на V2

:::info
**Миграция без поломок:** Добавьте `version: 2` к вашей существующей конфигурации, и она будет работать точно так же!
:::

### Шаг 1: Базовая миграция

Просто добавьте `version: 2` к вашей существующей конфигурации V1:

```yaml
# До (V1)
server:
  host: 127.0.0.1
  port: 8000

# После (V2 - та же функциональность)
version: 2

server:
  host: 127.0.0.1
  port: 8000
```

### Шаг 2: Конвертация простой маршрутизации

Опционально конвертируйте местоположения V1 в расширение маршрутизации V2:

```yaml
# До (V1)
server:
  reverse_proxy:
    - path: /api
      host: localhost
      port: 3000

# После (V2)
extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/":
          proxy_pass: "http://localhost:3000"
```

### Шаг 3: Добавление расширенных возможностей

Используйте новые возможности V2, такие как поддержка SPA и regex-маршрутизация:

```yaml
extensions:
  - type: routing
    config:
      regex_locations:
        # Захват параметров
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
          headers:
            - "API-Version: {version}"
        
        # Кеширование статических файлов
        "~*\\.(js|css|png)$":
          root: "./static"
          cache_control: "max-age=31536000"
        
        # SPA fallback
        "__default__":
          spa_fallback: true
          root: "./dist"
```

## Доступные расширения

### Встроенные расширения

#### Расширение маршрутизации
- **Regex-паттерны** с приоритетами в стиле nginx
- **Захват параметров** из URL
- **SPA fallback** для современных веб-приложений
- **Обработка статических файлов** с правилами кеширования
- **Эндпоинты проверки здоровья**

#### Расширение безопасности (Внешнее)
- **CORS** конфигурация
- **Rate limiting** с правилами для каждого эндпоинта
- **CSRF защита**
- **Заголовки безопасности**
- **IP фильтрация**

#### Расширение кеширования (Внешнее)
- **Redis backend** поддержка
- **Кеширование в памяти**
- **TTL правила** для каждого паттерна маршрута
- **Инвалидация кеша**

#### Расширение мониторинга (Внешнее)
- **Эндпоинт метрик** (/metrics)
- **Проверки здоровья** с пользовательскими проверками
- **Мониторинг производительности**
- **Логирование запросов**

## Конфигурация перенаправления URL (только V1)

Для конфигураций V1 настройте перенаправления URL с помощью параметра `redirect_instructions`:

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

## Конфигурация обратного прокси (только V1)

Для конфигураций V1 настройте параметры обратного прокси с помощью раздела `reverse_proxy`:

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

## Пример: Расширенная конфигурация V2

Вот пример продакшн-готовой конфигурации V2:

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
  max_log_size: 52428800  # 50 МБ
  backup_count: 10
  structured_logs: true

extensions:
  # Продвинутая маршрутизация с микросервисами
  - type: routing
    config:
      regex_locations:
        # API Gateway с маршрутизацией версий
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
        
        # Статические ресурсы с агрессивным кешированием
        "~*\\.(js|css|png|jpg|gif|ico|svg|woff2?)$":
          root: "/var/www/static"
          cache_control: "public, max-age=31536000, immutable"
          headers:
            - "Access-Control-Allow-Origin: *"
        
        # Эндпоинты здоровья и мониторинга
        "=/health":
          return: "200 OK"
          content_type: "application/json"
        
        "=/metrics":
          proxy_pass: "http://monitoring:9090"
        
        # SPA с современной маршрутизацией
        "__default__":
          spa_fallback: true
          root: "/var/www/app"
          index_file: "index.html"
          exclude_patterns:
            - "/api/"
            - "/admin/"
            - "/metrics"
            - "/health"

  # Конфигурация безопасности
  - type: security
    source: /etc/pyserve/extensions/security.yaml

  # Redis кеширование
  - type: caching
    config:
      backend: redis
      url: "redis://cache-cluster:6379"
      default_ttl: 3600
      rules:
        "~*\\.(js|css)$": 86400    # 1 день для ресурсов
        "~^/api/": 300             # 5 минут для API
        "~^/health": 60            # 1 минута для health

  # Мониторинг и метрики
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
**Готово для продакшена:** Эта конфигурация поддерживает высоконагруженные продакшн нагрузки с микросервисами, кешированием, безопасностью и мониторингом.
:::

## Модульная конфигурация

PyServe v0.4.2 представляет продвинутое модульное управление конфигурацией:

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
**Новое в v0.4.2:** Класс Configuration теперь поддерживает горячую перезагрузку, валидацию, программное изменение и управление расширениями V2.
:::

## Лучшие практики конфигурации

### Организация конфигурации V2

```
project/
├── config.yaml                 # Основная конфигурация V2
├── config/
│   └── extensions/
│       ├── security.yaml       # Модуль безопасности
│       ├── caching.yaml        # Модуль кеширования
│       └── monitoring.yaml     # Модуль мониторинга
├── static/                     # Статические файлы
├── dist/                       # Результат сборки SPA
└── logs/                       # Файлы логов
```

### Разработка против продакшена

Используйте различные файлы конфигурации для разных окружений:

```bash
# Разработка (V2)
python run.py -c config-dev.yaml

# Тестирование (V2)  
python run.py -c config-staging.yaml

# Продакшен (V2)
python run.py -c /etc/pyserve/config-prod.yaml
```

### Стратегия миграции V2

1. **Начните безопасно:** Добавьте `version: 2` к существующей конфигурации
2. **Тестируйте тщательно:** Убедитесь, что вся существующая функциональность работает
3. **Мигрируйте постепенно:** Конвертируйте простые маршруты в расширение маршрутизации
4. **Добавляйте возможности:** Реализуйте поддержку SPA, захват параметров
5. **Модуляризируйте:** Перенесите сложные конфигурации во внешние файлы

### Соображения безопасности

- Никогда не коммитьте чувствительные данные (SSL ключи, пароли) в систему контроля версий
- Используйте переменные окружения для чувствительной конфигурации
- Устанавливайте ограничительные права доступа к файлам конфигурации
- Валидируйте все значения конфигурации, особенно regex-паттерны
- **V2 НОВОЕ:** Используйте расширение безопасности для CORS, rate limiting
- **V2 НОВОЕ:** Используйте валидацию параметров в паттернах маршрутизации

### Настройка производительности

- Увеличьте `backlog` для высоконагруженных сценариев
- Включите ротацию логов, чтобы предотвратить проблемы с дисковым пространством
- Используйте структурированные логи для лучших инструментов анализа
- Отключите вывод в консоль в продакшене
- **V2 НОВОЕ:** Используйте расширение кеширования для производительности
- **V2 НОВОЕ:** Оптимизируйте regex-паттерны для скорости
- **V2 НОВОЕ:** Устанавливайте соответствующие заголовки cache-control

## Конфигурация Vibe-Serving

При использовании режима `--vibe-serving`, PyServe использует отдельный файл `vibeconfig.yaml` для конфигурации ИИ-генерации контента. Этот режим работает независимо от систем конфигурации V1/V2.

:::info
**Интеграция с ИИ:** Vibe-Serving может работать вместе с расширениями маршрутизации V2 для продвинутых веб-приложений с поддержкой ИИ.
:::

```yaml
routes:
  "/": "Сгенерируй современную целевую страницу для PyServe с главным разделом и функциями"
  "/about": "Создай страницу о проекте PyServe"
  "/contact": "Сгенерируй страницу контактов с формой"
  "/docs": "Создай страницу документации с навигацией"
  "/api/demo": "Сгенерируй JSON API ответ с демо данными"

settings:
  cache_ttl: 3600              # Время кеширования в секундах
  model: "claude-3.5-sonnet"   # ИИ модель для использования  
  timeout: 3600                # Таймаут запроса в секундах
  api_url: "https://bothub.chat/api/v2/openai/v1"  # Пользовательская конечная точка API
  fallback_enabled: true       # Включить откат к странице ошибки
  
  # НОВОЕ: Интеграция с V2
  enable_v2_routing: false     # Использовать маршрутизацию V2 вместе с Vibe-Serving
  static_fallback: true        # Откатываться к статическим файлам при сбое ИИ
```

### Раздел Routes

Определите URL пути и соответствующие им промпты для ИИ-генерации контента:
- **Ключ:** URL путь (например, `/about`)
- **Значение:** Промпт для отправки ИИ модели для генерации страницы
- Каждый запрос к настроенному маршруту будет генерировать HTML контент, используя промпт
- **НОВОЕ:** Поддержка JSON API эндпоинтов со структурированными промптами

### Раздел Settings

| Параметр | Описание | По умолчанию |
|----------|----------|--------------|
| `cache_ttl` | Как долго кешировать сгенерированные страницы (секунды) | 3600 |
| `model` | ИИ модель для использования в генерации | gpt-3.5-turbo |
| `timeout` | Максимальное время ожидания ответа ИИ (секунды) | 20 |
| `api_url` | Пользовательская конечная точка API (для не-OpenAI моделей) | null |
| `fallback_enabled` | Показывать страницу ошибки при сбое ИИ-генерации | true |
| `enable_v2_routing` | Использовать систему маршрутизации V2 вместе с Vibe-Serving | false |
| `static_fallback` | Откатываться к статическим файлам при сбое ИИ | true |

### Гибридная конфигурация V2 + Vibe-Serving

Объедините маршрутизацию V2 с ИИ-генерированным контентом для максимальной гибкости:

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
        # Статические API маршруты
        "~^/api/health":
          return: "200 OK"
        
        # Прокси к backend сервисам
        "~^/api/v1/":
          proxy_pass: "http://backend:3000"
        
        # Статические ресурсы
        "~*\\.(js|css|png)$":
          root: "./static"
        
        # ИИ-генерированный контент для всего остального
        "__default__":
          vibe_serving: true  # НОВОЕ: Делегирование к Vibe-Serving

# vibeconfig.yaml (ИИ контент)
routes:
  "/": "Создай современную панель управления с виджетами"
  "/profile": "Сгенерируй страницу профиля пользователя"
  "/reports": "Создай страницу отчетов с графиками"

settings:
  enable_v2_routing: true  # Работать с маршрутизацией V2
  cache_ttl: 1800         # Более короткий кеш для динамического контента
```

:::warning
**Переменные окружения:** Вы должны установить `OPENAI_API_KEY` в вашем окружении или файле `.env` для работы Vibe-Serving.
:::
