const { getDb } = require('./_db.cjs')

function sendMethodNotAllowed(res, methods) {
  res.setHeader('Allow', methods.join(', '))
  res.status(405).json({ message: 'Method Not Allowed' })
}

function sendError(res, error, status = 500) {
  res.status(status).json({ message: error?.message || 'Internal Server Error' })
}

function toClientProduct(doc) {
  const { _id, ...rest } = doc
  return {
    ...rest,
    id: Number(rest.id),
  }
}

function stripMongoId(doc) {
  const { _id, ...rest } = doc
  return rest
}

function generateSku(id) {
  return `SKU-${String(id).padStart(4, '0')}`
}

function parseProductPayload(payload = {}) {
  const name = String(payload.name ?? '').trim()
  const category = String(payload.category ?? '').trim()
  const price = Number(payload.price)
  const stock = Number(payload.stock)

  if (!name) {
    throw new Error('name is required')
  }
  if (!category) {
    throw new Error('category is required')
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new Error('price must be a non-negative number')
  }
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('stock must be a non-negative integer')
  }

  return { name, category, price, stock }
}

function normalizeProductsForStorage(products) {
  const usedSkus = new Set()

  return products.map((product, index) => {
    const payload = parseProductPayload(product)
    const parsedId = Number(product.id)
    const id = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : index + 1

    let sku = String(product.sku ?? '').trim().toUpperCase()
    if (!sku) {
      sku = generateSku(id)
    }

    let uniqueSku = sku
    let suffix = 1
    while (usedSkus.has(uniqueSku)) {
      uniqueSku = `${sku}-${suffix}`
      suffix += 1
    }
    usedSkus.add(uniqueSku)

    return {
      id,
      sku: uniqueSku,
      ...payload,
    }
  })
}

async function replaceAll(collection, docs) {
  await collection.deleteMany({})
  if (docs.length > 0) {
    await collection.insertMany(docs)
  }
}

async function collections() {
  const db = await getDb()
  return {
    products: db.collection('products'),
    ingredients: db.collection('ingredients'),
    sales: db.collection('sales'),
  }
}

module.exports = {
  collections,
  generateSku,
  normalizeProductsForStorage,
  parseProductPayload,
  replaceAll,
  sendError,
  sendMethodNotAllowed,
  stripMongoId,
  toClientProduct,
}
