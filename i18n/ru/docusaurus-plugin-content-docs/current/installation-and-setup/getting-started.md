---
sidebar_position: 1
---

# Начало работы

Краткое руководство по установке и запуску PyServe v0.4.2

## Установка

PyServe - это чистое Python-приложение с минимальными зависимостями. Следуйте этим шагам для установки:

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/ShiftyX1/PyServe.git
   cd PyServe
   ```

2. Создайте виртуальное окружение (рекомендуется):
   ```bash
   python -m venv pyserve-env
   source pyserve-env/bin/activate  # В Windows: pyserve-env\Scripts\activate
   ```

3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
   
   Или установите необходимые пакеты вручную:
   ```bash
   pip install pyyaml aiofiles aiohttp openai python-dotenv
   ```

:::info
**Примечание:** PyServe v0.4.2 требует Python 3.7+ и теперь использует современный синтаксис async/await повсюду.
:::

## Базовое использование

Запуск сервера с настройками по умолчанию:

```bash
python run.py
```

Это запустит PyServe со следующей конфигурацией по умолчанию:
- Хост: 127.0.0.1 (localhost)
- Порт: 8000
- Папка статических файлов: ./static
- Папка шаблонов: ./templates
- Уровень логирования: INFO

Теперь вы можете получить доступ к серверу по адресу [http://localhost:8000](http://localhost:8000)

## Параметры командной строки

PyServe поддерживает различные параметры командной строки для переопределения конфигурации:

| Параметр | Описание | Пример |
|----------|----------|--------|
| `-c, --config` | Путь к файлу конфигурации | `python run.py -c ./my_config.yaml` |
| `-p, --port` | Порт для запуска сервера | `python run.py -p 8080` |
| `-H, --host` | Хост для привязки | `python run.py -H 0.0.0.0` |
| `-s, --static` | Папка для статических файлов | `python run.py -s ./www/static` |
| `-t, --templates` | Папка для файлов шаблонов | `python run.py -t ./www/templates` |
| `-v, --version` | Показать версию PyServe и выйти | `python run.py -v` |
| `-d, --debug` | Включить режим отладки | `python run.py -d` |
| `--proxy` | Настроить обратный прокси | `python run.py --proxy localhost:3000/api` |
| `--test` | Запустить тесты | `python run.py --test all` |
| `--ssl` | Включить SSL/TLS | `python run.py --ssl --cert cert.pem --key key.pem` |
| `--vibe-serving` | Включить режим Vibe-Serving (ИИ-генерация контента) | `python run.py --vibe-serving` |
| `--skip-proxy-check` | Пропустить проверку доступности обратного прокси при запуске | `python run.py --skip-proxy-check` |

## Примеры

### Запуск на всех интерфейсах

Чтобы сделать сервер доступным с других устройств в вашей сети:
```bash
python run.py -H 0.0.0.0 -p 8000
```

### Использование пользовательских папок

Если ваши статические файлы и шаблоны находятся в другом месте:
```bash
python run.py -s ./www/public -t ./www/views
```

### Настройка обратного прокси

Для проксирования запросов к серверу API:
```bash
python run.py --proxy localhost:3000/api
```

### Запуск с SSL

Для запуска PyServe с HTTPS шифрованием:
```bash
python run.py --ssl --cert ./ssl/cert.pem --key ./ssl/key.pem
```

### Режим Vibe-Serving

Для включения режима ИИ-генерации контента:
```bash
python run.py --vibe-serving
```

Убедитесь, что вы настроили `vibeconfig.yaml` и установили переменную окружения `OPENAI_API_KEY`.

:::warning Предупреждение о безопасности
При открытии доступа к PyServe из интернета убедитесь, что понимаете последствия для безопасности. PyServe все еще находится на стадии активной разработки, на данный момент предпочтительно не использовать данный сервер в качестве продакшн решения.
:::

## Переменные окружения

PyServe v0.4.2 поддерживает переменные окружения для конфигурации:

| Переменная окружения | Ключ конфигурации | По умолчанию |
|---------------------|-------------------|--------------|
| `PYSERVE_HOST` | server.host | 127.0.0.1 |
| `PYSERVE_PORT` | server.port | 8000 |
| `PYSERVE_STATIC_DIR` | http.static_dir | ./static |
| `PYSERVE_TEMPLATES_DIR` | http.templates_dir | ./templates |
| `PYSERVE_LOG_LEVEL` | logging.level | INFO |
| `PYSERVE_LOG_FILE` | logging.log_file | ./logs/pyserve.log |
| `PYSERVE_SSL_ENABLED` | ssl.enabled | false |
| `PYSERVE_SSL_CERT` | ssl.cert_file | ./ssl/cert.pem |
| `PYSERVE_SSL_KEY` | ssl.key_file | ./ssl/key.pem |

Пример использования переменных окружения:
```bash
export PYSERVE_PORT=8080
export PYSERVE_LOG_LEVEL=DEBUG
python run.py
```

## Тестирование установки

PyServe включает встроенный фреймворк тестирования для проверки установки:

```bash
# Тест всех компонентов
python run.py --test all

# Тест только конфигурации
python run.py --test configuration

# Тест только папок
python run.py --test directories
```

Тесты проверят:
- Загрузку и валидацию файла конфигурации
- Создание необходимых папок
- Конфигурацию SSL (если включена)
- Все обязательные и дополнительные настройки

## Следующие шаги

Теперь, когда у вас запущен PyServe, вы можете:

- Изучить, как [настроить PyServe](configuration) с помощью YAML файлов
- Понять, как [обслуживать статические файлы](../core-features/static-files)
- Изучить [возможности шаблонов](../core-features/templates)
- Настроить [обратное проксирование](../core-features/reverse-proxy) к другим сервисам
- Настроить [SSL/TLS шифрование](../security-and-deployment/secure) для безопасных соединений
- Настроить [систему логирования](../development-and-monitoring/logging)
