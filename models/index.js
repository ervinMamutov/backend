import { Sequelize, DataTypes } from 'sequelize';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import createUser from './user.js';
import createBook from './book.js';

// construct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// path configuration
dotenv.config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,

  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been successfully');
  })
  .catch((err) => {
    console.error(`Unable to connect to the database: ${err}`);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = createUser(sequelize, DataTypes);
db.books = createBook(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log('Ok, re-send down');
});

// 1 to Many relation
db.users.hasMany(db.books, {
  foreignKey: 'user_id',
  as: 'book'
});

db.books.belongsTo(db.users, {
  foreignKey: 'user_id',
  as: 'user'
});

export default db;
