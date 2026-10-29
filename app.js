const express = require('express');
const versionResolver = require('./middlewares/versionResolver');
const books = require('./data/books');

const app = express();
const PORT = 3000;

app.use(express.json());

// Return a consistent client error instead of Express's default HTML response
// when a request contains malformed JSON.
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload.'
        });
    }
    return next(error);
});

app.use(versionResolver);
app.get('/api/books', (req, res) => {
    const version = req.apiVersion;
    const { limit } = req.query;

    if (limit !== undefined && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
        return res.status(400).json({
            success: false,
            message: 'limit must be an integer between 1 and 100.'
        });
    }

    const limitedBooks = limit === undefined ? books : books.slice(0, Number(limit));

    if (version === 'v1') {
        // Gắn header thông báo sắp ngừng hỗ trợ (Deprecation Policy)
        res.setHeader('Deprecation', 'true');
        res.setHeader('Sunset', 'Wed, 31 Dec 2025 23:59:59 GMT');

        // Format lại data: author chỉ lấy chuỗi tên
        const v1Data = limitedBooks.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author.name
        }));

        return res.status(200).json({ success: true, data: v1Data });
    }

    if (version === 'v2') {
        // Format lại data: author là object, thêm publishedYear
        const v2Data = limitedBooks.map(book => ({
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

app.post('/api/books', (req, res) => {
    const { title, author, publishedYear } = req.body || {};

    if (!title || !author || !author.name || !Number.isInteger(publishedYear)) {
        return res.status(400).json({
            success: false,
            message: 'title, author.name and publishedYear are required.'
        });
    }

    const book = {
        id: books.length + 1,
        title,
        author: { id: author.id || books.length + 1, name: author.name },
        publishedYear
    };
    books.push(book);
    return res.status(201).json({ success: true, data: book });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
