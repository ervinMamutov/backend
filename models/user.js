const createUser = (sequelize, DataType) => {
  const User = sequelize.define('user', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataType.STRING,
      allowNull: false
    }
  });
  return User;
};

export default createUser;
