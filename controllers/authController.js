const { hashPassword, verifyPassword, generateToken } = require('../auth');
const Member = require('../models/member');

// Registrasi pengguna baru
const register = async (req, res) => {
  try {
    const { name, gender, phone, email, username, password, is_staff } = req.body;

    // Mengecek apakah username sudah digunakan
    const existingMember = await Member.findOne({ username });
    if (existingMember) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Mengenkripsi password
    const hashedPassword = await hashPassword(password);

    // Membuat objek member baru
    const newMember = new Member({
      name,
      gender,
      phone,
      email,
      username,
      password: hashedPassword,
      is_staff,
    });

    // Menyimpan member baru ke database
    const savedMember = await newMember.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login pengguna
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Mencari member berdasarkan username
    const member = await Member.findOne({ username });
    if (!member) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Memverifikasi password
    const isMatch = await verifyPassword(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Membuat payload untuk token JWT
    const payload = {
      id: member._id,
      username: member.username,
    };

    // Membuat token JWT
    const token = generateToken(payload, process.env.JWT_SECRET, '1d');

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register, login };
