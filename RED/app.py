"""
Cyberpunk RED - Приложение для заполнения листов с точным соответствием оригинальным PDF
"""

from flask import Flask, render_template, request, send_file, jsonify, redirect, url_for
import json
import os
import platform
from datetime import datetime
import pdfkit
import io
import base64
from PIL import Image, ImageDraw, ImageFont
import tempfile

app = Flask(__name__)
app.config['SECRET_KEY'] = 'cyberpunk-red-exact-copy'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Конфигурация PDFKit с поддержкой разных платформ
def get_wkhtmltopdf_path():
    # Определяем операционную систему
    system = platform.system().lower()
    
    # Для Windows путь к включенному wkhtmltopdf
    if system == 'windows':
        local_path = os.path.join(os.path.dirname(__file__), 'wkhtmltopdf', 'bin', 'wkhtmltopdf.exe')
        if os.path.exists(local_path):
            return local_path
        # Если локальный путь не существует, пробуем стандартный путь установки
        standard_path = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
        if os.path.exists(standard_path):
            return standard_path
    else:
        # Для Linux и других Unix-систем пробуем использовать установленный wkhtmltopdf
        # или путь внутри проекта (если применимо)
        local_path = os.path.join(os.path.dirname(__file__), 'wkhtmltopdf', 'bin', 'wkhtmltopdf')
        if os.path.exists(local_path):
            return local_path
        # По умолчанию используем системный путь
        return '/usr/local/bin/wkhtmltopdf'
    
    # Если ничего не нашли, используем просто имя команды
    return 'wkhtmltopdf'

WKHTMLTOPDF_PATH = get_wkhtmltopdf_path()
try:
    config = pdfkit.configuration(wkhtmltopdf=WKHTMLTOPDF_PATH)
except OSError:
    # Если не можем создать конфигурацию, работаем без неё
    config = None

# Папки для хранения
DATA_FOLDER = 'data'
TEMPLATES_FOLDER = 'templates'
STATIC_FOLDER = 'static'

if not os.path.exists(DATA_FOLDER):
    os.makedirs(DATA_FOLDER)

# Файлы данных
CHARACTERS_FILE = os.path.join(DATA_FOLDER, 'characters.json')
VEHICLES_FILE = os.path.join(DATA_FOLDER, 'vehicles.json')
CREWS_FILE = os.path.join(DATA_FOLDER, 'crews.json')

# Инициализация файлов
def init_files():
    defaults = {
        CHARACTERS_FILE: [],
        VEHICLES_FILE: [],
        CREWS_FILE: []
    }
    
    for file_path, default in defaults.items():
        if not os.path.exists(file_path):
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(default, f, ensure_ascii=False, indent=2)

# ========================
# ГЛАВНАЯ СТРАНИЦА
# ========================
@app.route('/')
def index():
    return render_template('index.html')

# ========================
# ПЕРСОНАЖИ (ТВОЙ ЧУМБА)
# ========================
@app.route('/character', methods=['GET'])
def character_form():
    """Форма создания/редактирования персонажа (альбомная ориентация)"""
    character_id = request.args.get('id')
    character = None
    
    if character_id:
        try:
            with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
                characters = json.load(f)
                for char in characters:
                    if str(char.get('id')) == character_id:
                        character = char
                        break
        except:
            pass
    
    return render_template('character_form.html', character=character)

@app.route('/api/character', methods=['POST'])
def save_character():
    """Сохранение персонажа"""
    try:
        data = request.json
        
        # Загружаем существующих персонажей
        with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
            characters = json.load(f)
        
        # Обновляем или создаем нового
        character_id = data.get('id')
        if character_id:
            for i, char in enumerate(characters):
                if str(char.get('id')) == character_id:
                    characters[i] = data
                    break
        else:
            data['id'] = len(characters) + 1
            data['created_at'] = datetime.now().isoformat()
            characters.append(data)
        
        # Сохраняем
        with open(CHARACTERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(characters, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True, 'id': data['id']})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/character/<int:character_id>/pdf')
def character_pdf(character_id):
    """Генерация PDF для персонажа (альбомная ориентация)"""
    try:
        # Находим персонажа
        with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
            characters = json.load(f)
        
        character = None
        for char in characters:
            if char.get('id') == character_id:
                character = char
                break
        
        if not character:
            return "Персонаж не найден", 404
        
        # Проверяем доступность wkhtmltopdf
        if config is None:
            return "PDF сервис временно недоступен", 503
            
        # Генерируем HTML для PDF
        html = render_template('character_pdf.html', data=character)
        
        # Опции для альбомной ориентации
        options = {
            'page-size': 'A4',
            'orientation': 'Landscape',
            'margin-top': '0mm',
            'margin-right': '0mm',
            'margin-bottom': '0mm',
            'margin-left': '0mm',
            'encoding': "UTF-8",
            'no-outline': None,
            'quiet': '',
            'disable-smart-shrinking': '',
            'print-media-type': ''
        }
        
        # Конвертируем в PDF
        pdf_bytes = pdfkit.from_string(html, False, options=options, configuration=config)
        
        # Возвращаем PDF
        buffer = io.BytesIO(pdf_bytes)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"character_{character_id}.pdf"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================
# ШЕСТЕРКИ (ПРОЖЖЕННЫЕ ШЕСТЕРКИ)
# ========================
@app.route('/crew', methods=['GET'])
def crew_form():
    """Форма создания/редактирования шестерки"""
    crew_id = request.args.get('id')
    crew = None
    
    if crew_id:
        try:
            with open(CREWS_FILE, 'r', encoding='utf-8') as f:
                crews = json.load(f)
                for c in crews:
                    if str(c.get('id')) == crew_id:
                        crew = c
                        break
        except:
            pass
    
    return render_template('crew_form.html', crew=crew)

