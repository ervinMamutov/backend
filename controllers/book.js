import db from '../models/index.js';

const Book = db.books;

const bookControllers = {
  getBooks: async (req, res) => {
    try {
      const books = await Book.findAll();
      return res.status(200).json({ success: true, books });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: 'The book not found' });
    }
  },
  getBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      if (book) {
        return res.status(200).json({ success: true, book });
      } else {
        return res
          .status(404)
          .json({ success: false, error: 'The book not found' });
      }
    } catch (err) {
      return (
        res.status(500),
        json({ success: false, err: 'Failed to retrieve book' })
      );
    }
  },
  getUserBooks: async (req, res) => {
    try {
      const user_id = Number(req.params.user_id);
      const books = await Book.findAll({
        where: { user_id }
      });

      if (books.length > 0) {
        return res.status(200).json({ success: true, books });
      } else {
        return res.status(404).json({
          success: false,
          error: 'No books were found for the special user'
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: `Failed to retrieve user's books` });
    }
  },
  addBook: async (req, res) => {
    try {
      const { title, author, description, img, price, user_id } = req.body;
      if (!title || !price || !user_id) {
        return res
          .status(400)
          .json({ success: false, err: 'Please add the required data' });
      }
      const book = await Book.create({
        title,
        author,
        description,
        img,
        price,
        user_id
      });
      return res.status(201).json({ success: true, book });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: 'Failed to create book' });
    }
  },
  updateBook: async (req, res) => {
    try {
      const { id } = req.params;
      const [updateCount] = await Book.update(req.body, { where: { id } });
      console.log(updateCount);

      if (updateCount === 0) {
        return res
          .status(404)
          .json({ success: false, err: 'Book not found for update' });
      }
      return res.status(200).json({
        success: true,
        message: `Book with id: ${id} update successfully`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: 'Failed to update book' });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCount = await Book.destroy({
        where: { id }
      });
      if (deletedCount === 0) {
        return res
          .status(404)
          .json({ success: false, error: 'Book not found for deleting' });
      }
      return res
        .status(200)
        .json({ success: true, message: `Book with id ${id} is deleted` });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: 'Failed to delete book' });
    }
  }
};

export default bookControllers;
