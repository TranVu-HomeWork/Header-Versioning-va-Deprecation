const express = require('express');
const versionResolver = require('./middlewares/versionResolver');
const books = require('./data/books');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(versionResolver);
app.get('/api/books', (req, res) => {
    const version = req.apiVersion;

    if (version === 'v1') {
        // Gắn header thông báo sắp ngừng hỗ trợ (Deprecation Policy)
        res.setHeader('Deprecation', 'true');
        res.setHeader('Sunset', 'Wed, 31 Dec 2025 23:59:59 GMT');

        // Format lại data: author chỉ lấy chuỗi tên
        const v1Data = books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author.name
        }));

        return res.status(200).json({ success: true, data: v1Data });
    }

    if (version === 'v2') {
        // Format lại data: author là object, thêm publishedYear
        const v2Data = books.map(book => ({
            id: book.id,
            title: book.title,
            author: {
                id: book.author.id,
                name: book.author.name
            },
            publishedYear: book.publishedYear
        }));

        return res.status(200).json({ success: true, data: v2Data });
    }
    return res.status(400).json({
        success: false,
        error: {
            code: "UNSUPPORTED_API_VERSION",
            message: `API version '${version}' is not supported.`
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});