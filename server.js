const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

// const upload = multer({ dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Menentukan folder penyimpanan untuk file yang diunggah
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
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

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.get("/products", async (req, res) => {
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("products");
  let results = await collection.find({}).limit(50).toArray();
  res.json(results);
});

// app.post("/products", upload.single('file'), async (req, res) => {
//   const file = req.file;
//   const product = req.body;
//   product.id = generateId();
  
//   await client.connect();
//   const db = client.db(dbName);
//   let collection = await db.collection("products");
//   await collection.insertOne(product);

//   res.status(201).json(product);
// });

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

app.put('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  console.log(productId);
  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("products");
  const existingProduct = await collection.findOne({ id: productId });
  const updatedProduct = { ...existingProduct, ...req.body };
  delete updatedProduct._id;
  await collection.updateOne({ id: productId }, { $set: updatedProduct });
  res.json(updatedProduct);
});

app.delete('/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id);

  await client.connect();
  const db = client.db(dbName);
  const collection = await db.collection("products");

  const deletedProduct = await collection.findOneAndDelete({ id: productId });

  if (deletedProduct.value) {
    res.json(deletedProduct.value);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Helper function to generate unique ID
function generateId() {
  return Date.now();
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
