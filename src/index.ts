import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();
app.use(cors());

app.get('/', async (request: Request, response: Response) => {
  try {
    const { gist } = request.query;
    if (!gist) throw new Error('Gist not provided');

    const raw = await fetch(`https://api.github.com/gists/${gist}`);
    if (!raw.ok) throw new Error('Gist invalid or not found');

    const rawJson = await raw.json();
    const bgs = JSON.parse(rawJson.files['terminal-backgrounds.json'].content);
    const bgsArray = Object.values(bgs) as string[];

    const randomIndex = Math.floor(Math.random() * bgsArray.length);
    response.redirect(bgsArray[randomIndex]);
  } catch {
    response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
