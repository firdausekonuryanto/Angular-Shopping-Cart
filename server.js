const express = require('express');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname); 
  }
});

const upload  = multer({ storage: storage });
const app     = express();
const port    = 3000;
const url     = "mongodb://127.0.0.1:27017";
const client  = new MongoClient(url);
const dbName  = "angular-example";

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());

// Konfigurasi express-session
app.use(
  session({
    secret: 'rahasia', // rahasia ini dapat diganti
    resave: false,
    saveUninitialized: true
  })
);

// ------------------------------------------------------- batas konfigurasi ----------------------------------------------------- 
// ----------------------------------------------------------------- login -------------------------------------------------------

// Middleware untuk memverifikasi token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token tidak ada' });
  }
  jwt.verify(token, 'rahasia_token', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }
    req.user = decoded;
    next();
  });
}

app.post('/api/auth/login', bodyParser.urlencoded(), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('members');
    const member = await collection.findOne({ username, password });

    if (!member) {
      return res.sendStatus(401);
    }

    res.locals.username = username;
    res.locals.success = true; 
    const token = jwt.sign({ username }, 'rahasia_token'); // rahasia_token ini dapat diganti
    req.session.token = token;
    res.send({ message: 'Login berhasil', token, username:username });

    next();
  } catch (err) {
    console.error('Gagal menemukan anggota:', err);
    res.sendStatus(500);
  }
},
(req, res) => {
  req.session.loggedIn = true;
  req.session.username = res.locals.username;
  console.log(req.session);
  });

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.send("Thank you! Visit again");
});

// ----------------------------------------------------------------- batas login -----------------------------------------------------
// ----------------------------------------------------------------- PRODUCT ---------------------------------------------------------

app.get("/products", verifyToken, async (req, res) => {
  console.log(req.session.username);
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("products");
  let results = await collection.find({}).limit(50).toArray();
  res.json(results);
});

app.get("/products_home", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("products");
  let results = await collection.find({}).limit(10).toArray();

  const halfIndex = Math.ceil(results.length / 2);
  const firstHalf = results.slice(0, halfIndex);
  const secondHalf = results.slice(halfIndex);

  res.json({ firstHalf, secondHalf });
});

app.post("/products", verifyToken, upload.single('gambar'), async (req, res) => {
  const file = req.file;
  const product = req.body;
  console.log(product);
  product.id = generateId();
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("products");
  await collection.insertOne(product);
  res.status(201).json(product);
});

app.put('/products/:id', upload.single('gambar'), async (req, res) => {
  const productId = parseInt(req.params.id);
  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("products");
  const existingProduct = await collection.findOne({ id: productId });

  if (existingProduct.gambar) {
    const filePath = path.join(__dirname, 'uploads', existingProduct.gambar);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  if (req.file) {
    const updatedProduct = { ...existingProduct, ...req.body, gambar: req.file.filename };
    delete updatedProduct._id;
    await collection.updateOne({ id: productId }, { $set: updatedProduct });
    res.json(updatedProduct);
  } else {
    const updatedProduct = { ...existingProduct, ...req.body };
    delete updatedProduct._id;
    await collection.updateOne({ id: productId }, { $set: updatedProduct });
    res.json(updatedProduct);
  }
});

app.delete('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("products");
  const deletedProduct = await collection.findOneAndDelete({ id: productId });

  if (deletedProduct.value) {
    const filePath = path.join(__dirname, 'uploads', deletedProduct.value.gambar);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.json(deletedProduct.value);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// --------------------------------------------------------------- END PRODUCT -----------------------------------------------
// --------------------------------------------------------------  MEMBER ----------------------------------------------------

app.get("/members", verifyToken, async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("members");
  let results = await collection.find({}).limit(50).toArray();
  res.json(results);
});

app.post("/members", async (req, res) => {
  const member = req.body;
  console.log(member);
  member.id = generateId();
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("members");
  await collection.insertOne(member);
  res.status(201).json(member);
});

app.put('/members/:id', async (req, res) => {
  const memberid = parseInt(req.params.id);
  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("members");
  const existingMember = await collection.findOne({ id: memberid });
  const updateMember = { ...existingMember, ...req.body };
  delete updateMember._id; // Menghapus properti _id dari objek yang diperbarui
  await collection.updateOne({ id: memberid }, { $set: updateMember });
  res.json(updateMember);
});

app.delete('/members/:id', async (req, res) => {
  const memberid = parseInt(req.params.id);
  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("members");
  const deletedProduct = await collection.findOneAndDelete({ id: memberid });
  res.send({ message: "Member deleted successfully" });
});

// -------------------------------------------------------  END MEMBER -----------------------------------------------

function generateId() {
  return Date.now();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
