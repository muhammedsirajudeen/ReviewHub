import { verify } from 'jsonwebtoken';
const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export default verifyToken;
