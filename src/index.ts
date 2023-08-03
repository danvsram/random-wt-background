import cors from 'cors';
import express, { Request, Response } from 'express';
import { pino } from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
  },
});

const app = express();
app.use(cors());

app.get('/', async (request: Request, response: Response) => {
  const { gist } = request.query;

  try {
    const raw = await fetch(`https://api.github.com/gists/${gist}`);
    const rawJson = await raw.json();
    const gifs = JSON.parse(rawJson.files['gifs.json'].content);
    const gifsArray = Object.values(gifs) as string[];

    logger.info(`user: ${rawJson.owner.login} - gist: ${gist}`);

    const randomIndex = Math.floor(Math.random() * gifsArray.length);
    response.redirect(gifsArray[randomIndex]);
  } catch (error) {
    logger.error(error);
    response.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
