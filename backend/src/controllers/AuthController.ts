import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import validate from 'validate.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import AuthModel from '../models/AuthModel';
import credentials from '../../credentials';

interface ItokenParams {
  idUser: string,
}

const generateToken = (params: ItokenParams) => {
  return jwt.sign(params, credentials.authSecret.secret, {
    expiresIn: 28800,
  });
};

const isValidateEmail = (email: string) => {
  const constraints = {
    from: {
      email: true,
    },
  };
  const isValidate = validate({ from: email }, constraints);

  return isValidate === undefined;
};

export default {
  async register(req: Request, res: Response) {
    const { email } = req.body;

    if (!isValidateEmail(email)) {
      return res.status(400).send({ error: 'Ivalid email' });
    }

    try {
      const user = await AuthModel.findUser(email);

      if (user) {
        return res.status(400).send({ error: 'User already exists' });
      }

      req.body.idUser = crypto.randomBytes(8).toString('HEX');
      const newUser = await AuthModel.insertUser(req.body);

      const token = generateToken({ idUser: newUser.id_user_pk });

      return res.json({ token });
    } catch (error) {
      return res.status(400).send({ error: 'Registration failed' });
    }
  },

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!isValidateEmail(email)) {
      return res.status(400).send({ error: 'Ivalid email' });
    }

    const user = await AuthModel.findUser(email, true);

    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Invalid password' });
    }

    const token = generateToken({ idUser: user.id_user_pk });

    return res.json({ token });
  },
};
