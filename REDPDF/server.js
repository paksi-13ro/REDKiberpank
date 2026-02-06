const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PDFLib = require('pdf-lib');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(multer().none());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Storage directory for filled PDFs
const STORAGE_DIR = path.join(__dirname, 'storage');
if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// In-memory storage for simplicity (use a database in production)
let users = [
    { id: 1, username: 'admin1', password: 'admin123', role: 'admin' },
    { id: 2, username: 'admin2', password: 'admin456', role: 'admin' }
];

let characters = [];

// Routes

// Admin login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Неверные учетные данные'
        });
    }
});

// Get all users (admin only)
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Create a new user (admin only)
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    
    // Check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({
            success: false,
            message: 'Пользователь уже существует'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        password, // In production, hash passwords!
        role: 'user'
    };
    
    users.push(newUser);
    
    res.json({
        success: true,
        user: newUser
    });
});

// Delete a user (admin only)
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Пользователь не найден'
        });
    }
    
    // Don't allow deletion of admin users
    if (users[userIndex].role === 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Нельзя удалить администратора'
        });
    }
    
    users.splice(userIndex, 1);
    
    res.json({
        success: true,
        message: 'Пользователь удален успешно'
    });
});

// Get all characters (admin only)
app.get('/api/characters', (req, res) => {
    res.json(characters);
});

// Save character data
app.post('/api/characters', (req, res) => {
    const characterData = req.body;
    
    const newCharacter = {
        id: uuidv4(),
        ...characterData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    characters.push(newCharacter);
    
    res.json({
        success: true,
        character: newCharacter
    });
});

// Fill PDF with character data
app.post('/api/fill-pdf', async (req, res) => {
    try {
        const characterData = req.body;
        
        // Path to the template PDF
        const templatePath = path.join(__dirname, 'template.pdf');
        
        // Check if template exists
        if (!fs.existsSync(templatePath)) {
            return res.status(404).json({
                success: false,
                message: 'Шаблон PDF не найден. Пожалуйста, поместите файл template.pdf в корневую директорию.'
            });
        }
        
        // Read the template PDF
        const templateBytes = fs.readFileSync(templatePath);
        
        // Load the PDF with PDF-Lib
        const pdfDoc = await PDFLib.PDFDocument.load(templateBytes);
        
        // Get form fields
        const form = pdfDoc.getForm();
        
        // Fill the form fields with character data
        // This is a simplified example - you'll need to map your actual field names
        Object.keys(characterData).forEach(key => {
            const value = characterData[key];
            try {
                const field = form.getField(key);
                
                if (field instanceof PDFLib.PDFTextField) {
                    field.setText(value ? value.toString() : '');
                } else if (field instanceof PDFLib.PDFCheckBox) {
                    if (typeof value === 'boolean') {
                        value ? field.check() : field.uncheck();
                    } else {
                        field.uncheck(); // default
                    }
                } else if (field instanceof PDFLib.PDFRadioGroup) {
                    field.select(value ? value.toString() : '');
                } else if (field instanceof PDFLib.PDFDropdown) {
                    field.select(value ? value.toString() : '');
                }
            } catch (error) {
                // Field doesn't exist in PDF, skip it
                console.log(`Поле ${key} не найдено в шаблоне PDF, пропускаем...`);
            }
        });
        
        // Flatten the form to make it non-editable
        form.flatten();
        
        // Generate the filled PDF bytes
        const filledPdfBytes = await pdfDoc.save();
        
        // Generate a unique filename
        const filename = `filled-character-${uuidv4()}.pdf`;
        const filePath = path.join(STORAGE_DIR, filename);
        
        // Write the filled PDF to storage
        fs.writeFileSync(filePath, filledPdfBytes);
        
        res.json({
            success: true,
            filename: filename,
            downloadUrl: `/api/download/${filename}`
        });
    } catch (error) {
        console.error('Ошибка при заполнении PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при заполнении PDF',
            error: error.message
        });
    }
});

// Download filled PDF
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(STORAGE_DIR, filename);
    
    // Verify file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'Файл не найден'
        });
    }
    
    res.download(filePath, `character-sheet-${Date.now()}.pdf`, (err) => {
        if (err) {
            console.error('Ошибка при скачивании файла:', err);
            res.status(500).json({
                success: false,
                message: 'Ошибка при скачивании файла'
            });
        }
    });
});

// Get all filled PDFs (admin only)
app.get('/api/pdfs', (req, res) => {
    const pdfFiles = fs.readdirSync(STORAGE_DIR).filter(file => path.extname(file) === '.pdf');
    res.json(pdfFiles.map(filename => ({
        filename,
        url: `/api/download/${filename}`,
        createdAt: fs.statSync(path.join(STORAGE_DIR, filename)).mtime.toISOString()
    })));
});

// Start server
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Директория хранения: ${STORAGE_DIR}`);
});