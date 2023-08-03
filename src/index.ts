import cors from 'cors';
import express, { Request, Response } from 'express';
import { pino } from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd hh:MM TT',
    },
  },
});

const app = express();
app.use(cors());

app.get('/', async (request: Request, response: Response) => {
  const { gist } = request.query;
  const ip = request.headers['x-forwarded-for'];

  try {
    if (!gist) throw new Error('Gist not provided');

    const raw = await fetch(`https://api.github.com/gists/${gist}`);
    if (!raw.ok) throw new Error('Gist invalid or not found');

    const rawJson = await raw.json();
    const gifs = JSON.parse(rawJson.files['terminal-backgrounds.json'].content);
    const gifsArray = Object.values(gifs) as string[];

    logger.info(`${ip} - user: ${rawJson.owner.login} - gist: ${rawJson.html_url}`);

    const randomIndex = Math.floor(Math.random() * gifsArray.length);
    response.redirect(gifsArray[randomIndex]);
  } catch (error) {
    logger.error(`${ip} - ${(error as Error).message} - gist: ${String(gist)}`);
    response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
