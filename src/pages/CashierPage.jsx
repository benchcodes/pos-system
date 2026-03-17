import { useState } from 'react'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M3.5 5H5.7L7.5 14H17.8L19.8 8H8.8" />
      <circle cx="9.2" cy="18.2" r="1.1" />
      <circle cx="16.6" cy="18.2" r="1.1" />
    </svg>
  )
}

function TableIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <rect x="5.5" y="6" width="13" height="4" rx="0.8" />
      <path d="M8 10V18" />
      <path d="M16 10V18" />
      <path d="M6.5 18H17.5" />
    </svg>
  )
}

// Category filter options shown above the product grid
const CATEGORIES = ['All', 'Coffee', 'Pastry', 'Dessert', 'Beverage', 'Tea']

// Tax rate applied on top of the subtotal
const TAX_RATE = 0.1
const TABLE_COUNT = 8

function formatMoney(value) {
  return `₱${Number(value).toFixed(2)}`
}

function CashierPage({
  onLogout,
  products = [],
  onProductsChange,
  onSalesChange,
}) {
  const [activeTab, setActiveTab] = useState('pos')
  const [selectedTableId, setSelectedTableId] = useState(1)
  const [tableCarts, setTableCarts] = useState(() =>
    Array.from({ length: TABLE_COUNT }, (_, index) => ({
      tableId: index + 1,
      items: [],
    }))
  )
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [localProducts, setLocalProducts] = useState([])
  const [, setLocalSales] = useState([])

  const managedProducts = Array.isArray(products) ? products : localProducts
  const setManagedProducts = onProductsChange ?? setLocalProducts
  const setSales = onSalesChange ?? setLocalSales

  // Filter products by search text and selected category
  const filteredProducts = managedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedTableCart =
    tableCarts.find((tableCart) => tableCart.tableId === selectedTableId)?.items ?? []

  // Add a product to the selected table cart; increments quantity if already present
  function addToCart(product) {
    setTableCarts((prevCarts) => {
      return prevCarts.map((tableCart) => {
        if (tableCart.tableId !== selectedTableId) {
          return tableCart
        }

        const existing = tableCart.items.find((item) => item.product.id === product.id)
        if (existing) {
          return {
            ...tableCart,
            items: tableCart.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        }

        return {
          ...tableCart,
          items: [...tableCart.items, { product, quantity: 1 }],
        }
      })
    })
  }

  function clearCart() {
    setTableCarts((prevCarts) =>
      prevCarts.map((tableCart) =>
        tableCart.tableId === selectedTableId
          ? { ...tableCart, items: [] }
          : tableCart
      )
    )
  }

  function handleCheckout() {
    if (selectedTableCart.length === 0) return

    const now = Date.now()
    const saleId = `SALE-${String(now).slice(-8)}`
    const subtotalValue = selectedTableCart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const taxValue = subtotalValue * TAX_RATE
    const totalValue = subtotalValue + taxValue

    const nextSale = {
      id: saleId,
      createdAt: now,
      paymentMethod: 'Cash',
      tableId: selectedTableId,
      items: selectedTableCart.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.product.price),
        lineTotal: Number(item.product.price) * item.quantity,
      })),
      subtotal: subtotalValue,
      tax: taxValue,
      total: totalValue,
    }

    setSales((prev) => [nextSale, ...prev])
    setManagedProducts((prev) =>
      prev.map((product) => {
        const soldItem = selectedTableCart.find((item) => item.product.id === product.id)
        if (!soldItem) return product

        return {
          ...product,
          stock: Math.max(0, Number(product.stock) - soldItem.quantity),
        }
      })
    )
    clearCart()
  }

  // Order totals
  const subtotal = selectedTableCart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const totalItems = selectedTableCart.reduce((sum, item) => sum + item.quantity, 0)

  const tableCards = tableCarts.map((tableCart) => ({
    id: tableCart.tableId,
    status: tableCart.items.length > 0 ? 'Occupied' : 'Available',
    itemCount: tableCart.items.reduce((sum, item) => sum + item.quantity, 0),
  }))

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif] md:h-screen md:flex-row md:overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className="flex w-full flex-col border-b border-[#e5e7eb] px-3 py-5 md:w-[190px] md:flex-shrink-0 md:border-r md:border-b-0">

        {/* App title */}
        <div className="mb-6 px-1">
          <h1 className="text-[1.05rem] font-bold text-[#0f2542]">POS System</h1>
          <p className="text-[0.78rem] text-[#6b7280]">Cashier</p>
        </div>

        {/* Navigation */}
        <nav>
          <button
            onClick={() => setActiveTab('pos')}
            className={`mb-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[0.88rem] font-semibold ${
              activeTab === 'pos'
                ? 'bg-[#dbe8ff] text-[#2563eb]'
                : 'text-[#374151] hover:bg-[#f3f4f6]'
            }`}
          >
            <span className="[&_svg]:size-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]">
              <CartIcon />
            </span>
            POS
          </button>

          <button
            onClick={() => setActiveTab('table')}
            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[0.88rem] font-semibold ${
              activeTab === 'table'
                ? 'bg-[#dbe8ff] text-[#2563eb]'
                : 'text-[#374151] hover:bg-[#f3f4f6]'
            }`}
          >
            <span className="[&_svg]:size-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]">
              <TableIcon />
            </span>
            Table
          </button>
        </nav>

        {/* Bottom: logged-in user and logout */}
        <div className="mt-auto px-1">
          <p className="text-[0.72rem] text-[#9ca3af]">Logged in as</p>
          <p className="mb-3 text-[0.88rem] font-bold text-[#0f2542]">Cashier</p>
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg border border-[#e5e7eb] px-3 py-2 text-[0.82rem] text-[#374151] hover:bg-[#f9fafb]"
          >
            <span>&#8594;</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Panel ── */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden border-[#e5e7eb] px-4 py-4 md:border-r md:px-6 md:py-5">
        {activeTab === 'pos' ? (
          <>
            <h2 className="mb-4 text-[1.25rem] font-bold text-[#0f2542]">Products</h2>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 w-full rounded-lg border border-[#e5e7eb] px-4 py-2 text-[0.88rem] text-[#374151] outline-none focus:border-[#2563eb]"
            />

            {/* Category filter buttons */}
            <div className="mb-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-[0.82rem] font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#2563eb] text-white'
                      : 'border border-[#e5e7eb] text-[#374151] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Scrollable product grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white text-left transition-shadow hover:border-[#2563eb] hover:shadow-sm"
                  >
                    {/* Image placeholder — swap with <img> when real images are available */}
                    <div className="h-[110px] bg-[#f3f4f6]" />
                    <div className="p-3">
                      <p className="font-semibold text-[#111827]">{product.name}</p>
                      <p className="text-[0.78rem] text-[#6b7280]">{product.category}</p>
                      <p className="mt-1 text-[0.88rem] font-bold text-[#2563eb]">
                        {formatMoney(product.price)}{' '}
                        <span className="text-[0.75rem] font-normal text-[#9ca3af]">
                          Stock: {product.stock}
                        </span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-[1.25rem] font-bold text-[#0f2542]">Table</h2>
            <p className="mb-4 text-[0.86rem] text-[#6b7280]">
              Choose a table before creating or continuing an order.
            </p>

            <div className="grid grid-cols-2 gap-3 pb-2 sm:grid-cols-3 lg:grid-cols-4">
              {tableCards.map((table) => (
                <button
                  key={table.id}
                  onClick={() => {
                    setSelectedTableId(table.id)
                    setActiveTab('pos')
                  }}
                  className={`rounded-xl border px-3 py-5 text-left transition-colors ${
                    selectedTableId === table.id
                      ? 'border-[#2563eb] bg-[#dbeafe]'
                      : table.status === 'Occupied'
                        ? 'border-[#fca5a5] bg-[#fff1f2] hover:bg-[#ffe4e6]'
                        : 'border-[#bfdbfe] bg-[#eff6ff] hover:bg-[#dbeafe]'
                  }`}
                >
                  <p className="text-[0.78rem] text-[#6b7280]">Table</p>
                  <p className="text-[1.1rem] font-bold text-[#0f2542]">#{table.id}</p>
                  <p
                    className={`mt-2 text-[0.78rem] font-semibold ${
                      table.status === 'Occupied' ? 'text-[#dc2626]' : 'text-[#2563eb]'
                    }`}
                  >
                    {table.status}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-[#6b7280]">
                    {table.itemCount} item{table.itemCount === 1 ? '' : 's'}
                  </p>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      {/* ── Current Order Panel ── */}
      <aside className="flex w-full flex-col border-t border-[#e5e7eb] px-5 py-5 md:w-[290px] md:flex-shrink-0 md:border-t-0">

        {/* Order header */}
        <h2 className="text-[1.05rem] font-bold text-[#0f2542]">Current Order</h2>
        <p className="text-[0.90rem] font-bold text-[#6b7280]">Table #{selectedTableId}</p>
        <p className="mb-3 text-[0.82rem] text-[#6b7280]">{totalItems} items</p>
        <hr className="mb-4 border-[#e5e7eb]" />

        {/* Cart items or empty state message */}
        <div className="flex-1 overflow-y-auto">
          {selectedTableCart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[0.88rem] text-[#9ca3af]">Cart is empty</p>
              <p className="text-[0.78rem] text-[#9ca3af]">
                Add items to start a sale for table #{selectedTableId}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTableCart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-[0.85rem]"
                >
                  <span className="text-[#374151]">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="font-semibold text-[#0f2542]">
                    {formatMoney(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order totals and action buttons */}
        <div className="mt-4 border-t border-[#e5e7eb] pt-4">
          <div className="mb-1 flex justify-between text-[0.85rem] text-[#374151]">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="mb-3 flex justify-between text-[0.85rem] text-[#374151]">
            <span>Tax (10%)</span>
            <span>{formatMoney(tax)}</span>
          </div>
          <div className="mb-4 flex justify-between text-[1rem] font-bold text-[#0f2542]">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>

          {/* Checkout: gray when empty, blue when cart has items */}
          <button
            onClick={handleCheckout}
            disabled={selectedTableCart.length === 0}
            className={`mb-2 w-full rounded-lg py-2.5 text-[0.9rem] font-semibold text-white transition-colors ${
              selectedTableCart.length === 0
                ? 'bg-[#9ca3af]'
                : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
            }`}
          >
            Checkout
          </button>

          <button
            onClick={clearCart}
            className="w-full rounded-lg border border-[#e5e7eb] py-2.5 text-[0.88rem] text-[#374151] hover:bg-[#f9fafb]"
          >
            Clear Cart
          </button>
        </div>
      </aside>
    </div>
  )
}

export default CashierPage
