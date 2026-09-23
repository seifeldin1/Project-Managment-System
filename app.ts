import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './src/middlewares/error.middleware';
import { AppError } from './src/errors/AppError';

const app = express();

app.use(helmet()); 

app.use(express.json({ limit: '20kb' })); 
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running smoothly' });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

export default app;