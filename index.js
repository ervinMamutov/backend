import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import logger from './middleware/logger.js';

import userRouter from './routes/user.js';
import bookRouter from './routes/book.js';

// config dotenv
dotenv.config();
const PORT = process.env.PORT || 3009;

// initialize express
const app = express();

// cors
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

//parse body and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middleware
app.use(logger);

// use routers
app.use(userRouter);
app.use(bookRouter);

// error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// handle 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Page Not Found' });
});

// listener
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
