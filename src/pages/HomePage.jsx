import { useState } from 'react'
import CashierPage from './CashierPage'
import InventoryPage from './InventoryPage'
import AdminPage from './AdminPage'

const ROLE_OPTIONS = [
  {
    key: 'cashier',
    title: 'Cashier',
    description: 'Process sales and manage transactions',
    buttonText: 'Login as Cashier',
    accent: 'blue',
  },
  {
    key: 'inventory',
    title: 'Inventory Manager',
    description: 'Manage products and ingredient stock',
    buttonText: 'Login as Inventory Manager',
    accent: 'green',
  },
  {
    key: 'admin',
    title: 'Administrator',
    description: 'Full access to all features and analytics',
    buttonText: 'Login as Administrator',
    accent: 'purple',
  },
]

const NAVIGABLE_ROLES = new Set(['cashier', 'inventory', 'admin'])

const CARD_ACCENT_CLASSES = {
  blue: {
    icon: 'bg-[#dbe8ff] text-[#2563eb]',
    button: 'bg-[#2563eb]',
  },
  green: {
    icon: 'bg-[#d7f7e4] text-[#16a34a]',
    button: 'bg-[#16a34a]',
  },
  purple: {
    icon: 'bg-[#eadffd] text-[#9333ea]',
    button: 'bg-[#9333ea]',
  },
}

const ROLE_CARD_CLASS =
  'flex min-h-[255px] flex-col items-center rounded-xl border border-[#d6ddea] bg-white px-4 pt-5 pb-4 text-center'

const ICON_WRAPPER_CLASS =
  'mb-[0.95rem] grid size-[62px] place-items-center rounded-full [&_svg]:size-7 [&_svg]:fill-none [&_svg]:stroke-current [&_svg]:[stroke-linecap:round] [&_svg]:[stroke-linejoin:round] [&_svg]:[stroke-width:1.8]'

const ICON_BY_ROLE = {
  cashier: CartIcon,
  inventory: BoxIcon,
  admin: ShieldIcon,
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M3.5 5H5.7L7.5 14H17.8L19.8 8H8.8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.2" cy="18.2" r="1.1" strokeWidth="1.8" />
      <circle cx="16.6" cy="18.2" r="1.1" strokeWidth="1.8" />
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

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 3L18.5 5.5V11.4C18.5 15.3 15.8 18.7 12 20C8.2 18.7 5.5 15.3 5.5 11.4V5.5L12 3Z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RoleIcon({ roleKey }) {
  const IconComponent = ICON_BY_ROLE[roleKey] ?? ShieldIcon
  return <IconComponent />
}

function RoleCard({ role, onSelect }) {
  const accent = CARD_ACCENT_CLASSES[role.accent] ?? CARD_ACCENT_CLASSES.blue

  return (
    <article className={ROLE_CARD_CLASS}>
      <div
        className={`${ICON_WRAPPER_CLASS} ${accent.icon}`}
        aria-hidden="true"
      >
        <RoleIcon roleKey={role.key} />
      </div>

      <h2 className="mb-2 text-[1.4rem] leading-tight font-bold text-[#0f2542]">{role.title}</h2>
      <p className="min-h-[2.6em] text-[0.86rem] text-[#60708e]">{role.description}</p>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-auto cursor-pointer rounded-[0.45rem] border-none px-[0.95rem] py-[0.62rem] text-[0.9rem] font-semibold text-white ${accent.button}`}
      >
        {role.buttonText}
      </button>
    </article>
  )
}

function resolvePage(pageKey, onLogout) {
  if (pageKey === 'cashier') {
    return <CashierPage onLogout={onLogout} />
  }

  if (pageKey === 'inventory') {
    return <InventoryPage onLogout={onLogout} />
  }

  if (pageKey === 'admin') {
    return <AdminPage onLogout={onLogout} />
  }

  return null
}

function HomePage() {
  const [currentPage, setCurrentPage] = useState(null)
  const pageView = resolvePage(currentPage, () => setCurrentPage(null))

  if (pageView) {
    return pageView
  }

  function handleRoleSelect(roleKey) {
    if (NAVIGABLE_ROLES.has(roleKey)) {
      setCurrentPage(roleKey)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#e6ecf7] px-4 py-8 font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <section className="w-full max-w-[980px]">
        <header className="mb-5 text-center max-[900px]:mb-4">
          <h1 className="m-0 text-[clamp(2rem,4vw,2.35rem)] leading-tight font-bold text-[#0f2542]">
            POS System
          </h1>
          <p className="mt-[0.35rem] text-[0.95rem] text-[#50607e]">Select your role to continue</p>
        </header>

        <div className="grid gap-4 min-[901px]:grid-cols-3 max-[900px]:mx-auto max-[900px]:max-w-[360px]">
          {ROLE_OPTIONS.map((role) => (
            <RoleCard
              key={role.key}
              role={role}
              onSelect={() => handleRoleSelect(role.key)}
            />
          ))}
        </div>

        <footer className="mt-[1.05rem] text-center text-[0.82rem] text-[#7b89a1]">
          Demo System - Click any role to access
        </footer>
      </section>
    </main>
  )
}

export default HomePage