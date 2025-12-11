# Cyberpunk RED Character Sheet Generator

## Описание

Приложение для генерации листов персонажей, транспорта и группировок для настольной ролевой игры Cyberpunk RED с точным соответствием оригинальным PDF-формам.

## Установка

1. Клонируйте репозиторий:
```
git clone <repo-url>
cd RED
```

2. Установите зависимости Python:
```
pip install -r requirements.txt
```

3. Установите wkhtmltopdf:
   
   ### Windows:
   - Скачайте установщик с официального сайта: https://wkhtmltopdf.org/downloads.html
   - Или используйте включенную версию в папке `wkhtmltopdf`
   
   ### Linux (Ubuntu/Debian):
   ```
   sudo apt-get update
   sudo apt-get install wkhtmltopdf
   ```
   
   ### macOS:
   ```
   brew install wkhtmltopdf
   ```

## Запуск

```
python app.py
```

Откройте в браузере http://localhost:5000

## Использование

1. Создайте персонажа, транспорт или группировку через соответствующие формы
2. Сохраните данные
3. Сгенерируйте PDF для печати

## Особенности

- Точные копии оригинальных форм Cyberpunk RED
- Хранение данных в JSON файлах
- Возможность редактирования существующих записей
- Экспорт в PDF с сохранением форматирования