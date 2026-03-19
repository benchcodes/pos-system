const express = require('express');
const cors = require('cors');
const { connectToMongoDB, getDb } = require('./connect.cjs');

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

function productsCollection() {
  return getDb().collection('products');
}

function ingredientsCollection() {
  return getDb().collection('ingredients');
}

function salesCollection() {
  return getDb().collection('sales');
}

function toClientProduct(doc) {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    id: Number(rest.id),
  };
}

function stripMongoId(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

function generateSku(id) {
  return `SKU-${String(id).padStart(4, '0')}`;
}

function normalizeProductsForStorage(products) {
  const usedSkus = new Set();

  return products.map((product, index) => {
    const payload = parseProductPayload(product);
    const parsedId = Number(product.id);
    const id = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : index + 1;

    let sku = String(product.sku ?? '').trim().toUpperCase();
    if (!sku) {
      sku = generateSku(id);
    }

    let uniqueSku = sku;
    let suffix = 1;
    while (usedSkus.has(uniqueSku)) {
      uniqueSku = `${sku}-${suffix}`;
      suffix += 1;
    }
    usedSkus.add(uniqueSku);

    return {
      id,
      sku: uniqueSku,
      ...payload,
    };
  });
}

async function replaceAll(collection, docs) {
  await collection.deleteMany({});
  if (docs.length > 0) {
    await collection.insertMany(docs);
  }
}

function parseProductPayload(payload = {}) {
  const name = String(payload.name ?? '').trim();
  const category = String(payload.category ?? '').trim();
  const price = Number(payload.price);
  const stock = Number(payload.stock);

  if (!name) {
    throw new Error('name is required');
  }
  if (!category) {
    throw new Error('category is required');
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error('price must be a non-negative number');
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('stock must be a non-negative integer');
  }

  return { name, category, price, stock };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/products', async (_req, res) => {
  try {
    const products = await productsCollection().find({}).sort({ id: 1 }).toArray();
    res.json(products.map(toClientProduct));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/ingredients', async (_req, res) => {
  try {
    const ingredients = await ingredientsCollection().find({}).toArray();
    res.json(ingredients.map(stripMongoId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/sales', async (_req, res) => {
  try {
    const sales = await salesCollection().find({}).sort({ createdAt: -1 }).toArray();
    res.json(sales.map(stripMongoId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/state', async (_req, res) => {
  try {
    const [products, ingredients, sales] = await Promise.all([
      productsCollection().find({}).sort({ id: 1 }).toArray(),
      ingredientsCollection().find({}).toArray(),
      salesCollection().find({}).sort({ createdAt: -1 }).toArray(),
    ]);

    res.json({
      products: products.map(toClientProduct),
      ingredients: ingredients.map(stripMongoId),
      sales: sales.map(stripMongoId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const rawProducts = Array.isArray(req.body?.products) ? req.body.products : [];
    const ingredients = Array.isArray(req.body?.ingredients) ? req.body.ingredients : [];
    const sales = Array.isArray(req.body?.sales) ? req.body.sales : [];
    const products = normalizeProductsForStorage(rawProducts);

    await Promise.all([
      replaceAll(productsCollection(), products),
      replaceAll(ingredientsCollection(), ingredients),
      replaceAll(salesCollection(), sales),
    ]);

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const payload = parseProductPayload(req.body);
    const latest = await productsCollection().find({}).sort({ id: -1 }).limit(1).toArray();
    const nextId = latest.length === 0 ? 1 : Number(latest[0].id) + 1;
    const nextSku = generateSku(nextId);

    const newProduct = { id: nextId, sku: nextSku, ...payload };
    await productsCollection().insertOne(newProduct);

    res.status(201).json(toClientProduct(newProduct));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'invalid product id' });
    }

    const existingProduct = await productsCollection().findOne({ id });
    if (!existingProduct) {
      return res.status(404).json({ message: 'product not found' });
    }

    const payload = parseProductPayload(req.body);
    let sku = String(req.body?.sku ?? existingProduct.sku ?? '').trim().toUpperCase();
    if (!sku) {
      sku = generateSku(id);
    }

    const duplicateSku = await productsCollection().findOne({ sku, id: { $ne: id } });
    if (duplicateSku) {
      return res.status(400).json({ message: 'sku already exists' });
    }

    const result = await productsCollection().updateOne(
      { id },
      { $set: { ...payload, sku } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    const updatedProduct = await productsCollection().findOne({ id });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'product not found' });
    }

    return res.json(toClientProduct(updatedProduct));
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'invalid product id' });
    }

    const result = await productsCollection().deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'product not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

async function start() {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API server:', error);
  process.exit(1);
});
