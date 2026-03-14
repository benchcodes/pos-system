import { useMemo, useState } from 'react'

const LOW_STOCK_LIMIT = 20
const PRODUCT_CATEGORIES = ['Coffee', 'Pastry', 'Dessert', 'Beverage', 'Tea']

function CubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3.8L5 7.8L12 11.8L19 7.8L12 3.8Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8V16L12 20L19 16V8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12V20" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IngredientsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8.5 4.5H15.5L15 8.2H9L8.5 4.5Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 8.2V18.5C9 19.6 9.9 20.5 11 20.5H13C14.1 20.5 15 19.6 15 18.5V8.2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 12.3H16.5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="6.3" strokeWidth="1.8" />
      <path d="M15.8 15.8L19.3 19.3" strokeWidth="1.8" strokeLinecap="round" />
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

function formatCurrency(value) {
  return `₱${Number(value).toFixed(2)}`
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

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-[480px] rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <h3 className="text-[1.05rem] font-bold text-[#0f2542]">{title}</h3>
          <button
            onClick={onClose}
            className="grid size-7 place-items-center rounded-lg text-[#6b7280] hover:bg-[#f3f4f6] [&_svg]:size-4"
          >
            <XIcon />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[0.82rem] font-medium text-[#374151]">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-[0.9rem] text-[#111827] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20'

function ProductModal({ initial, onSave, onClose }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          category: initial.category,
          price: String(initial.price),
          stock: String(initial.stock),
        }
      : { name: '', category: 'Beverage', price: '0.00', stock: '0' }
  )
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.category.trim()) next.category = 'Category is required'
    if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) next.price = 'Enter a valid price'
    if (Number.isNaN(Number(form.stock)) || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      next.stock = 'Enter a valid whole number'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    onSave({
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    })
  }

  return (
    <Modal title={isEditing ? 'Edit Product' : 'Add Product'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Product Name">
          <input className={inputClass} value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="e.g. Espresso" />
          {errors.name && <span className="text-[0.78rem] text-red-500">{errors.name}</span>}
        </Field>
        <Field label="Category">
          <select className={inputClass} value={form.category} onChange={(event) => set('category', event.target.value)}>
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <span className="text-[0.78rem] text-red-500">{errors.category}</span>}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₱)">
            <input className={inputClass} type="number" min="0" step="0.01" value={form.price} onChange={(event) => set('price', event.target.value)} placeholder="0.00" />
            {errors.price && <span className="text-[0.78rem] text-red-500">{errors.price}</span>}
          </Field>
          <Field label="Stock (units)">
            <input className={inputClass} type="number" min="0" step="1" value={form.stock} onChange={(event) => set('stock', event.target.value)} placeholder="0" />
            {errors.stock && <span className="text-[0.78rem] text-red-500">{errors.stock}</span>}
          </Field>
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[0.88rem] text-[#374151] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]">
            {isEditing ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function IngredientModal({ initial, onSave, onClose }) {
  const isEditing = Boolean(initial)
  const [form, setForm] = useState(
    initial
      ? {
          name: initial.name,
          unit: initial.unit,
          quantity: String(initial.quantity),
          reorderLevel: String(initial.reorderLevel),
        }
      : { name: '', unit: '', quantity: '', reorderLevel: '' }
  )
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.unit.trim()) next.unit = 'Unit is required'
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
      next.quantity = 'Enter a valid quantity'
    }
    if (!form.reorderLevel || isNaN(Number(form.reorderLevel)) || Number(form.reorderLevel) < 0) {
      next.reorderLevel = 'Enter a valid reorder level'
    }
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    onSave({
      name: form.name.trim(),
      unit: form.unit.trim(),
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
    })
  }

  return (
    <Modal title={isEditing ? 'Edit Ingredient' : 'Add Ingredient'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Ingredient Name">
          <input className={inputClass} value={form.name} onChange={(event) => set('name', event.target.value)} placeholder="e.g. Coffee Beans" />
          {errors.name && <span className="text-[0.78rem] text-red-500">{errors.name}</span>}
        </Field>
        <Field label="Unit">
          <input className={inputClass} value={form.unit} onChange={(event) => set('unit', event.target.value)} placeholder="e.g. kg, liters, pcs" />
          {errors.unit && <span className="text-[0.78rem] text-red-500">{errors.unit}</span>}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity in Stock">
            <input className={inputClass} type="number" min="0" step="any" value={form.quantity} onChange={(event) => set('quantity', event.target.value)} placeholder="0" />
            {errors.quantity && <span className="text-[0.78rem] text-red-500">{errors.quantity}</span>}
          </Field>
          <Field label="Reorder Level">
            <input className={inputClass} type="number" min="0" step="any" value={form.reorderLevel} onChange={(event) => set('reorderLevel', event.target.value)} placeholder="0" />
            {errors.reorderLevel && <span className="text-[0.78rem] text-red-500">{errors.reorderLevel}</span>}
          </Field>
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-[#d1d5db] px-4 py-2 text-[0.88rem] text-[#374151] hover:bg-[#f9fafb]">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-[#2563eb] px-4 py-2 text-[0.88rem] font-semibold text-white hover:bg-[#1d4ed8]">
            {isEditing ? 'Save Changes' : 'Add Ingredient'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function InventoryPage({
  onLogout,
  sharedProducts,
  onProductsChange,
  sharedIngredients,
  onIngredientsChange,
}) {
  const [activeTab, setActiveTab] = useState('products')
  const [localProducts, setLocalProducts] = useState([])
  const [localIngredients, setLocalIngredients] = useState([])
  const [search, setSearch] = useState('')
  const [productModal, setProductModal] = useState(null)
  const [ingredientModal, setIngredientModal] = useState(null)

  const products = sharedProducts ?? localProducts
  const setProducts = onProductsChange ?? setLocalProducts
  const ingredients = sharedIngredients ?? localIngredients
  const setIngredients = onIngredientsChange ?? setLocalIngredients

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        (product.sku ?? '').toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
    )
  }, [products, search])

  const filteredIngredients = useMemo(() => {
    const term = search.toLowerCase()
    return ingredients.filter(
      (ingredient) =>
        ingredient.name.toLowerCase().includes(term) ||
        ingredient.unit.toLowerCase().includes(term)
    )
  }, [ingredients, search])

  const totalInventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.price * product.stock, 0),
    [products]
  )

  const lowStockCount = useMemo(
    () => products.filter((product) => product.stock < LOW_STOCK_LIMIT).length,
    [products]
  )

  const lowIngredientCount = useMemo(
    () => ingredients.filter((ingredient) => ingredient.quantity <= ingredient.reorderLevel).length,
    [ingredients]
  )

  function switchTab(tab) {
    setActiveTab(tab)
    setSearch('')
  }

  function handleSaveProduct(data) {
    if (productModal === 'add') {
      setProducts((prev) => {
        const nextId = prev.length === 0 ? 1 : Math.max(...prev.map((product) => product.id)) + 1
        return [...prev, { id: nextId, ...data }]
      })
    } else {
      setProducts((prev) => prev.map((product) => (product.id === productModal.id ? { ...product, ...data } : product)))
    }
    setProductModal(null)
  }

  function handleDeleteProduct(id) {
    setProducts((prev) => prev.filter((product) => product.id !== id))
  }

  function handleSaveIngredient(data) {
    if (ingredientModal === 'add') {
      setIngredients((prev) => [...prev, { id: crypto.randomUUID(), ...data }])
    } else {
      setIngredients((prev) => prev.map((ingredient) => (ingredient.id === ingredientModal.id ? { ...ingredient, ...data } : ingredient)))
    }
    setIngredientModal(null)
  }

  function handleDeleteIngredient(id) {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] text-[#0f172a]">
      <aside className="flex w-[206px] flex-shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
        <div className="border-b border-[#e5e7eb] px-4 py-4">
          <h1 className="text-[1.05rem] font-bold text-[#0f2542]">POS System</h1>
          <p className="mt-1 text-[0.84rem] text-[#64748b]">Inventory Manager</p>
        </div>

        <nav className="px-3 py-3">
          <button
            onClick={() => switchTab('products')}
            className={`mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[0.97rem] font-medium transition-colors ${
              activeTab === 'products' ? 'bg-[#dbe8ff] text-[#2563eb]' : 'text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <span className="size-4 [&_svg]:size-full [&_svg]:stroke-[1.9]">
              <CubeIcon />
            </span>
            Products
          </button>
          <button
            onClick={() => switchTab('ingredients')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-[0.97rem] font-medium transition-colors ${
              activeTab === 'ingredients' ? 'bg-[#dbe8ff] text-[#2563eb]' : 'text-[#111827] hover:bg-[#f3f4f6]'
            }`}
          >
            <span className="size-4 [&_svg]:size-full [&_svg]:stroke-[1.9]">
              <IngredientsIcon />
            </span>
            Ingredients
          </button>
        </nav>

        <div className="mt-auto px-3 pb-3">
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
            <p className="text-[0.72rem] text-[#6b7280]">Logged in as</p>
            <p className="mt-0.5 text-[0.88rem] font-bold text-[#0f2542]">Inventory Manager</p>
          </div>
          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-[0.9rem] font-medium text-[#0f172a] hover:bg-[#f9fafb]"
          >
            <span aria-hidden="true">-&gt;</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="px-5 pt-4 pb-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[2rem] leading-tight font-bold text-[#0f2542]">Inventory Management</h2>
              <p className="mt-1 text-[0.88rem] text-[#64748b]">
                {activeTab === 'products'
                  ? `${products.length} total products`
                  : `${ingredients.length} total ingredient${ingredients.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => (activeTab === 'products' ? setProductModal('add') : setIngredientModal('add'))}
              className="inline-flex items-center gap-2 rounded-lg bg-[#020617] px-4 py-2.5 text-[0.9rem] font-semibold text-white"
            >
              <span className="text-[1.05rem]">+</span>
              {activeTab === 'products' ? 'Add Product' : 'Add Ingredient'}
            </button>
          </div>

          {activeTab === 'products' ? (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-[#dbe8ff] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#2563eb] text-white [&_svg]:size-4">
                    <CubeIcon />
                  </div>
                  <div>
                    <p className="text-[0.86rem] text-[#2563eb]">Total Products</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f2542]">{products.length}</p>
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
                    <p className="text-[2rem] leading-none font-bold text-[#0f5132]">{formatCurrency(totalInventoryValue)}</p>
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
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-[#dbe8ff] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-[#2563eb] text-white [&_svg]:size-4">
                    <IngredientsIcon />
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
                    <p className="text-[0.86rem] text-[#16a34a]">Track Units</p>
                    <p className="text-[2rem] leading-none font-bold text-[#0f5132]">
                      {filteredIngredients.reduce((sum, item) => sum + item.quantity, 0).toFixed(0)}
                    </p>
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
          )}

          <label className="mt-4 flex items-center gap-2 rounded-lg bg-[#f3f4f6] px-3 py-2.5 text-[#6b7280]">
            <span className="[&_svg]:size-4">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={activeTab === 'products' ? 'Search products...' : 'Search ingredients...'}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border-none bg-transparent text-[0.92rem] text-[#111827] outline-none"
            />
          </label>
        </div>

        <section className="min-h-0 flex-1 border-t border-[#e5e7eb] bg-white px-5 pt-4 pb-5">
          <div className="h-full overflow-auto">
            {activeTab === 'products' ? (
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
                  {filteredProducts.map((product, index) => (
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
                      <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">{formatCurrency(product.price)}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">{product.stock}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3 font-semibold">{formatCurrency(product.price * product.stock)}</td>
                      <td className="border-b border-[#e5e7eb] px-3 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            aria-label={`Edit ${product.name}`}
                            onClick={() => setProductModal(product)}
                            className="grid size-8 place-items-center rounded-lg border border-[#d1d5db] text-[#334155] hover:bg-[#f8fafc] [&_svg]:size-4"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete ${product.name}`}
                            onClick={() => handleDeleteProduct(product.id)}
                            className="grid size-8 place-items-center rounded-lg border border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2] [&_svg]:size-4"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-3 py-8 text-center text-[0.9rem] text-[#6b7280]">
                        No products yet. Click Add Product to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
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
                  {filteredIngredients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-3 py-8 text-center text-[0.9rem] text-[#6b7280]">
                        No ingredients yet. Click Add Ingredient to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredIngredients.map((ingredient) => {
                      const isLow = ingredient.quantity <= ingredient.reorderLevel

                      return (
                        <tr key={ingredient.id} className="text-[0.95rem] text-[#111827]">
                          <td className="border-b border-[#e5e7eb] px-3 py-3 font-medium">{ingredient.name}</td>
                          <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.unit}</td>
                          <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.quantity}</td>
                          <td className="border-b border-[#e5e7eb] px-3 py-3">{ingredient.reorderLevel}</td>
                          <td className="border-b border-[#e5e7eb] px-3 py-3">
                            <span
                              className={`rounded-md px-2 py-1 text-[0.8rem] ${
                                isLow ? 'bg-[#fef2f2] text-[#b91c1c]' : 'bg-[#ecfdf3] text-[#166534]'
                              }`}
                            >
                              {isLow ? 'Low' : 'Good'}
                            </span>
                          </td>
                          <td className="border-b border-[#e5e7eb] px-3 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                aria-label={`Edit ${ingredient.name}`}
                                onClick={() => setIngredientModal(ingredient)}
                                className="grid size-8 place-items-center rounded-lg border border-[#d1d5db] text-[#334155] hover:bg-[#f8fafc] [&_svg]:size-4"
                              >
                                <PencilIcon />
                              </button>
                              <button
                                type="button"
                                aria-label={`Delete ${ingredient.name}`}
                                onClick={() => handleDeleteIngredient(ingredient.id)}
                                className="grid size-8 place-items-center rounded-lg border border-[#fecaca] text-[#ef4444] hover:bg-[#fef2f2] [&_svg]:size-4"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {productModal && (
        <ProductModal
          initial={productModal === 'add' ? null : productModal}
          onSave={handleSaveProduct}
          onClose={() => setProductModal(null)}
        />
      )}

      {ingredientModal && (
        <IngredientModal
          initial={ingredientModal === 'add' ? null : ingredientModal}
          onSave={handleSaveIngredient}
          onClose={() => setIngredientModal(null)}
        />
      )}
    </div>
  )
}

export default InventoryPage
