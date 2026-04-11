import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP_STATUS_NOT_FOUND } from './constants/httpStatus';
import cardsRouter from './routes/cards';
import usersRouter from './routes/users';
import { sendError } from './utils/handleError';

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mestodb';


const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '69d9872f0d08fa8008b06e30',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((_req: Request, res: Response) => (
  sendError(res, HTTP_STATUS_NOT_FOUND, 'Запрашиваемый ресурс не найден')
));

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Слушаем порт ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Ошибка подключения к MongoDB', err);
    process.exit(1);
  });
