const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi untuk mengenkripsi password
const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Fungsi untuk memverifikasi password
const verifyPassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

// Fungsi untuk membuat token JWT
const generateToken = (payload, secretKey, expiresIn) => {
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

// Middleware untuk mengautentikasi pengguna
const authenticateUser = (req, res, next) => {
  // Mendapatkan token dari header Authorization
  const token = req.headers.authorization;

  // Memeriksa apakah token ada
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  // Memverifikasi token dan mendapatkan data pengguna
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Menyimpan data pengguna dalam objek req
    req.user = decoded;

    // Melanjutkan ke middleware selanjutnya
    next();
  });
};

module.exports = { hashPassword, verifyPassword, generateToken, authenticateUser };
