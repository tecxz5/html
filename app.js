const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname, 'site')));

// Обработка маршрутов
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'site', 'pages', 'index', 'main', 'index.html'));
});

app.use((req, res, next) => {
    let filePath = path.join(__dirname, 'site', req.path);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        // Если файл не найден, пробуем добавить 'index.html' по умолчанию
        filePath = path.join(__dirname, 'site', req.path, 'index.html');
        
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath); // Отправляем индексный файл
        }

        // Если и его нет, передаем обработку следующему мидлвару
        next();
    }
});

app.use((req, res) => {
    const errorFilePath = path.join(__dirname, 'site', 'errors', '404', '404.html');

    if (fs.existsSync(errorFilePath)) {
        res.status(404).sendFile(errorFilePath);
    } else {
        res.status(404).send('Page not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});