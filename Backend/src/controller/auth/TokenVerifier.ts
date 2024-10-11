import { Request, Response } from 'express';
import { IUser } from '../../model/User';
import { sign, verify } from 'jsonwebtoken';
import { addValueToCache, getValueFromCache } from '../../helper/redisHelper';
import { randomUUID } from 'crypto';
const TokenVerifier = (req: Request, res: Response) => {
  const user = req.user as IUser;
  if (user.verified) {
    res.status(200).json({ message: 'success', user: req.user });
  } else {
    res.status(401).json({ message: 'unauthorized' });
  }
};

const RefreshToken = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    if (refresh_token) {
      const decoded = verify(
        refresh_token,
        process.env.REFRESH_SECRET_KEY as string
      ) as IUser;
      if (decoded) {
        const fromCache = await getValueFromCache(`refresh-${decoded.email}`);
        if (fromCache !== refresh_token) {
          res.status(401).json({ message: 'unauthorized' });
        } else {
          const token = sign(
            {
              id: decoded.id,
              email: decoded.email,
            },
            process.env.SECRET_KEY ?? '',
            { expiresIn: '5m' }
          );
          const refresh_token = sign(
            {
              id: decoded.id,
              email: decoded.email,
              random: randomUUID(),
            },
            process.env.REFRESH_SECRET_KEY as string,
            { expiresIn: '7d' }
          );
          addValueToCache(`refresh-${decoded.email}`, refresh_token, 10000);
          res
            .status(200)
            .json({
              message: 'success',
              token: token,
              refresh_token: refresh_token,
            });
        }
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(400).json({ message: 'invalid request' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'server error occured' });
  }
};

//TODO: implement the logout handler and add the last seen status here too

export default {
  TokenVerifier,
  RefreshToken,
};
