const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateUser } = require('../auth');

const router = express.Router();

// Rute untuk registrasi pengguna baru
router.post('/register', register);

// Rute untuk login pengguna
router.post('/login', login);

// Rute contoh yang memerlukan autentikasi pengguna
router.get('/protected', authenticateUser, (req, res) => {
  res.status(200).json({ message: 'You have accessed protected route' });
});

module.exports = router;
