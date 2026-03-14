import { useState } from 'react'
import { products } from '../data/products'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path d="M3.5 5H5.7L7.5 14H17.8L19.8 8H8.8" />
      <circle cx="9.2" cy="18.2" r="1.1" />
      <circle cx="16.6" cy="18.2" r="1.1" />
    </svg>
  )
}

// Category filter options shown above the product grid
const CATEGORIES = ['All', 'Coffee', 'Pastry', 'Dessert', 'Beverage', 'Tea']

// Tax rate applied on top of the subtotal
const TAX_RATE = 0.1

function CashierPage({ onLogout }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])

  // Filter products by search text and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Add a product to the cart; increments quantity if already present
  function addToCart(product) {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
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

  // Order totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex h-screen overflow-hidden bg-white font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">

      {/* ── Left Sidebar ── */}
      <aside className="flex w-[190px] flex-shrink-0 flex-col border-r border-[#e5e7eb] px-3 py-5">

        {/* App title */}
        <div className="mb-6 px-1">
          <h1 className="text-[1.05rem] font-bold text-[#0f2542]">POS System</h1>
          <p className="text-[0.78rem] text-[#6b7280]">Cashier</p>
        </div>

        {/* Navigation */}
        <nav>
          <button className="flex w-full items-center gap-2 rounded-lg bg-[#dbe8ff] px-3 py-2 text-[0.88rem] font-semibold text-[#2563eb]">
            <span className="[&_svg]:size-4 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]">
              <CartIcon />
            </span>
            POS
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

      {/* ── Products Panel ── */}
      <main className="flex flex-1 flex-col overflow-hidden border-r border-[#e5e7eb] px-6 py-5">
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
          <div className="grid grid-cols-4 gap-3 pb-2">
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
                    ${product.price.toFixed(2)}{' '}
                    <span className="text-[0.75rem] font-normal text-[#9ca3af]">
                      Stock: {product.stock}
                    </span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── Current Order Panel ── */}
      <aside className="flex w-[290px] flex-shrink-0 flex-col px-5 py-5">

        {/* Order header */}
        <h2 className="text-[1.05rem] font-bold text-[#0f2542]">Current Order</h2>
        <p className="mb-3 text-[0.82rem] text-[#6b7280]">{totalItems} items</p>
        <hr className="mb-4 border-[#e5e7eb]" />

        {/* Cart items or empty state message */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[0.88rem] text-[#9ca3af]">Cart is empty</p>
              <p className="text-[0.78rem] text-[#9ca3af]">Add items to start a sale</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between text-[0.85rem]"
                >
                  <span className="text-[#374151]">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="font-semibold text-[#0f2542]">
                    ${(item.product.price * item.quantity).toFixed(2)}
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="mb-3 flex justify-between text-[0.85rem] text-[#374151]">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between text-[1rem] font-bold text-[#0f2542]">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Checkout: gray when empty, blue when cart has items */}
          <button
            disabled={cart.length === 0}
            className={`mb-2 w-full rounded-lg py-2.5 text-[0.9rem] font-semibold text-white transition-colors ${
              cart.length === 0 ? 'bg-[#9ca3af]' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
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
