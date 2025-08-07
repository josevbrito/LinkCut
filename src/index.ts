import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3000;

// In-memory store for URLs.
const urlStore = new Map<string, string>();

// Middleware to parse JSON bodies
app.use(express.json());

// A simple welcome route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the URL Shortener API!', instructions: 'Use POST /shorten to shorten a URL or GET /<shortCode> to redirect.' });
});

// Endpoint to shorten a URL
app.post('/shorten', (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate a unique short code
    const shortCode = nanoid(7);
    urlStore.set(shortCode, url);

    const shortenedUrl = `http://localhost:${PORT}/${shortCode}`;
    return res.json({ shortenedUrl });
});

// Endpoint to redirect from the short URL
app.get('/:shortCode', (req: Request, res: Response) => {
    const { shortCode } = req.params;
    const longUrl = urlStore.get(shortCode);

    if (longUrl) {
        // Redirect the user to the original URL
        return res.redirect(longUrl);
    } else {
        return res.status(404).json({ error: 'URL not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});