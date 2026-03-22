const {
  collections,
  generateSku,
  parseProductPayload,
  sendError,
  sendMethodNotAllowed,
  toClientProduct,
} = require('../_shared.cjs')

module.exports = async function handler(req, res) {
  const id = Number(req.query.id)
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'invalid product id' })
  }

  if (req.method === 'PUT') {
    try {
      const { products } = await collections()
      const existingProduct = await products.findOne({ id })
      if (!existingProduct) {
        return res.status(404).json({ message: 'product not found' })
      }

      const payload = parseProductPayload(req.body)
      let sku = String(req.body?.sku ?? existingProduct.sku ?? '').trim().toUpperCase()
      if (!sku) {
        sku = generateSku(id)
      }

      const duplicateSku = await products.findOne({ sku, id: { $ne: id } })
      if (duplicateSku) {
        return res.status(400).json({ message: 'sku already exists' })
      }

      await products.updateOne({ id }, { $set: { ...payload, sku } })

      const updated = await products.findOne({ id })
      if (!updated) {
        return res.status(404).json({ message: 'product not found' })
      }

      return res.status(200).json(toClientProduct(updated))
    } catch (error) {
      return sendError(res, error, 400)
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { products } = await collections()
      const result = await products.deleteOne({ id })

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'product not found' })
      }

      return res.status(204).send()
    } catch (error) {
      return sendError(res, error)
    }
  }

  return sendMethodNotAllowed(res, ['PUT', 'DELETE'])
}
