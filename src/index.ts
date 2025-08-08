import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import cors from 'cors';

const app = express();
const PORT = 3000;

// In-memory store for URLs.
const urlStore = new Map<string, string>();

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

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