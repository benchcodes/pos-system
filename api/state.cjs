const {
  collections,
  normalizeProductsForStorage,
  replaceAll,
  sendError,
  sendMethodNotAllowed,
  stripMongoId,
  toClientProduct,
} = require('./_shared.cjs')

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { products, ingredients, sales } = await collections()
      const [productList, ingredientList, salesList] = await Promise.all([
        products.find({}).sort({ id: 1 }).toArray(),
        ingredients.find({}).toArray(),
        sales.find({}).sort({ createdAt: -1 }).toArray(),
      ])

      return res.status(200).json({
        products: productList.map(toClientProduct),
        ingredients: ingredientList.map(stripMongoId),
        sales: salesList.map(stripMongoId),
      })
    } catch (error) {
      return sendError(res, error)
    }
  }

  if (req.method === 'PUT') {
    try {
      const rawProducts = Array.isArray(req.body?.products) ? req.body.products : []
      const ingredientList = Array.isArray(req.body?.ingredients) ? req.body.ingredients : []
      const salesList = Array.isArray(req.body?.sales) ? req.body.sales : []
      const productList = normalizeProductsForStorage(rawProducts)

      const { products, ingredients, sales } = await collections()

      await Promise.all([
        replaceAll(products, productList),
        replaceAll(ingredients, ingredientList),
        replaceAll(sales, salesList),
      ])

      return res.status(200).json({ ok: true })
    } catch (error) {
      return sendError(res, error, 400)
    }
  }

  return sendMethodNotAllowed(res, ['GET', 'PUT'])
}
