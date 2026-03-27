import { useEffect, useMemo, useState } from 'react'
import { getNextStaffCode, loadStoredStaff, STAFF_STORAGE_KEY } from '../data/staff'

const CATEGORIES = ['All', 'Coffee', 'Pastry', 'Dessert', 'Beverage', 'Tea']
const TAX_RATE = 0.1
const LOW_STOCK_LIMIT = 20

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3.5 5H5.7L7.5 14H17.8L19.8 8H8.8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.2" cy="18.2" r="1.1" />
      <circle cx="16.6" cy="18.2" r="1.1" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3.8L5 7.8L12 11.8L19 7.8L12 3.8Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8V16L12 20L19 16V8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12V20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IngredientIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8.5 4.5H15.5L15 8.2H9L8.5 4.5Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8.2V18.5C9 19.6 9.9 20.5 11 20.5H13C14.1 20.5 15 19.6 15 18.5V8.2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12.3H16.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M7 6.2H17" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 10.2H17" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 14.2H13" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5.5 4.2H18.5V19.8H5.5V4.2Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.8 17.5H18.7" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16.75 15.6V19.4" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="4.5" y="4.5" width="6" height="6" rx="1" strokeWidth="1.8" />
      <rect x="13.5" y="4.5" width="6" height="6" rx="1" strokeWidth="1.8" />
      <rect x="4.5" y="13.5" width="6" height="6" rx="1" strokeWidth="1.8" />
      <rect x="13.5" y="13.5" width="6" height="6" rx="1" strokeWidth="1.8" />
    </svg>
  )
}

function StaffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="7.5" r="3" strokeWidth="1.8" />
      <path d="M5.5 18.5C6.4 15.9 8.8 14.3 12 14.3C15.2 14.3 17.6 15.9 18.5 18.5" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="6.3" strokeWidth="1.8" />
      <path d="M15.8 15.8L19.3 19.3" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 5.3V18.7" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.2 8.4C15.2 7.2 13.7 6.2 12 6.2C10.3 6.2 8.8 7.2 8.8 8.4C8.8 11.1 15.2 10 15.2 13C15.2 14.3 13.7 15.3 12 15.3C10.3 15.3 8.8 14.3 8.8 13" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 8V12.3" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none" />
      <path d="M10.3 4.8L3.7 16.5C3.2 17.3 3.9 18.3 4.8 18.3H19.2C20.1 18.3 20.8 17.3 20.3 16.5L13.7 4.8C13.2 4 10.8 4 10.3 4.8Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4.8 16.8L4 20L7.2 19.2L17.6 8.8L15.2 6.4L4.8 16.8Z" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.9 7.7L16.3 10.1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8.4 8.4V17" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 8.4V17" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15.6 8.4V17" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M5.2 6.4H18.8" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.2 4.5H14.8" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.6 6.4V18.2C6.6 19 7.2 19.6 8 19.6H16C16.8 19.6 17.4 19 17.4 18.2V6.4" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M6 6L18 18" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6L6 18" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ProductModal({ initialProduct, onSubmit, onClose }) {
  const isEditing = Boolean(initialProduct)
  const [form, setForm] = useState(
    initialProduct
      ? {
          name: initialProduct.name,
          category: initialProduct.category,
          price: String(initialProduct.price),
          stock: String(initialProduct.stock),
        }
      : {
          name: '',
          category: 'Beverage',
          price: '0.00',
          stock: '0',
        }
  )
  const [errors, setErrors] = useState({})

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Product name is required.'
    if (!form.category.trim()) next.category = 'Category is required.'

    const priceValue = Number(form.price)
    if (Number.isNaN(priceValue) || priceValue < 0) {
      next.price = 'Enter a valid price.'
    }

    const stockValue = Number(form.stock)
    if (!Number.isInteger(stockValue) || stockValue < 0) {
      next.stock = 'Stock must be a whole number.'
    }

    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-[500px] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h3 className="text-[1.05rem] font-bold text-[#0f2542]">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] [&_svg]:size-4"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          <div className="grid gap-3">
            <label className="text-[0.83rem] font-medium text-[#374151]">
              Product Name
              <input
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
              />
              {errors.name && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.name}</span>}
            </label>

            <label className="text-[0.83rem] font-medium text-[#374151]">
              Category
              <select
                value={form.category}
                onChange={(event) => setField('category', event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
              >
                {CATEGORIES.filter((item) => item !== 'All').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.category}</span>}
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[0.83rem] font-medium text-[#374151]">
                Price (₱)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setField('price', event.target.value)}
                  onFocus={(event) => {
                    if (event.target.value === '0' || event.target.value === '0.00') {
                      event.target.select()
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                />
                {errors.price && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.price}</span>}
              </label>

              <label className="text-[0.83rem] font-medium text-[#374151]">
                Stock
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(event) => setField('stock', event.target.value)}
                  onFocus={(event) => {
                    if (event.target.value === '0') {
                      event.target.select()
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                />
                {errors.stock && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.stock}</span>}
              </label>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[0.85rem] text-[#374151] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#1d4ed8]"
            >
              {isEditing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function IngredientModal({ initialIngredient, onSubmit, onClose }) {
  const isEditing = Boolean(initialIngredient)
  const [form, setForm] = useState(
    initialIngredient
      ? {
          name: initialIngredient.name,
          unit: initialIngredient.unit,
          quantity: String(initialIngredient.quantity),
          reorderLevel: String(initialIngredient.reorderLevel),
        }
      : {
          name: '',
          unit: '',
          quantity: '0',
          reorderLevel: '0',
        }
  )
  const [errors, setErrors] = useState({})

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Ingredient name is required.'
    if (!form.unit.trim()) next.unit = 'Unit is required.'

    const quantityValue = Number(form.quantity)
    if (Number.isNaN(quantityValue) || quantityValue < 0) {
      next.quantity = 'Enter a valid quantity.'
    }

    const reorderValue = Number(form.reorderLevel)
    if (Number.isNaN(reorderValue) || reorderValue < 0) {
      next.reorderLevel = 'Enter a valid reorder level.'
    }

    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    onSubmit({
      name: form.name.trim(),
      unit: form.unit.trim(),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-[500px] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h3 className="text-[1.05rem] font-bold text-[#0f2542]">
            {isEditing ? 'Edit Ingredient' : 'Add Ingredient'}
          </h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] [&_svg]:size-4"
          >
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          <div className="grid gap-3">
            <label className="text-[0.83rem] font-medium text-[#374151]">
              Ingredient Name
              <input
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
              />
              {errors.name && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.name}</span>}
            </label>

            <label className="text-[0.83rem] font-medium text-[#374151]">
              Unit
              <input
                value={form.unit}
                onChange={(event) => setField('unit', event.target.value)}
                className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                placeholder="e.g. kg, liters, pcs"
              />
              {errors.unit && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.unit}</span>}
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-[0.83rem] font-medium text-[#374151]">
                Quantity
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.quantity}
                  onChange={(event) => setField('quantity', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                />
                {errors.quantity && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.quantity}</span>}
              </label>

              <label className="text-[0.83rem] font-medium text-[#374151]">
                Reorder Level
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.reorderLevel}
                  onChange={(event) => setField('reorderLevel', event.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                />
                {errors.reorderLevel && <span className="mt-1 block text-[0.78rem] text-[#dc2626]">{errors.reorderLevel}</span>}
              </label>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[0.85rem] text-[#374151] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#1d4ed8]"
            >
              {isEditing ? 'Save Changes' : 'Add Ingredient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function getDisplaySku(product, index) {
  const prefixByCategory = {
    Coffee: 'COF',
    Pastry: 'PAS',
    Dessert: 'DES',
    Beverage: 'BEV',
    Tea: 'TEA',
  }
  const prefix = prefixByCategory[product.category] ?? 'GEN'
  const slug = product.name
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .map((part) => part.slice(0, 3).toUpperCase())
    .join('-')
    .slice(0, 7)
  const code = String(index + 1).padStart(3, '0')
  return `${prefix}-${slug}-${code}`
}

function formatMoney(value) {
  return `₱${Number(value).toFixed(2)}`
}

function formatDateTime(value) {
  return new Date(value).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function csvEscape(value) {
  const text = String(value ?? '')
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function AdminPage({
  onLogout,
  products: sharedProducts,
  onProductsChange,
  ingredients: sharedIngredients,
  onIngredientsChange,
  sales: sharedSales,
  onSalesChange,
  onResetAllData,
}) {
  const [activeSection, setActiveSection] = useState('pos')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [localManagedProducts, setLocalManagedProducts] = useState([])
  const managedProducts = sharedProducts ?? localManagedProducts
  const setManagedProducts = onProductsChange ?? setLocalManagedProducts
  const [productModalTarget, setProductModalTarget] = useState(null)
  const [localIngredients, setLocalIngredients] = useState([])
  const [ingredientModalTarget, setIngredientModalTarget] = useState(null)
  const [localSales, setLocalSales] = useState([])
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [staffMembers, setStaffMembers] = useState(() => loadStoredStaff())
  const [newStaffName, setNewStaffName] = useState('')
  const [staffFormError, setStaffFormError] = useState('')
  const ingredients = sharedIngredients ?? localIngredients
  const setIngredientsData = onIngredientsChange ?? setLocalIngredients
  const sales = sharedSales ?? localSales
  const setSales = onSalesChange ?? setLocalSales

  useEffect(() => {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffMembers))
  }, [staffMembers])

  const filteredProducts = managedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.sku ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredManagedProducts = managedProducts.filter((product) => {
    const term = search.toLowerCase()
    return (
      product.name.toLowerCase().includes(term) ||
      (product.sku ?? '').toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  })

  function addToCart(product) {
    setCart((prevCart) => {
      const availableStock = Math.max(0, Number(product.stock) || 0)
      if (availableStock <= 0) {
        return prevCart
      }

      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        if (existing.quantity >= availableStock) {
          return prevCart
        }

        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  function clearCart() {
    setCart([])
  }

  function handleCheckout() {
    if (cart.length === 0) return

    const now = Date.now()
    const saleId = `SALE-${String(now).slice(-8)}`
    const saleItems = cart.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: Number(item.product.price),
      lineTotal: Number(item.product.price) * item.quantity,
    }))

    const nextSale = {
      id: saleId,
      createdAt: now,
      paymentMethod: 'Cash',
      productSummary: saleItems
        .map((item) => `${item.name} x${item.quantity}`)
        .join(', '),
      items: saleItems,
      subtotal,
      tax,
      total,
    }

    setSales((prev) => [nextSale, ...prev])
    setManagedProducts((prev) =>
      prev.map((product) => {
        const soldItem = cart.find((item) => item.product.id === product.id)
        if (!soldItem) return product

        return {
          ...product,
          stock: Math.max(0, Number(product.stock) - soldItem.quantity),
        }
      })
    )
    setCart([])
  }

  function handleExportSalesCsv() {
    if (sales.length === 0) return

    const header = ['Sale ID', 'Date', 'Payment Method', 'Items', 'Subtotal', 'Tax', 'Total']
    const rows = sales.map((sale) => {
      const itemText = sale.items
        .map((item) => `${item.name} x${item.quantity}`)
        .join('; ')

      return [
        sale.id,
        formatDateTime(sale.createdAt),
        sale.paymentMethod,
        itemText,
        Number(sale.subtotal).toFixed(2),
        Number(sale.tax).toFixed(2),
        Number(sale.total).toFixed(2),
      ]
    })

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `sales-history-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalInventoryValue = managedProducts.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  )

  const lowStockCount = managedProducts.filter(
    (product) => product.stock < LOW_STOCK_LIMIT
  ).length

  const filteredIngredients = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return ingredients

    return ingredients.filter((ingredient) => {
      return ingredient.name.toLowerCase().includes(normalized) || ingredient.unit.toLowerCase().includes(normalized)
    })
  }, [ingredients, search])

  const filteredStaffMembers = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) {
      return staffMembers
    }

    return staffMembers.filter((staff) => {
      return (
        staff.name.toLowerCase().includes(normalized) ||
        staff.code.toLowerCase().includes(normalized)
      )
    })
  }, [staffMembers, search])

  const lowIngredientCount = useMemo(() => {
    return ingredients.filter((ingredient) => Number(ingredient.quantity) <= Number(ingredient.reorderLevel)).length
  }, [ingredients])

  const trackedIngredientUnits = useMemo(() => {
    const units = new Set(
      ingredients
        .map((ingredient) => ingredient.unit.trim().toLowerCase())
        .filter(Boolean)
    )
    return units.size
  }, [ingredients])

  const filteredSales = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return sales

    return sales.filter((sale) => {
      const itemNames = sale.items.map((item) => item.name).join(' ').toLowerCase()
      return (
        sale.id.toLowerCase().includes(normalized) ||
        sale.paymentMethod.toLowerCase().includes(normalized) ||
        itemNames.includes(normalized)
      )
    })
  }, [sales, search])

  const salesStats = useMemo(() => {
    const totalSales = sales.length
    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0)
    const averageSale = totalSales === 0 ? 0 : totalRevenue / totalSales

    return { totalSales, totalRevenue, averageSale }
  }, [sales])

  const dashboardTrends = useMemo(() => {
    const DAY_MS = 24 * 60 * 60 * 1000
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentStart = today.getTime() - 6 * DAY_MS
    const currentEnd = today.getTime() + DAY_MS
    const previousStart = currentStart - 7 * DAY_MS
    const previousEnd = currentStart

    const currentSales = sales.filter((sale) => sale.createdAt >= currentStart && sale.createdAt < currentEnd)
    const previousSales = sales.filter((sale) => sale.createdAt >= previousStart && sale.createdAt < previousEnd)

    const currentRevenue = currentSales.reduce((sum, sale) => sum + Number(sale.total), 0)
    const previousRevenue = previousSales.reduce((sum, sale) => sum + Number(sale.total), 0)
    const currentCount = currentSales.length
    const previousCount = previousSales.length
    const currentAverage = currentCount === 0 ? 0 : currentRevenue / currentCount
    const previousAverage = previousCount === 0 ? 0 : previousRevenue / previousCount

    function percentChange(currentValue, previousValue) {
      if (previousValue === 0) {
        if (currentValue === 0) return 0
        return null
      }

      return ((currentValue - previousValue) / previousValue) * 100
    }

    return {
      revenueChange: percentChange(currentRevenue, previousRevenue),
      salesChange: percentChange(currentCount, previousCount),
      averageOrderChange: percentChange(currentAverage, previousAverage),
    }
  }, [sales])

  function renderTrendLabel(change) {
    if (change === null) {
      return {
        text: 'No baseline',
        className: 'text-[#64748b]',
      }
    }

    if (change > 0) {
      return {
        text: `↑ ${Math.abs(change).toFixed(1)}%`,
        className: 'text-[#16a34a]',
      }
    }

    if (change < 0) {
      return {
        text: `↓ ${Math.abs(change).toFixed(1)}%`,
        className: 'text-[#ea580c]',
      }
    }

    return {
      text: '0.0%',
      className: 'text-[#64748b]',
    }
  }

  const revenueTrend = renderTrendLabel(dashboardTrends.revenueChange)
  const salesTrend = renderTrendLabel(dashboardTrends.salesChange)
  const averageOrderTrend = renderTrendLabel(dashboardTrends.averageOrderChange)

  const dashboardSeries = useMemo(() => {
    const dayFormat = new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric' })
    const keyFormat = new Intl.DateTimeFormat('en-CA')

    const days = []
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - index)

      days.push({
        key: keyFormat.format(date),
        label: dayFormat.format(date),
        revenue: 0,
        count: 0,
      })
    }

    const map = new Map(days.map((day) => [day.key, day]))

    sales.forEach((sale) => {
      const saleDate = new Date(sale.createdAt)
      saleDate.setHours(0, 0, 0, 0)
      const key = keyFormat.format(saleDate)
      const bucket = map.get(key)
      if (!bucket) return

      bucket.revenue += Number(sale.total)
      bucket.count += 1
    })

    return days
  }, [sales])

  const chartData = useMemo(() => {
    const width = 320
    const height = 160
    const maxRevenue = Math.max(1, ...dashboardSeries.map((item) => item.revenue))
    const maxCount = Math.max(1, ...dashboardSeries.map((item) => item.count))

    const points = dashboardSeries.map((item, index) => {
      const x = (index / Math.max(1, dashboardSeries.length - 1)) * width
      const revenueY = height - (item.revenue / maxRevenue) * height
      const countY = height - (item.count / maxCount) * height
      return { ...item, x, revenueY, countY }
    })

    return {
      width,
      height,
      points,
      revenuePath: points.map((point) => `${point.x},${point.revenueY}`).join(' '),
      countPath: points.map((point) => `${point.x},${point.countY}`).join(' '),
    }
  }, [dashboardSeries])

  const todaysMetrics = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todaysSales = sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt)
      saleDate.setHours(0, 0, 0, 0)
      return saleDate.getTime() === today.getTime()
    })

    return {
      revenue: todaysSales.reduce((sum, sale) => sum + Number(sale.total), 0),
      count: todaysSales.length,
    }
  }, [sales])

  const paymentMethodStats = useMemo(() => {
    const counts = new Map()
    sales.forEach((sale) => {
      const method = sale.paymentMethod || 'Unknown'
      counts.set(method, (counts.get(method) ?? 0) + 1)
    })

    return Array.from(counts.entries())
      .map(([method, count]) => ({ method, count }))
      .sort((left, right) => right.count - left.count)
  }, [sales])

  const revenueByCategory = useMemo(() => {
    const productCategory = new Map(
      managedProducts.map((product) => [String(product.name).toLowerCase(), product.category || 'Other'])
    )
    const sums = new Map()

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const category = productCategory.get(String(item.name).toLowerCase()) ?? 'Other'
        sums.set(category, (sums.get(category) ?? 0) + Number(item.lineTotal ?? 0))
      })
    })

    return Array.from(sums.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((left, right) => right.total - left.total)
      .slice(0, 5)
  }, [sales, managedProducts])

  const topSellingProducts = useMemo(() => {
    const quantity = new Map()
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        quantity.set(item.name, (quantity.get(item.name) ?? 0) + Number(item.quantity ?? 0))
      })
    })

    return Array.from(quantity.entries())
      .map(([name, sold]) => ({ name, sold }))
      .sort((left, right) => right.sold - left.sold)
      .slice(0, 5)
  }, [sales])

  const sectionTitle =
    activeSection === 'pos'
      ? 'Products'
      : activeSection === 'products'
        ? 'Product Catalog'
        : activeSection === 'ingredients'
          ? 'Ingredients'
          : activeSection === 'staff'
            ? 'Staff Management'
          : activeSection === 'sales'
            ? 'Sales History'
            : 'Dashboard'

  function navButtonClass(sectionKey) {
    return `mb-1.5 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${
      activeSection === sectionKey
        ? 'bg-[#dbe8ff] font-semibold text-[#2563eb]'
        : 'text-[#1f2937] hover:bg-[#eef2f7]'
    }`
  }

  function handleAddProduct() {
    setProductModalTarget('add')
  }

  function handleSaveProduct(formData) {
    if (productModalTarget === 'add') {
      setManagedProducts((prev) => {
        const nextId = prev.length === 0 ? 1 : Math.max(...prev.map((item) => item.id)) + 1
        const nextProduct = {
          id: nextId,
          ...formData,
          sku: `ADM-${String(nextId).padStart(3, '0')}`,
        }

        return [...prev, nextProduct]
      })
      setProductModalTarget(null)
      return
    }

    if (productModalTarget && typeof productModalTarget === 'object') {
      setManagedProducts((prev) =>
        prev.map((product) => {
          if (product.id !== productModalTarget.id) {
            return product
          }
          return { ...product, ...formData }
        })
      )
    }

    setProductModalTarget(null)
  }

  function handleDeleteProduct(productId) {
    setManagedProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  function handleSaveIngredient(payload) {
    if (ingredientModalTarget?.type === 'edit') {
      setIngredientsData((prev) =>
        prev.map((ingredient) =>
          ingredient.id === ingredientModalTarget.item.id ? { ...ingredient, ...payload } : ingredient
        )
      )
    } else {
      setIngredientsData((prev) => [...prev, { id: crypto.randomUUID(), ...payload }])
    }

    setIngredientModalTarget(null)
  }

  function handleDeleteIngredient(ingredientId) {
    setIngredientsData((prev) => prev.filter((ingredient) => ingredient.id !== ingredientId))
  }

  function handleConfirmResetAllData() {
    onResetAllData?.()
    setIsResetConfirmOpen(false)
  }

  function handleAddStaff() {
    const cleanedName = newStaffName.trim()
    if (!cleanedName) {
      setStaffFormError('Staff name is required.')
      return
    }

    const duplicateName = staffMembers.some(
      (staff) => staff.name.toLowerCase() === cleanedName.toLowerCase()
    )

    if (duplicateName) {
      setStaffFormError('Staff name already exists.')
      return
    }

    const nextStaff = {
      id: crypto.randomUUID(),
      name: cleanedName,
      code: getNextStaffCode(staffMembers),
      createdAt: Date.now(),
    }

    setStaffMembers((prev) => [...prev, nextStaff])
    setNewStaffName('')
    setStaffFormError('')
  }

  function handleDeleteStaff(staffId) {
    setStaffMembers((prev) => prev.filter((staff) => staff.id !== staffId))
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] md:h-screen md:flex-row md:overflow-hidden">
      <aside className="flex w-full flex-col border-b border-[#e5e7eb] bg-[#f9fafb] md:w-[206px] md:flex-shrink-0 md:border-r md:border-b-0">
        <div className="border-b border-[#e5e7eb] px-4 py-4">
          <h1 className="text-[1.05rem] font-bold text-[#0f2542]">POS System</h1>
          <p className="text-[0.78rem] text-[#6b7280]">Administrator</p>
        </div>

        <nav className="p-3 text-[0.88rem]">
          <button onClick={() => setActiveSection('pos')} className={navButtonClass('pos')}>
            <span className="[&_svg]:size-4"><CartIcon /></span>
            POS
          </button>
          <button onClick={() => setActiveSection('products')} className={navButtonClass('products')}>
            <span className="[&_svg]:size-4"><BoxIcon /></span>
            Products
          </button>
          <button onClick={() => setActiveSection('ingredients')} className={navButtonClass('ingredients')}>
            <span className="[&_svg]:size-4"><IngredientIcon /></span>
            Ingredients
          </button>
          <button onClick={() => setActiveSection('staff')} className={navButtonClass('staff')}>
            <span className="[&_svg]:size-4"><StaffIcon /></span>
            Staff
          </button>
          <button onClick={() => setActiveSection('sales')} className={navButtonClass('sales')}>
            <span className="[&_svg]:size-4"><SalesIcon /></span>
            Sales History
          </button>
          <button onClick={() => setActiveSection('dashboard')} className={navButtonClass('dashboard')}>
            <span className="[&_svg]:size-4"><DashboardIcon /></span>
            Dashboard
          </button>
        </nav>

        <div className="mt-auto p-3">
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f3f4f6] p-3">
            <p className="text-[0.72rem] text-[#9ca3af]">Logged in as</p>
            <p className="text-[1.25rem] leading-none font-bold text-[#0f2542]">Administrator</p>
          </div>
          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-[0.82rem] text-[#374151] hover:bg-[#f9fafb]"
          >
            <span>&#8594;</span>
            Logout
          </button>
        </div>
      </aside>

      {activeSection === 'products' ? (
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
          <div className="px-5 pt-4 pb-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Inventory Management</h2>
                <p className="mt-1 text-[0.88rem] text-[#64748b]">{managedProducts.length} total products</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="inline-flex items-center gap-2 rounded-lg bg-[#020617] px-4 py-2.5 text-[0.9rem] font-semibold text-white"
              >
                <span className="text-[1.05rem]">+</span>
                Add Product
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-[#dbe8ff] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#2563eb] text-white [&_svg]:size-4">
                    <BoxIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#2563eb]">Total Products</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f2542]">{managedProducts.length}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-[#dbf4e5] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#16a34a] text-white [&_svg]:size-4">
                    <MoneyIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#16a34a]">Inventory Value</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f5132]">{formatMoney(totalInventoryValue)}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-[#f9efe2] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#ea580c] text-white [&_svg]:size-4">
                    <AlertIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#ea580c]">Low Stock Items</p>
                    <p className="text-[2rem] leading-none font-bold text-[#78350f]">{lowStockCount}</p>
                  </div>
                </div>
              </article>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-lg bg-[#f3f4f6] px-3 py-2.5 text-[#6b7280]">
              <span className="[&_svg]:size-4"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
              />
            </label>
          </div>

          <section className="min-h-0 flex-1 border-t border-[#e5e7eb] bg-white px-5 pt-4 pb-5">
            <div className="h-full overflow-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="text-[0.85rem] text-[#111827]">
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Product</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">SKU</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Category</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Price</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Stock</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Value</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredManagedProducts.map((product, index) => (
                    <tr key={product.id} className="text-[0.95rem] text-[#111827]">
                      <td className="border-b border-[#e5e7eb] px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-md bg-[#eef2f7]" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3 text-[#35547f]">{product.sku ?? getDisplaySku(product, index)}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">
                        <span className="rounded-md bg-[#f3f4f6] px-2 py-1 text-[0.82rem]">{product.category}</span>
                      </td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">{formatMoney(product.price)}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">{product.stock}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">{formatMoney(product.price * product.stock)}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setProductModalTarget(product)}
                            className="grid size-8 place-items-center rounded-lg border border-[#d1d5db] text-[#334155] hover:bg-[#f8fafc] [&_svg]:size-4"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="grid size-8 place-items-center rounded-lg border border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2] [&_svg]:size-4"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {productModalTarget && (
            <ProductModal
              initialProduct={productModalTarget === 'add' ? null : productModalTarget}
              onSubmit={handleSaveProduct}
              onClose={() => setProductModalTarget(null)}
            />
          )}
        </main>
      ) : activeSection === 'ingredients' ? (
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
          <div className="px-5 pt-4 pb-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Ingredients Management</h2>
                <p className="mt-1 text-[0.88rem] text-[#64748b]">{ingredients.length} total ingredients</p>
              </div>
              <button
                onClick={() => setIngredientModalTarget({ type: 'add' })}
                className="inline-flex items-center gap-2 rounded-lg bg-[#020617] px-4 py-2.5 text-[0.9rem] font-semibold text-white"
              >
                <span className="text-[1.05rem]">+</span>
                Add Ingredient
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-[#dbe8ff] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#2563eb] text-white [&_svg]:size-4">
                    <IngredientIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#2563eb]">Total Ingredients</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f2542]">{ingredients.length}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-[#dbf4e5] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#16a34a] text-white [&_svg]:size-4">
                    <MoneyIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#16a34a]">Tracked Units</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f5132]">{trackedIngredientUnits}</p>
                  </div>
                </div>
              </article>

              <article className="rounded-xl bg-[#f9efe2] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#ea580c] text-white [&_svg]:size-4">
                    <AlertIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#ea580c]">Low Ingredient Stock</p>
                    <p className="text-[2rem] leading-none font-bold text-[#78350f]">{lowIngredientCount}</p>
                  </div>
                </div>
              </article>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-lg bg-[#f3f4f6] px-3 py-2.5 text-[#6b7280]">
              <span className="[&_svg]:size-4"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search ingredients..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
              />
            </label>
          </div>

          <section className="min-h-0 flex-1 border-t border-[#e5e7eb] bg-white px-5 pt-4 pb-5">
            <div className="h-full overflow-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="text-[0.85rem] text-[#111827]">
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Ingredient</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Unit</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Quantity</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Reorder Level</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Status</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient) => {
                    const isLow = Number(ingredient.quantity) <= Number(ingredient.reorderLevel)

                    return (
                      <tr key={ingredient.id} className="text-[0.95rem] text-[#111827]">
                        <td className="border-b border-[#e5e7eb] px-3 py-3 font-medium">{ingredient.name}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.unit}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.quantity}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.reorderLevel}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[0.76rem] font-semibold ${
                              isLow
                                ? 'bg-[#fee2e2] text-[#b91c1c]'
                                : 'bg-[#dcfce7] text-[#166534]'
                            }`}
                          >
                            {isLow ? 'Low' : 'Good'}
                          </span>
                        </td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIngredientModalTarget({ type: 'edit', item: ingredient })}
                              className="grid size-8 place-items-center rounded-lg border border-[#d1d5db] text-[#334155] hover:bg-[#f8fafc] [&_svg]:size-4"
                            >
                              <PencilIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteIngredient(ingredient.id)}
                              className="grid size-8 place-items-center rounded-lg border border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2] [&_svg]:size-4"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredIngredients.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-10 text-center text-[0.9rem] text-[#64748b]">
                        No ingredients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {ingredientModalTarget && (
            <IngredientModal
              initialIngredient={ingredientModalTarget.type === 'edit' ? ingredientModalTarget.item : null}
              onSubmit={handleSaveIngredient}
              onClose={() => setIngredientModalTarget(null)}
            />
          )}
        </main>
      ) : activeSection === 'staff' ? (
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
          <div className="border-b border-[#e5e7eb] bg-[#f3f4f6] px-5 pt-4 pb-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Staff Management</h2>
                <p className="mt-1 text-[0.9rem] text-[#64748b]">{staffMembers.length} registered staff members</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white p-3">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(event) => {
                    setNewStaffName(event.target.value)
                    setStaffFormError('')
                  }}
                  placeholder="Enter staff full name"
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] outline-none focus:border-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={handleAddStaff}
                  className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]"
                >
                  Add Staff
                </button>
              </div>
              {staffFormError && (
                <p className="mt-2 text-[0.8rem] text-[#dc2626]">{staffFormError}</p>
              )}
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-lg bg-[#e5e7eb] px-3 py-2.5 text-[#6b7280]">
              <span className="[&_svg]:size-4"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search by staff name or code..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
              />
            </label>
          </div>

          <section className="min-h-0 flex-1 overflow-auto border-t border-[#e5e7eb] bg-[#f8fafc] px-5 py-4">
            {filteredStaffMembers.length === 0 ? (
              <div className="grid h-full place-items-center text-center text-[#64748b]">
                <div>
                  <p className="text-[1.2rem] font-semibold text-[#0f2542]">No staff found</p>
                  <p className="mt-1 text-[0.9rem]">Add staff to enable Time In/Time Out.</p>
                </div>
              </div>
            ) : (
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="text-[0.85rem] text-[#111827]">
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Code</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Name</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Created</th>
                    <th className="border-b border-[#e5e7eb] px-3 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffMembers.map((staff) => (
                    <tr key={staff.id} className="text-[0.95rem] text-[#111827]">
                      <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold text-[#0f2542]">{staff.code}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">{staff.name}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3 text-[#475569]">{formatDateTime(staff.createdAt ?? Date.now())}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="grid size-8 place-items-center rounded-lg border border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2] [&_svg]:size-4"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      ) : activeSection === 'sales' ? (
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
          <div className="border-b border-[#e5e7eb] bg-[#f3f4f6] px-5 pt-4 pb-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div>
                <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Sales History</h2>
                <p className="mt-1 text-[0.9rem] text-[#64748b]">{filteredSales.length} transactions</p>
              </div>

              <button
                type="button"
                onClick={handleExportSalesCsv}
                disabled={sales.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-3.5 py-2 text-[0.85rem] font-semibold text-[#111827] hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="[&_svg]:size-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 4V14" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M8.5 10.5L12 14L15.5 10.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 18H19" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                Export CSV
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-[#dbe8ff] px-4 py-3">
                <p className="text-[0.87rem] text-[#2563eb]">Total Sales</p>
                <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f2542]">{salesStats.totalSales}</p>
              </article>

              <article className="rounded-xl bg-[#dbf4e5] px-4 py-3">
                <p className="text-[0.87rem] text-[#16a34a]">Total Revenue</p>
                <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f5132]">{formatMoney(salesStats.totalRevenue)}</p>
              </article>

              <article className="rounded-xl bg-[#efe7f8] px-4 py-3">
                <p className="text-[0.87rem] text-[#7e22ce]">Average Sale</p>
                <p className="mt-1 text-[2rem] leading-none font-bold text-[#6b21a8]">{formatMoney(salesStats.averageSale)}</p>
              </article>
            </div>

            <label className="mt-4 flex items-center gap-2 rounded-lg bg-[#e5e7eb] px-3 py-2.5 text-[#6b7280]">
              <span className="[&_svg]:size-4"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search by ID, payment method, or product..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
              />
            </label>
          </div>

          <section className="min-h-0 flex-1 overflow-auto border-t border-[#e5e7eb] bg-[#f8fafc]">
            {filteredSales.length === 0 ? (
              <div className="grid h-full place-items-center text-center text-[#64748b]">
                <div>
                  <p className="text-[1.85rem] text-[#d1d5db]">◌</p>
                  <p className="text-[1.2rem] font-semibold text-[#0f2542]">No sales found</p>
                  <p className="mt-1 text-[0.9rem]">Complete a sale to see it here</p>
                </div>
              </div>
            ) : (
              <div className="px-5 py-4">
                <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="text-[0.85rem] text-[#111827]">
                      <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Sale ID</th>
                      <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Date</th>
                      <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Items</th>
                      <th className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">Payment</th>
                      <th className="border-b border-[#e5e7eb] px-3 py-3 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="text-[0.92rem] text-[#111827]">
                        <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold text-[#0f2542]">{sale.id}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3 text-[#475569]">{formatDateTime(sale.createdAt)}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3 text-[#475569]">
                          {sale.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}
                        </td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3">{sale.paymentMethod}</td>
                        <td className="border-b border-[#e5e7eb] px-3 py-3 text-right font-semibold">{formatMoney(sale.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      ) : activeSection === 'dashboard' ? (
        <main className="flex min-w-0 flex-1 flex-col overflow-auto bg-[#f3f4f6] px-5 py-4">
          <header className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row">
            <div>
              <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Dashboard</h2>
              <p className="mt-1 text-[0.9rem] text-[#64748b]">Business overview and analytics</p>
            </div>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="rounded-lg border border-[#fecaca] bg-white px-3.5 py-2 text-[0.85rem] font-semibold text-[#dc2626] hover:bg-[#fef2f2]"
            >
              Reset All Data
            </button>
          </header>

          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-[#d9dee8] bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.88rem] text-[#334155]">Total Revenue</p>
                  <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f2542]">{formatMoney(salesStats.totalRevenue)}</p>
                  <p className={`mt-2 text-[0.88rem] font-semibold ${revenueTrend.className}`}>{revenueTrend.text}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg bg-[#dbe8ff] text-[#2563eb] [&_svg]:size-5">
                  <MoneyIcon />
                </span>
              </div>
            </article>

            <article className="rounded-xl border border-[#d9dee8] bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.88rem] text-[#334155]">Total Sales</p>
                  <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f2542]">{salesStats.totalSales}</p>
                  <p className={`mt-2 text-[0.88rem] font-semibold ${salesTrend.className}`}>{salesTrend.text}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg bg-[#d7f7e4] text-[#16a34a] [&_svg]:size-5">
                  <SalesIcon />
                </span>
              </div>
            </article>

            <article className="rounded-xl border border-[#d9dee8] bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.88rem] text-[#334155]">Avg Order Value</p>
                  <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f2542]">{formatMoney(salesStats.averageSale)}</p>
                  <p className={`mt-2 text-[0.88rem] font-semibold ${averageOrderTrend.className}`}>{averageOrderTrend.text}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg bg-[#f9efe2] text-[#ea580c] [&_svg]:size-5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 15L10 10L13.5 13.5L19 8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15 8H19V12" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </article>

            <article className="rounded-xl border border-[#d9dee8] bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[0.88rem] text-[#334155]">Today's Revenue</p>
                  <p className="mt-1 text-[2rem] leading-none font-bold text-[#0f2542]">{formatMoney(todaysMetrics.revenue)}</p>
                  <p className="mt-2 text-[0.88rem] text-[#64748b]">{todaysMetrics.count} sales</p>
                </div>
                <span className="grid size-10 place-items-center rounded-lg bg-[#efe7f8] text-[#9333ea] [&_svg]:size-5">
                  <BoxIcon />
                </span>
              </div>
            </article>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
              <h3 className="mb-3 text-[1.05rem] font-semibold text-[#0f2542]">Sales Trend (Last 7 Days)</h3>
              <div className="rounded-lg border border-[#e5e7eb] bg-[#fbfdff] p-3">
                <svg viewBox={`0 0 ${chartData.width} ${chartData.height + 20}`} className="h-[230px] w-full">
                  {[0, 1, 2, 3, 4].map((line) => {
                    const y = (line / 4) * chartData.height
                    return (
                      <line
                        key={`h-${line}`}
                        x1="0"
                        y1={y}
                        x2={chartData.width}
                        y2={y}
                        stroke="#d7dde6"
                        strokeDasharray="4 4"
                      />
                    )
                  })}

                  {chartData.points.map((point) => (
                    <line
                      key={`v-${point.label}`}
                      x1={point.x}
                      y1="0"
                      x2={point.x}
                      y2={chartData.height}
                      stroke="#e5e7eb"
                      strokeDasharray="3 5"
                    />
                  ))}

                  <polyline
                    points={chartData.revenuePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  <polyline
                    points={chartData.countPath}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {chartData.points.map((point) => (
                    <g key={`p-${point.label}`}>
                      <circle cx={point.x} cy={point.revenueY} r="2.8" fill="#2563eb" />
                      <circle cx={point.x} cy={point.countY} r="2.8" fill="#10b981" />
                      <text x={point.x} y={chartData.height + 16} textAnchor="middle" fontSize="11" fill="#475569">
                        {point.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              <div className="mt-2 flex gap-4 text-[0.88rem]">
                <p className="text-[#2563eb]">◦ Revenue (₱)</p>
                <p className="text-[#10b981]">◦ Sales Count</p>
              </div>
            </article>

            <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
              <h3 className="mb-3 text-[1.05rem] font-semibold text-[#0f2542]">Payment Methods</h3>
              {paymentMethodStats.length === 0 ? (
                <div className="grid h-[260px] place-items-center rounded-lg border border-dashed border-[#d9dee8] text-[#94a3b8]">
                  No payment data yet
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentMethodStats.map((method) => {
                    const width = Math.max(8, (method.count / salesStats.totalSales) * 100)
                    return (
                      <div key={method.method} className="rounded-lg border border-[#e5e7eb] p-3">
                        <div className="mb-1 flex items-center justify-between text-[0.9rem]">
                          <span className="font-medium text-[#0f2542]">{method.method}</span>
                          <span className="text-[#475569]">{method.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#e2e8f0]">
                          <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </article>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
              <h3 className="mb-3 text-[1.05rem] font-semibold text-[#0f2542]">Revenue by Category</h3>
              {revenueByCategory.length === 0 ? (
                <div className="grid h-[240px] place-items-center rounded-lg border border-dashed border-[#d9dee8] text-[#94a3b8]">
                  No category revenue yet
                </div>
              ) : (
                <div className="space-y-3">
                  {revenueByCategory.map((entry) => {
                    const width = Math.max(
                      8,
                      (entry.total / Math.max(revenueByCategory[0].total, 1)) * 100
                    )
                    return (
                      <div key={entry.category}>
                        <div className="mb-1 flex items-center justify-between text-[0.9rem]">
                          <span className="text-[#0f2542]">{entry.category}</span>
                          <span className="font-semibold text-[#334155]">{formatMoney(entry.total)}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[#e2e8f0]">
                          <div className="h-2.5 rounded-full bg-[#16a34a]" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </article>

            <article className="rounded-xl border border-[#d9dee8] bg-white p-4">
              <h3 className="mb-3 text-[1.05rem] font-semibold text-[#0f2542]">Top Selling Products</h3>
              {topSellingProducts.length === 0 ? (
                <div className="grid h-[240px] place-items-center text-[1.1rem] text-[#64748b]">
                  No sales data yet
                </div>
              ) : (
                <div className="space-y-2">
                  {topSellingProducts.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between rounded-lg border border-[#e5e7eb] px-3 py-2">
                      <span className="text-[0.92rem] text-[#0f2542]">{index + 1}. {item.name}</span>
                      <span className="text-[0.85rem] font-semibold text-[#2563eb]">{item.sold} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        </main>
      ) : (
        <>
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden border-[#e5e7eb] md:border-r">
            <div className="px-5 py-3">
              <h2 className="mb-3 text-[2rem] leading-tight font-bold text-[#0f2542]">{sectionTitle}</h2>
              <label className="mb-3 flex items-center gap-2 rounded-lg bg-[#f3f4f6] px-3 py-2.5 text-[#6b7280]">
                <span className="[&_svg]:size-4"><SearchIcon /></span>
                <input
                  type="text"
                  placeholder={
                    activeSection === 'ingredients'
                      ? 'Search ingredients...'
                      : activeSection === 'sales'
                        ? 'Search transactions...'
                        : activeSection === 'dashboard'
                          ? 'Search dashboard metrics...'
                          : 'Search products by name or SKU...'
                  }
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
                />
              </label>

              {activeSection === 'pos' && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-lg px-4 py-1.5 text-[0.82rem] font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#e5e7eb] px-5 pt-4 pb-4">
              {activeSection === 'pos' && (
                <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      disabled={Number(product.stock) <= 0}
                      className={`overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-left ${
                        Number(product.stock) <= 0
                          ? 'cursor-not-allowed opacity-60'
                          : 'hover:border-[#2563eb]'
                      }`}
                    >
                      <div className="h-[105px] bg-[#eef2f7]" />
                      <div className="p-3">
                        <p className="text-[1.85rem] leading-none text-[#93a0b4]">◉</p>
                        <p className="font-semibold text-[#111827]">{product.name}</p>
                        <p className="text-[0.78rem] text-[#6b7280]">{product.category}</p>
                        <p className="mt-1 text-[0.88rem] font-bold text-[#2563eb]">
                          {formatMoney(product.price)}{' '}
                          <span className="text-[0.75rem] font-normal text-[#9ca3af]">Stock: {product.stock}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}


            </div>
          </main>

          <aside className="flex w-full flex-col border-t border-[#e5e7eb] bg-white md:w-[320px] md:flex-shrink-0 md:border-l md:border-t-0">
            <div className="border-b border-[#e5e7eb] px-5 py-4">
              <h2 className="text-[1.05rem] font-bold text-[#0f2542]">
                {activeSection === 'pos' ? 'Current Order' : sectionTitle}
              </h2>
              <p className="text-[0.82rem] text-[#6b7280]">
                {activeSection === 'pos' ? `${totalItems} items` : 'Section panel'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {activeSection !== 'pos' ? (
                <div className="mt-12 text-center">
                  <p className="text-[0.95rem] text-[#6b7280]">{sectionTitle} is active.</p>
                  <p className="text-[0.88rem] text-[#9ca3af]">Use the left menu to switch sections.</p>
                </div>
              ) : cart.length === 0 ? (
                <div className="mt-12 text-center">
                  <p className="text-[1.7rem] text-[#c5ccd8]">⌀</p>
                  <p className="text-[0.95rem] text-[#6b7280]">Cart is empty</p>
                  <p className="text-[0.88rem] text-[#9ca3af]">Add items to start a sale</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-[0.85rem]">
                      <span className="text-[#374151]">{item.product.name} ×{item.quantity}</span>
                      <span className="font-semibold text-[#0f2542]">{formatMoney(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#e5e7eb] px-5 py-4">
              <div className="mb-1 flex justify-between text-[0.85rem] text-[#5b6677]">
                <span>Subtotal</span>
                <span>{activeSection === 'pos' ? formatMoney(subtotal) : formatMoney(0)}</span>
              </div>
              <div className="mb-2 flex justify-between text-[0.85rem] text-[#5b6677]">
                <span>Tax (10%)</span>
                <span>{activeSection === 'pos' ? formatMoney(tax) : formatMoney(0)}</span>
              </div>
              <div className="mb-3 flex justify-between text-[1rem] font-bold text-[#0f2542]">
                <span>Total</span>
                <span>{activeSection === 'pos' ? formatMoney(total) : formatMoney(0)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={activeSection !== 'pos' || cart.length === 0}
                className={`mb-2 w-full rounded-lg py-2.5 text-[0.9rem] font-semibold text-white ${
                  activeSection !== 'pos' || cart.length === 0 ? 'bg-[#8f8f9a]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                }`}
              >
                Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full rounded-lg border border-[#e5e7eb] py-2.5 text-[0.88rem] text-[#6b7280] hover:bg-[#f9fafb]"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </>
      )}

      {isResetConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
          onClick={(event) => event.target === event.currentTarget && setIsResetConfirmOpen(false)}
        >
          <div className="w-full max-w-[440px] rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
              <h3 className="text-[1.05rem] font-bold text-[#0f2542]">Confirm Reset</h3>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] [&_svg]:size-4"
              >
                <XIcon />
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-[0.92rem] text-[#475569]">
                This will permanently clear all saved products, ingredients, and sales data from this browser.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[0.85rem] text-[#374151] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetAllData}
                  className="rounded-lg bg-[#dc2626] px-4 py-2 text-[0.85rem] font-semibold text-white hover:bg-[#b91c1c]"
                >
                  Yes, Reset All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage