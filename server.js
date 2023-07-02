const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "angular-example";

const app = express();
const port = 3000;


app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());

app.get("/products", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("products");
  let results = await collection.find({}).limit(50).toArray();
  res.json(results);
});

app.post("/products", upload.single('gambar'), async (req, res) => {
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

  // Hapus file gambar lama jika ada
  if (existingProduct.gambar) {
    const filePath = path.join(__dirname, 'uploads', existingProduct.gambar);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  // Jika file gambar diunggah, simpan file baru dan perbarui data gambar pada produk
  if (req.file) {
    const updatedProduct = { ...existingProduct, ...req.body, gambar: req.file.filename };
    delete updatedProduct._id;
    await collection.updateOne({ id: productId }, { $set: updatedProduct });
    res.json(updatedProduct);
  } else {
    // Jika file gambar tidak diunggah, hanya perbarui data non-gambar pada produk
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

function generateId() {
  return Date.now();
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
