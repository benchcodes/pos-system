import {
  collections,
  generateSku,
  parseProductPayload,
  sendError,
  sendMethodNotAllowed,
  toClientProduct,
} from '../_shared.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { products } = await collections()
      const list = await products.find({}).sort({ id: 1 }).toArray()
      return res.status(200).json(list.map(toClientProduct))
    } catch (error) {
      return sendError(res, error)
    }
  }

  if (req.method === 'POST') {
    try {
      const payload = parseProductPayload(req.body)
      const { products } = await collections()

      const latest = await products.find({}).sort({ id: -1 }).limit(1).toArray()
      const nextId = latest.length === 0 ? 1 : Number(latest[0].id) + 1
      const nextSku = generateSku(nextId)

      const newProduct = { id: nextId, sku: nextSku, ...payload }
      await products.insertOne(newProduct)

      return res.status(201).json(toClientProduct(newProduct))
    } catch (error) {
      return sendError(res, error, 400)
    }
  }

  return sendMethodNotAllowed(res, ['GET', 'POST'])
}
