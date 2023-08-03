import cors from 'cors';
import { config } from 'dotenv';
import express, { Response } from 'express';

config();

const randomGifs = Object.entries(process.env)
  .filter(([key]) => key.startsWith('BG__'))
  .map(([, value]) => value);
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