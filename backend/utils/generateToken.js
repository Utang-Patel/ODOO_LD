import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'globetrotter_super_secret_jwt_key_2026';
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  });
};

export default generateToken;
