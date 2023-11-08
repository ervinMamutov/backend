import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../models/index.js';
import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import hashPassword from '../utils/hashPassword.js';

const User = db.users;

const userControllers = {
  register: async (req, res) => {
    try {
      const { email, password, rePassword } = req.body;

      //Check if email already exist
      const emailExist = await User.findOne({ where: { email: email } });
      if (emailExist) {
        return res
          .status(400)
          .json({ success: false, message: 'Email already exist' });
      }

      // Validate email and password
      if (
        !validateEmail(email) ||
        !validatePassword(password) ||
        !matchPasswords(password, rePassword)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password format'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      //Grate a new user
      await User.create({
        email,
        password: hashedPassword
      });

      return res.status(201).json({
        success: true,
        message: `The user with ${email} has been registered`
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, err: 'Registration failed' });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if the email exist
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please try again.'
        });
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // create token
        const token = jwt.sign({ user: user }, process.env.TOKEN_ACCESS_SECRET);

        // set cookies
        res.cookie('id', user.id, {
          secure: true,
          sameSite: 'None'
        });
        res.cookie('token', token, {
          httpOnly: true,
          sameSite: 'None',
          secure: true
        });

        return res.status(200).json({ success: true, token, id: user.id });
      } else {
        return res.status(401).json({
          success: false,
          message: 'The email or the password incorrect'
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        err: 'Email or password does not exist'
      });
    }
  },
  logout: (req, res) => {
    // Clear cookies
    res.clearCookie('token');
    res.clearCookie('id');

    return res
      .status(200)
      .json({ success: true, message: 'The user logout successfully' });
  }
};

export default userControllers;
