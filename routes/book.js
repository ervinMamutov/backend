import express from 'express';

import verifyToken from '../middleware/verifyToken.js';
import verifyUserId from '../middleware/verifyUserId.js';
import bookControllers from '../controllers/book.js';

const router = express.Router();

// routers
router.get('/', bookControllers.getBooks);
router.get('/get-book/:id', bookControllers.getBook);
router.get(
  '/get-user-books/:user_id',
  verifyToken,

  bookControllers.getUserBooks
);
router.post('/add-book', verifyToken, bookControllers.addBook);
router.put('/update-book/:id', verifyToken, bookControllers.updateBook);
router.delete('/delete/:id', verifyToken, bookControllers.deleteBook);

export default router;
