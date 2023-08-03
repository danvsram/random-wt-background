import cors from 'cors';
import express, { Response } from 'express';
import gifs from '#/gifs.json' assert { type: 'json' };

const randomGifs = Object.values(gifs).map((value) => value);
const app = express();
app.use(cors());

app.get('/', (_request, response: Response) => {
  const randomIndex = Math.floor(Math.random() * randomGifs.length);
  response.redirect(randomGifs[randomIndex]!);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
