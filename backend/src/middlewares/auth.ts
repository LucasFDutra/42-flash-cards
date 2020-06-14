import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import credentials from '../../credentials';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts: string[] = authHeader.split(' ');

  if (!(parts.length === 2)) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  jwt.verify(token, credentials.authSecret.secret, (err, decoded: any) => {
    if (err) {
      return res.status(401).send({ error: 'Token invalid' });
    }
    req.body.idUser = decoded.idUser;
    return next();
  });
};

export default authMiddleware;