@app.route('/api/crew', methods=['POST'])
def save_crew():
    """Сохранение шестерки"""
    try:
        data = request.json
        
        with open(CREWS_FILE, 'r', encoding='utf-8') as f:
            crews = json.load(f)
        
        crew_id = data.get('id')
        if crew_id:
            for i, c in enumerate(crews):
                if str(c.get('id')) == crew_id:
                    crews[i] = data
                    break
        else:
            data['id'] = len(crews) + 1
            data['created_at'] = datetime.now().isoformat()
            crews.append(data)
        
        with open(CREWS_FILE, 'w', encoding='utf-8') as f:
            json.dump(crews, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True, 'id': data['id']})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/crew/<int:crew_id>/pdf')
def crew_pdf(crew_id):
    """Генерация PDF для шестерки"""
    try:
        with open(CREWS_FILE, 'r', encoding='utf-8') as f:
            crews = json.load(f)
        
        crew = None
        for c in crews:
            if c.get('id') == crew_id:
                crew = c
                break
        
        if not crew:
            return "Шестерка не найдена", 404
            
        # Проверяем доступность wkhtmltopdf
        if config is None:
            return "PDF сервис временно недоступен", 503
        
        html = render_template('crew_pdf.html', data=crew)
        
        # Опции для портретной ориентации
        options = {
            'page-size': 'A4',
            'orientation': 'Portrait',
            'margin-top': '0mm',
            'margin-right': '0mm',
            'margin-bottom': '0mm',
            'margin-left': '0mm',
            'encoding': "UTF-8",
            'no-outline': None,
            'quiet': '',
            'disable-smart-shrinking': '',
            'print-media-type': ''
        }
        
        pdf_bytes = pdfkit.from_string(html, False, options=options, configuration=config)
        
        buffer = io.BytesIO(pdf_bytes)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"crew_{crew_id}.pdf"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================
# ТРАНСПОРТ (ТАЧКА)
# ========================
@app.route('/vehicle', methods=['GET'])
def vehicle_form():
    """Форма создания/редактирования транспорта"""
    vehicle_id = request.args.get('id')
    vehicle = None
    
    if vehicle_id:
        try:
            with open(VEHICLES_FILE, 'r', encoding='utf-8') as f:
                vehicles = json.load(f)
                for v in vehicles:
                    if str(v.get('id')) == vehicle_id:
                        vehicle = v
                        break
        except:
            pass
    
    return render_template('vehicle_form.html', vehicle=vehicle)

@app.route('/api/vehicle', methods=['POST'])
def save_vehicle():
    """Сохранение транспорта"""
    try:
        data = request.json
        
        with open(VEHICLES_FILE, 'r', encoding='utf-8') as f:
            vehicles = json.load(f)
        
        vehicle_id = data.get('id')
        if vehicle_id:
            for i, v in enumerate(vehicles):
                if str(v.get('id')) == vehicle_id:
                    vehicles[i] = data
                    break
        else:
            data['id'] = len(vehicles) + 1
            data['created_at'] = datetime.now().isoformat()
            vehicles.append(data)
        
        with open(VEHICLES_FILE, 'w', encoding='utf-8') as f:
            json.dump(vehicles, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True, 'id': data['id']})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/vehicle/<int:vehicle_id>/pdf')
def vehicle_pdf(vehicle_id):
    """Генерация PDF для транспорта"""
    try:
        with open(VEHICLES_FILE, 'r', encoding='utf-8') as f:
            vehicles = json.load(f)
        
        vehicle = None
        for v in vehicles:
            if v.get('id') == vehicle_id:
                vehicle = v
                break
        
        if not vehicle:
            return "Транспорт не найден", 404
            
        # Проверяем доступность wkhtmltopdf
        if config is None:
            return "PDF сервис временно недоступен", 503
        
        html = render_template('vehicle_pdf.html', data=vehicle)
        
        # Опции для портретной ориентации
        options = {
            'page-size': 'A4',
            'orientation': 'Portrait',
            'margin-top': '0mm',
            'margin-right': '0mm',
            'margin-bottom': '0mm',
            'margin-left': '0mm',
            'encoding': "UTF-8",
            'no-outline': None,
            'quiet': '',
            'disable-smart-shrinking': '',
            'print-media-type': ''
        }
        
        pdf_bytes = pdfkit.from_string(html, False, options=options, configuration=config)
        
        buffer = io.BytesIO(pdf_bytes)
        buffer.seek(0)
        
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"vehicle_{vehicle_id}.pdf"
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========================
# СПИСКИ И УДАЛЕНИЕ
# ========================
@app.route('/characters')
def characters_list():
    """Список всех персонажей"""
    with open(CHARACTERS_FILE, 'r', encoding='utf-8') as f:
        characters = json.load(f)
    
    return render_template('characters_list.html', characters=characters)

@app.route('/api/delete/<string:type>/<int:item_id>', methods=['DELETE'])
def delete_item(type, item_id):
    """Удаление элемента"""
    try:
        if type == 'character':
            file_path = CHARACTERS_FILE
        elif type == 'vehicle':
            file_path = VEHICLES_FILE
        elif type == 'crew':
            file_path = CREWS_FILE
        else:
            return jsonify({'success': False, 'error': 'Неверный тип'})
        
        with open(file_path, 'r', encoding='utf-8') as f:
            items = json.load(f)
        
        # Фильтруем
        items = [item for item in items if item.get('id') != item_id]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(items, f, ensure_ascii=False, indent=2)
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# ========================
# ЗАПУСК ПРИЛОЖЕНИЯ
# ========================
if __name__ == '__main__':
    init_files()
    app.run(debug=True, port=5000)