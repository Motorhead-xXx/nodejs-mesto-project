import { errors } from 'celebrate';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as messages from './constants/errorMessages';
import { createUser, login } from './controllers/users';
import { NotFoundError } from './errors/NotFoundError';
import { errorHandler } from './middleware/error-handler';
import { requestLogMiddleware } from './middleware/logger';
import { validateSignin, validateSignup } from './middleware/validations';
import { auth } from './middlewares/auth';
import cardsRouter from './routes/cards';
import usersRouter from './routes/users';

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/mestodb';

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Точный адрес вашего фронтенда
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(requestLogMiddleware);

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(messages.RESOURCE_NOT_FOUND));
});

app.use(errors());
app.use(errorHandler);

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
